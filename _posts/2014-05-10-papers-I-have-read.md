---
layout: post
title: Papars已读列表
categories: [Machine Learning]
tags: 机器学习
---

对本小子读过的文章做个已读列表，方便自己查阅那些文章自己已读。

1. BING: Binarized Normed Gradients for Objectness Estimation at 300fp. CVPR 2014
2. Spectral Rotation versus K-Means in Spectral Clustering. AAAI 2013</br>
对于谱聚类公式具体的推导及理解，主要查阅了下面几篇博文，觉得很不错，自备梯子：
	- [Spectral Clustering](http://ranger.uta.edu/~chqding/Spectral/)。
	- [谱聚类算法(Spectral Clustering)](http://www.cnblogs.com/sparkwen/p/3155850.html)。
	- [谱聚类](https://chunqiu.blog.ustc.edu.cn/?p=505)这篇博文主要介绍了Matlab谱聚类的一些工具。
3. Large-Scale Video Hashing via Structure Learning. ICCV 2013</br>
用Hashing方法做视频检索，目标函数式第2项用21范数对特征进行选择，以获取可判别性局部视觉共性；目标函数式第3项用无穷范数对前后帧进行约束，以使前后帧具有相似的编码，即所谓的时间一致性。传统的Hashing方法在进行视频检索时，是直接拿过来就用的，并没有考虑到视频具有的特性，目标函数式第三项便是结合视频独有的特性进行考虑的。
