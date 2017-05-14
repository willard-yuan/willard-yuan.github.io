---
layout: post
title: 图像检索：finetune pre-trained model for image retrieval
categories: [Image Retrieval]
tags: CBIR
---

> 这个世界上肯定有另一个我，做着我不敢做的事，过着我想过的生活。一个人逛街，一个人吃饭，一个人旅行，一个人做很多事。极致的幸福，存在于孤独的深海。在这样日复一日的生活里，我逐渐和自己达成和解。

作为迁移学习的一种，finetune能够将general的特征转变为special的特征，从而使得转移后的特征能够更好的适应目标任务，而图像检索最根本的问题，仍在于如何在目标任务上获得更好的特征表达(共性与可区分性)。一种很自然的方式便是在特定的检索任务上，我们对imageNet学得的general的特征通过finetune的方式，使得表达的特征能够更好的适应我们的检索任务。在[End-to-end Learning of Deep Visual Representations for Image Retrieval](https://arxiv.org/abs/1610.07940)和[Collaborative Index Embedding for Image Retrieval](https://www.computer.org/csdl/trans/tp/preprint/07867860.pdf)中已经很清楚的指出，通过基本的classification loss的finetune的方式，能够较大幅度的提高检索的mAP。因此，在本篇博文中，小白菜针对检索，主要整理了下面四个方面的内容：

- CNN网络中哪一层最适合于做图像检索
- 基于pre-trained模型做图像检索几种典型的特征表示方法
- 抽取网络任意层的特征
- VGGNet16网络模型finetune实践

在采用深度学习做检索的时候，上面四方面的问题和知识基本都回避不了，因此，小白菜以为，掌握这四方面的内容显得非常有必要。

## 特征表达layer选择

在AlexNet和VGGNet提出伊始，对于检索任务，小白菜相信，在使用pre-trained模型抽取特征的时候，我们最最自然最最容易想到的方式是抽取全连接层中的倒数第一层或者倒数第二层的特征，这里说的倒数第一层或者倒数第二层并没有具体指明是哪一层（fcx、fcx_relux、fcx_dropx），以VggNet16网络为例，全连接层包含两层，fc6和fc7，因此我们很自然想到的网络层有fc6、fc6_relu6、fc7、fc7_relu7甚至fc6_drop6和fc7_drop7（后面会说明fc6_drop6和fc6_relu6是一样的，以及fc7_drop7和fc7_relu7也是一样的），所以即便对于我们最最自然最最容易想到的方式，也面临layer的选择问题。为此，我们以VGGNet16网络为例，来分析CNN网络的语义层(全连接层)选择不同层作为特征做object retrieval的mAP的影响。

小白菜选取fc6、fc6_relu6、fc7、fc7_relu7这四层语义层的特征，在[Oxford Building](http://www.robots.ox.ac.uk/~vgg/data/oxbuildings/)上进行实验，评价指标采用mAP，mAP的计算采用Oxford Building提供的计算mAP代码[compute_ap.cpp](http://www.robots.ox.ac.uk/~vgg/data/oxbuildings/compute_ap.cpp)，下表是fc6、fc6_relu6、fc7、fc7_relu7对应的mAP。

layer | mAP(128维) | mAP(4096维) | mAP(4096维, 未做PCA)
---|---|---|---|---|
fc7_relu7 | 44.72% | 1.11% | 41.08%
fc7 | 45.03% | 19.67% | 41.18%
fc6_relu6 | 43.62% | 23.0% | 43.34%
fc6 | 45.9% |19.47% | 44.78%

从上表可以看到，直接采用pre-trained模型抽取语义层的特征，在Oxford Building上取得的结果在45%左右，同时我们还可以看出，选取fc6、fc6_relu6、fc7、fc7_relu7对结果的影响并不大。这个结果只能说非常的一般，在基于pre-trained模型做object retrieval的方法中，比如[Cross-dimensional Weighting for Aggregated Deep Convolutional Features](https://arxiv.org/abs/1512.04065)、[Particular object retrieval with integral max-pooling of CNN activations](https://arxiv.org/abs/1511.05879)以及[What Is the Best Practice for CNNs Applied to Visual Instance Retrieval?](https://arxiv.org/abs/1611.01640)指出，选用上层的语义层其实是不利于object retrieval，因为上层的语义层丢失了object的空间信息，并且从实验的角度说明了**选取中间层的特征**更利于object retrieval。

实际上，在选取中间层来表达特征的过程中，我们可以去掉全连接层，从而使得我们可以摆脱掉输入图像尺寸约束(比如224*224)的约束，而保持原图大小的输入。通常，图像分辨率越大，对于分类、检测等图像任务是越有利，因而，从这一方面讲，**选取上层的全连接层作为特征，并不利于我们的object retrieval任务**。一种可能的猜想是，上层全连接层的语义特征，应该更适合做全局的相似。

虽然中间层更适合于做object retrieval，但是在选用中间层的feature map作为raw feature的时候，我们面临的一个主要问题是：如何将3d的tensor转成一个有效的向量特征表示？下面小白菜主要针对这一主要问题总结几种典型的特征表示方法，以及对中间层特征选择做一些探讨与实验。

## 基于pre-trained模型做Object Retrieval几种典型的特征表示

### SUM pooling

基于SUM pooling的中层特征表示方法，指的是针对中间层的任意一个channel（比如VGGNet16, pool5有512个channel），将该channel的feature map的所有像素值求和，这样每一个channel得到一个实数值，N个channel最终会得到一个长度为N的向量，该向量即为SUM pooling的结果。

### AVE pooling

AVE pooling就是average pooling，本质上它跟SUM pooling是一样的，只不过是将像素值求和后还除以了feature map的尺寸。小白菜以为，**AVE pooling可以带来一定意义上的平滑，可以减小图像尺寸变化的干扰**。设想一张224*224的图像，将其resize到448*448后，分别采用SUM pooling和AVE pooling对这两张图像提取特征，我们猜测的结果是，SUM pooling计算出来的余弦相似度相比于AVE pooling算出来的应该更小，也就是AVE pooling应该稍微优于SUM pooling一些。

### MAX pooling

MAX pooling指的是对于每一个channel（假设有N个channel），将该channel的feature map的像素值选取其中最大值作为该channel的代表，从而得到一个N维向量表示。小白菜在[flask-keras-cnn-image-retrieval](https://github.com/willard-yuan/flask-keras-cnn-image-retrieval/blob/master/extract_cnn_vgg16_keras.py)中采用的正是MAX pooling的方式。

上面所总结的SUM pooling、AVE pooling以及MAX pooling，这三种pooling方式，在小白菜做过的实验中，MAX pooling要稍微优于SUM pooling、AVE pooling。不过这三种方式的pooling对于object retrieval的提升仍然有限。

### CROW pooling

对于Object Retrieval，在使用CNN提取特征的时候，我们所希望的是在有物体的区域进行特征提取，就像提取局部特征比如SIFT特征构[BoW、VLAD、FV向量](http://yongyuan.name/blog/CBIR-BoF-VLAD-FV.html)的时候，可以采用MSER、Saliency等手段将SIFT特征限制在有物体的区域。同样基于这样一种思路，在采用CNN做Object Retrieval的时候，我们有两种方式来更细化Object Retrieval的特征：一种是先做物体检测然后在检测到的物体区域里面提取CNN特征；另一种方式是我们通过某种权重自适应的方式，加大有物体区域的权重，而减小非物体区域的权重。CROW pooling ( [Cross-dimensional Weighting for Aggregated Deep Convolutional Features](https://arxiv.org/abs/1512.04065) )即是采用的后一种方法，通过构建Spatial权重和Channel权重，CROW pooling能够在**一定程度上**加大感兴趣区域的权重，降低非物体区域的权重。其具体的特征表示构建过程如下图所示：

![](http://i300.photobucket.com/albums/nn17/willard-yuan/blog/crow_zpsaejbmsln.png)

其核心的过程是Spatial Weight和Channel Weight两个权重。Spatial Weight具体在计算的时候，是直接对每个channel的feature map求和相加，这个Spatial Weight其实可以理解为saliency map。我们知道，通过卷积滤波，响应强的地方一般都是物体的边缘等，因而将多个通道相加求和后，那些非零且响应大的区域，也一般都是物体所在的区域，因而我们可以将它作为feature map的权重。Channel Weight借用了IDF权重的思想，即对于一些高频的单词，比如“the”，这类词出现的频率非常大，但是它对于信息的表达其实是没多大用处的，也就是它包含的信息量太少了，因此在BoW模型中，这类停用词需要降低它们的权重。借用到Channel Weight的计算过程中，我们可以想象这样一种情况，比如某一个channel，其feature map每个像素值都是非零的，且都比较大，从视觉上看上去，白色区域占据了整个feature map，我们可以想到，这个channel的feature map是不利于我们去定位物体的区域的，因此我们需要降低这个channel的权重，而对于白色区域占feature map面积很小的channel，我们认为它对于定位物体包含有很大的信息，因此应该加大这种channel的权重。而这一现象跟IDF的思想特别吻合，所以作者采用了IDF这一权重定义了Channel Weight。

总体来说，这个Spatial Weight和Channel Weight的设计还是非常巧妙的，不过这样一种pooling的方式只能在一定程度上契合感兴趣区域，我们可以看一下Spatial Weight*Channel Weight的热力图：



### RMAC pooling

## 抽取网络任意层的特征

在上面一节中，我们频繁的对网络的不同层进行特征的抽取，并且我们还提到fc6_dropx和fc6_relux是一样的（比如fc7_drop7和fc7_relu7是一样的），这一节主要讲述使用Caffe抽取网络任意一层的特征，并从实验的角度验证fc6_dropx和fc6_relux是一样的这样一个结论。

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

## VGGNet16网络模型finetune实践
