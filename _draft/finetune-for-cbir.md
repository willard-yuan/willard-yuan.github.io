---
layout: post
title: 图像检索：finetune pre-trained model for image retrieval
categories: [Image Retrieval]
tags: CBIR
---

作为迁移学习的一种，finetune能够将general的特征转变为special的特征，从而使得转移后的特征能够更好的适应目标任务，而图像检索最根本的问题，仍在于如何在目标任务上获得更好的特征表达(共性与可区分性)。一种很自然的方式便是在特定的检索任务上，我们对imageNet学得的general的特征通过finetune的方式，使得表达的特征能够更好的适应我们的检索任务。在[End-to-end Learning of Deep Visual Representations for Image Retrieval](https://arxiv.org/abs/1610.07940)和[Collaborative Index Embedding for Image Retrieval](https://www.computer.org/csdl/trans/tp/preprint/07867860.pdf)中已经很清楚的指出，通过基本的classification loss的finetune的方式，能够较大幅度的提高检索的mAP。因此，在本篇博文中，小白菜针对检索，主要整理了下面四个方面的内容：

- CNN网络中哪一层最适合于做图像检索
- 基于pre-trained模型做图像检索的几种典型的特征表示方法
- 抽取网络任意层的特征
- VGGNet16网络模型finetune实践

在采用深度学习做检索的时候，上面四方面的问题和知识基本都回避不了，因此，小白菜以为，掌握这四方面的内容显得非常有必要。

## 特征表达layer选择

在AlexNet和VGGNet提出伊始，也就是深度学习复兴之处，对于检索任务，小白菜相信，在使用pre-trained模型抽取特征的时候，我们最最自然最最容易想到的方式是抽取全连接层中的倒数第一层或者倒数第二层的特征，这里说的倒数第一层或者倒数第二层并没有具体指明是哪一层(fcx、fcx_relux、fcx_dropx)，以VggNet16网络为例，全连接层包含两层，fc6和fc7，因此我们很自然想到的网络层有fc6、fc6_relu6、fc7、fc7_relu7甚至fc6_drop6和fc7_drop7（后面会说明fc6_drop6和fc6_relu6是一样的，以及fc7_drop7和fc7_relu7也是一样的），所以即便对于我们最最自然最最容易想到的方式，也面临layer的选择问题。

## 抽取网络任意层的特征

为了掌握Caffe中网络任意一层的特征提取，不妨以一个小的题目来说明此问题。题目内容为：给定VGGNet16网络，抽取fc7、fc7_relu7以及fc7_drop7层的特征。  
求解过程：VggNet16中[deploy.txt](https://gist.githubusercontent.com/ksimonyan/211839e770f7b538e2d8/raw/0067c9b32f60362c74f4c445a080beed06b07eb3/VGG_ILSVRC_16_layers_deploy.prototxt)中跟fc7相关的层如下：

```sh
layers {
  bottom: "fc6"
  top: "fc7"
  name: "fc7"
  type: INNER_PRODUCT
  inner_product_param {
    num_output: 4096
  }
}
layers {
  bottom: "fc7"
  top: "fc7"
  name: "relu7"
  type: RELU
}
layers {
  bottom: "fc7"
  top: "fc7"
  name: "drop7"
  type: DROPOUT
  dropout_param {
    dropout_ratio: 0.5
  }
}
```

如果使用`net.blobs['fc7'].data[0]`，我们抽取的特征是fc7层的特征，也就是上面：

```sh
layers {
  bottom: "fc6"
  top: "fc7"
  name: "fc7"
  type: INNER_PRODUCT
  inner_product_param {
    num_output: 4096
  }
}
```
这一层的特征，仿照抽取fc7特征抽取的代码，我们很自然的想到抽取relu7的特征为`net.blobs['relu7'].data[0]`和drop7的特征为`net.blobs['drop7'].data[0]`，但是在运行的时候提示不存在`relu7`层和`drop7`层，原因是：

> To elaborate a bit further: The layers drop7 and relu7 have the same blobs as top and bottom, respectively, and as such the blobs' values are manipulated directly by the layers. The advantage is saving a bit of memory, with the drawback of not being able to read out the state the values had before being fed through these two layers. It is simply not saved anywhere. If you want to save it, you can just create another two blobs and re-wire the layers a bit.

摘自[Extracting 'relu' and 'drop' blobs with pycaffe](https://groups.google.com/forum/#!topic/caffe-users/766VK11Cnwo)，因而，为了能够提取relu7和drop7的特征，我们需要将上面的配置文件做些更改，主要是将layers里面的字段换下名字(在finetune模型的时候，我们也需要做类似的更改字段的操作)，这里小白菜改成了：

```sh
layers {
  bottom: "fc6"
  top: "fc7"
  name: "fc7"
  type: INNER_PRODUCT
  inner_product_param {
    num_output: 4096
  }
}
layers {
  bottom: "fc7"
  top: "fc7_relu7"
  name: "fc7_relu7"
  type: RELU
}
layers {
  bottom: "fc7"
  top: "fc7_drop7"
  name: "fc7_drop7"
  type: DROPOUT
  dropout_param {
    dropout_ratio: 0.5
  }
}
```
经过这样的修改后，我们使用`net.blobs['fc7_relu7'].data[0]`即可抽取到relu7的特征，使用`net.blobs['fc7_drop7'].data[0]`可抽取到drop7的特征。
