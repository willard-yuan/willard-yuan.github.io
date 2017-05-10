---
layout: post
title: 图像检索：finetune pre-trained model for image retrieval
categories: [Image Retrieval]
tags: CBIR
---

作为迁移学习的一种，finetune能够将general的特征转变为special的特征，从而使得转移后的特征能够更好的适应目标任务，而图像检索最根本的问题，仍在于如何在目标任务上获得更好的特征表达(共性与可区分性)。一种很自然的方式便是在特定的检索任务上，我们对imageNet学得的general的特征通过finetune的方式，使得表达的特征能够更好的适应我们的检索任务。在[End-to-end Learning of Deep Visual Representations for Image Retrieval](https://arxiv.org/abs/1610.07940)和[Collaborative Index Embedding for Image Retrieval](https://www.computer.org/csdl/trans/tp/preprint/07867860.pdf)中已经很清楚的指出，通过基本的classification loss的finetune的方式，能够较大幅度的提高检索的mAP。因此，在本篇博文中，小白菜针对检索，主要回答下面三个方面的内容：

- CNN网络中哪一层最适合于做图像检索
- 基于pre-trained模型做图像检索的几种典型的特征表示方法
- VGGNet16网络模型finetune实践

在采用深度学习做检索的时候，上面三方面的问题和知识基本都回避不了，因此小白菜以为，掌握这三方面的内容显得非常有必要。

## 特征表达layer选择

在AlexNet和VGGNet提出伊始，也就是深度学习复兴之处，对于检索任务，小白菜相信，在使用pre-trained模型抽取特征的时候，我们最最自然最最容易想到的方式是抽取全连接层中的倒数一层
