---
layout: post
title: 图像检索：fisher vector从理论要点到工程实践
categories: [Image Retrieval]
tags: CBIR
---

> 春未老，风细柳斜斜，试上超然台上看，半壕春水一城花。

局部特征作为一种强鲁棒性的特征，其与全局特征构成了CV领域图像内容描述的基础。相比于全局特征，局部特征在刻画图像局部区域的内容时，往往能够做到更细的粒度，因而对图像内容的表征也更丰富，但同时也引发了新的问题，即**特征处理效率低、存储大等方面的问题**。因而需要将局部特征经过某种编码方式，最终表示成一种紧凑的全局特征表示。Fisher Vector作为连接单向连接局部特征到全局表示的三大特征编码方法之一（另外两种编码方式见[图像检索：BoF、VLAD、FV三剑客](http://yongyuan.name/blog/CBIR-BoF-VLAD-FV.html)），无论是在学术研究领域还是在工业实际应用上，都具有非常重要的地位。下面内容是小白菜**对Fisher Vector理论部分的温故，以及结合自己的实践经验对fisher vector的一个重新认知**的总结整理。需要说明的是，理论部分侧重于对Fisher Vector要点的提炼，对Fisher Vector更系统、更全面、更细节的认知，小白菜强力推荐阅读（温故）（[Image Classification with the Fisher Vector: Theory and Practice]()）。

## Fisher Vector

Fisher Vector从2007年最初提出[Fisher Kernels on Visual Vocabularies for Image Categorization]()到形成最终完善的理论[Fisher Kernels on Visual Vocabularies for Image Categorization]()，其背后有一套

### Fisher Kernel

可以说fisher vector是**fisher kernel在样本独立性假设基础上**的华丽转身版，如果没有fisher kernel这一父系理论以及金字塔中层样本独立性假设，就不会有fisher vector这一金字塔上层高富帅的小伙。如果要提炼fisher vector最重要的两样东西，小白菜以为一个公式和一个假设足矣。

### 样本独立性假设

将fisher kernel应用到图像上的时候，会假定各个局部特征之间是独立的，也就是各个局部特征是不相关的，这样局部特征集合的log似然函数的梯度便转化为各个局部特征的log似然函数的求和梯度，从而才有了fisher kernel到fisher vector的华丽转身。

### fisher vector索引前置处理
