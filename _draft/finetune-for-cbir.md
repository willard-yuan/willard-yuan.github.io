---
layout: post
title: 图像检索：finetune pre-trained model for image retrieval
categories: [Image Retrieval]
tags: CBIR
---

基于pre-trained模型的图像检索，除了通过合理的选择中间层特征来提高mAP外，另外一种方式即是通过finetune pre-trained的方式来提交检索的精度。在本篇博文中，小白菜会针对近期自己对一些论文的阅读以及实践，进行三方面的总结整理，内容包括如下：

- CNN网络中哪一层最适合于做图像检索
- 基于pre-trained模型做图像检索的几种典型的特征表示方法
- VGGNet16网络模型finetune实践
