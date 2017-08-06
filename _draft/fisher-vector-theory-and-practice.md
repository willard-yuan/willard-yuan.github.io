---
layout: post
title: 图像检索：fisher vector从理论要点到工程实践
categories: [Image Retrieval]
tags: CBIR
---

> 春未老，风细柳斜斜，试上超然台上看，半壕春水一城花。

局部特征作为一种强鲁棒性的特征，其与全局特征构成了CV领域图像内容描述的基础。相比于全局特征，局部特征在刻画图像局部区域的内容时，往往能够做到更细的粒度，因而对图像内容的表征也更丰富，但同时也引发了新的问题，即**特征处理效率低、存储大等方面的问题**。因此需要将局部特征经过某种编码方式，最终表示成一种紧凑的全局特征表示。fisher vector作为连接单向连接局部特征到全局表示的三大桥梁之一（另外两种编码方式见[图像检索：BoF、VLAD、FV三剑客](http://yongyuan.name/blog/CBIR-BoF-VLAD-FV.html)），无论是在学术研究领域还是在工业实际应用上，都具有非常重要的地位。下面内容是小白菜**对fisher vector理论部分的温故，以及结合自己的实践经验对fisher vector的一个重新认知**的总结。需要说明的是，理论部分侧重于对fisher vector要点的提炼，对fisher vector更系统、更全面、更细节的认知，小白菜强力推荐阅读（温故）（[Image Classification with the Fisher Vector: Theory and Practice]()）。

所谓温故知新，工科阅读理解的层次是一个由浅入深的过程，比如初次阅读，我们关注的重点是它是什么以及如何计算（生成）它，比较顺利理解下来后，我们会逐步去探寻为什么可以这样做或者它的理论依据是什么，后面才是一个实践验证的环节。通常后面两个环节会随着个人经验的累积而不断迭代，最后**经过N次迭代后，其方法的思想本质、过程理解才渗入个人认知体系，完成最高级形式的知识迁移**。哈哈，瞎掰这么多，其实就是想再次“推销”（[Image Classification with the Fisher Vector: Theory and Practice]() 一下，此文实在太赞。好了，小白菜要回到博客的主题上去了。

## fisher vector理论要点

