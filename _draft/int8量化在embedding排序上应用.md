---
layout: post
title: 向量检索：Scale Quantization在
categories: [Image Retrieval]
tags: ANN
---

> 本篇是对之前写过的几篇涉及到向量索引博文的系统整理和补充，分别为：
>
- [Asymmetry Problem in Computer Vision](https://yongyuan.name/blog/asymmetry-problem-in-computer-vision.html)
- [再叙ANN Search](http://yongyuan.name/blog/ann-search.html)
- [十亿规模的深度描述子如何有效索引](http://yongyuan.name/blog/index-billion-deep-descriptors.html)
- [基于内容的图像检索技术](http://yongyuan.name/blog/cbir-technique-summary.html)



在一些搜索、推荐排序场景，有的embedding由于模型较大，或者item上传后计算下便好，延迟几分钟不影响业务使用。举个例子，比如在短视频、文本作品类业务上，用户在上传短视频、文本类作品后，经过跨模态、多模态模型后，会得到embedding，这类应用场景，内容表征类的embedding模型通常会做得比较重。这类经过非实时计算的embedding，需要给搜索、推荐排序使用，比如直接将embedding作为排序模型输入，或者embedding间计算相似性后，作为排序模型输入。这类embedding，维度可能在16维、32维、64维甚至在128维。在排序的时候，需要非常实时的获取到embedding，一种方式如下：

