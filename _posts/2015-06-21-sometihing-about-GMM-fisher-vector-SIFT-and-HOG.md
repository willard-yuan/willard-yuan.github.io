---
layout: post
title: 机器视觉：GMM、fisher vector、SIFT与HOG特征资料
categories: [Image Retrieval]
tags: 图像检索
---

## GMM与fisher vector理解

查阅fisher vector资料时看到的几篇介绍fisher vector很不错的博文，要了解fisher vector你需要先了解GMM高斯混合模型，这两篇文章对GMM高斯混合模型讲解得很不错[GMM](http://www.duzhongxiang.com/gmm/)，[高斯混合模型](http://bucktoothsir.github.io/blog/2014/12/04/11-thblog/)。fisher vector讲解的博文比较多，查阅的时候，我觉得下面几篇博文对fv讲得还比较深入：[Fisher Vector](http://www.duzhongxiang.com/fisher-vector/)、[Fisher Vecotr(1)](http://bucktoothsir.github.io/blog/2014/11/24/9-th/)、[Fisher Vector(2)](http://bucktoothsir.github.io/blog/2014/11/27/10-theblog/)和[Fisher Vector 通俗学习](http://blog.csdn.net/ikerpeng/article/details/41644197)。

此外，查阅FV资料的时候还发现原来微信图像技术组也用到的FV：

>在图像检索领域，比较常用的技术是提取局部特征（如SIFT，SURF等），量化，建倒排表的架构，微信扫一扫中的封面识别就是采用这种技术。然而在图像云平台服务中，基于局部特征的的图像检索技术存在种种弊端。首先，在图像云平台服务中，每个开发者的图片数据都是相互独立的，若对所有开发者只建一个倒排表，每次开发者修改数据库时都会影响到所有开发者。若为每个开发者建立独享的倒排表，则会对资源造成巨大的浪费。其次，采用倒排结构时，开发者修改图像数据时（如增、删图片），都需要对整个倒排表进行重建。

>在图像识别云平台中，微信图像技术组采用了基于全局特征的图像检索方法，通过SIFT+Fisher  Vector得到一幅图像的全局描述子，然后通过量化，将全局描述子量化为低比特的码流，每幅图像对应一个图像识别指纹，在微信图像云平台服务中，已无需构建倒排表，开发者增、删图像时，后台只需在数据库对应的增加、删除指纹即可。对开发者的增删操作可以做出实时的响应。识别过程时，只需比对开发者数据库中的指纹即可。

>在识别效果上，通过对多个数据集测试，检索效果上均与基于倒排表结构的图像检索技术相当，甚至某些数据集上优于基于倒排表结构的技术。

原文链接：[微信图像开放平台：让你的应用看懂世界](http://djt.qq.com/article/view/1111)。

FV的Python实现代码[pyfishervector](https://github.com/jacobgil/pyfishervector/blob/master/fisher.py)与其对应的博文[Image Fisher Vector In Python](http://jacobcv.blogspot.com/2014/12/fisher-vector-in-python.html)，C++版本的可以参阅这里[bLDFV](https://github.com/constanton/bLDFV)。

## SIFT和HOG

此外，还发觉了几篇对SIFT、HOG讲解得比较好的博文：[SIFT算法](http://www.duzhongxiang.com/sift_algorithm/)，这篇文章讲SIFT讲得不是一般的好；[HOG特征(1)](http://bucktoothsir.github.io/blog/2014/02/26/thirdblog/)、[HOG特征(3)](http://bucktoothsir.github.io/blog/2014/02/26/secondblog/)和[HOG特征(3)](http://bucktoothsir.github.io/blog/2014/03/20/fourthblog/)，博文3对HOG的生成过程配合着图解说明讲得很赞。

最后，翻看的几篇很简短的总结，都是关于检索的，留着供以后查阅：[Spectral Hashing](http://hsinfu-blog.logdown.com/posts/207003-summarization-spectral-hashing)、[Product quantization for nearest neighbor search](http://hsinfu-blog.logdown.com/posts/184083-summarization-product-quantization-for-nearest-neighbor-search)、[Efficient visual search of videos cast as text retrieval](http://hsinfu-blog.logdown.com/posts/184036-summarization-efficient-visual-search-of-videos-cast-as-text-retrieval)、[热点技术探索：大规模相似检索](http://buptjz.github.io/2014/05/01/Near-Duplicate/)。

端午节下午所看的，以上。
