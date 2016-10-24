---
layout: post
title: 机器视觉：十亿规模的深度描述子如何有效索引
categories: [机器视觉]
tags: 机器视觉
---

前一段时间山世光老师开源了[SeetaFaceEngine](https://github.com/seetaface/SeetaFaceEngine)，而在小白菜读研的时候除了图像检索老本行，也看了一些人脸识别的文章并有过相应的笔记[Deep Face Recognition论文阅读](http://yongyuan.name/blog/deep-face-recognition-note.html)，所以自然也吸引了小白菜一试的兴趣。当时，作为最早一批测试的用户，并没有说明如何在Mac下让它work起来的资料，所以，为了能让它在Xcode中运行，小白菜在SeetaFaceEngine的基础上，对它做了一些小的改动，使得它能够在Xcode里运行起来。当然，在Xcode里面做完了测试后，小白菜并没有就此打住，而是为它创建了一个QT项目，想在此基础上为它做一个人脸识别和人脸检索的应用。

人脸识别和人脸检索应用代码：[SeetaFaceLib](https://github.com/willard-yuan/SeetaFaceLib)，目前代码还在迭代中，人脸检索部分已经完成。
![drawing](http://i300.photobucket.com/albums/nn17/willard-yuan/cbirFace_zpsmfzi5nly.png)

在QT项目刚上传到github上传不久后，远在锐捷的罗兄说这个QT工程对他帮助很大，听到这个小白菜深感欣慰。所谓开源，用人用或对人有帮助，那这个代码写得就有它的价值了。

当然上面讲得这些都不是本篇博客真正要讲的，而且借此引出小白菜真正关心的问题。如果你运行过这个QT项目，你会发现在搜索阶段，搜索不够实时，在小白菜的本机上，3000张的人脸图片，在查询的时候，大概要六七秒的样子。这种查询速度显然是小白菜所不能接受的，而造成这个问题的根本原因在于：在每次查询的时候，先计算查询图像(在线提取查询图像的特征)的特征，然后挨个计算查询图像到图像库(特征已离线提取)中特征的余弦距离，即：

```cpp
// Calculate cosine distance between query and data base faces
std::vector<std::pair<float, size_t> > dists_idxs;
int i = 0;
for(auto featItem: namesFeats.second){
    // http://stackoverflow.com/questions/2923272/how-to-convert-vector-to-array-c
    float tmp_cosine_dist = face_recognizer->CalcSimilarity(query_feat, &featItem[0]);
    dists_idxs.push_back(std::make_pair(tmp_cosine_dist, i++));
}
```

在计算完查询特征到图库各个特征的余弦距离后，我们再对计算的距离进行全局排序：

```cpp
std::sort(dists_idxs.begin(), dists_idxs.end());
std::reverse(dists_idxs.begin(), dists_idxs.end());
for (size_t i = 0 ; i != dists_idxs.size() ; i++) {
   //qDebug()<<dists_idxs[i].first<<namesFeats.first.at(dists_idxs[i].second).c_str();
   QString tmpImgName = dir + '/' + namesFeats.first.at(dists_idxs[i].second).c_str();
   imgs_listeWidget->addItem(new QListWidgetItem(QIcon(tmpImgName), QString::fromStdString(namesFeats.first.at(dists_idxs[i].second).c_str())));
}
```

从上面的过程可以看到，查询过程的时间消耗在了挨个计算余弦距离(主要)、排序上(次要)以及查询图像特征提取上(次次要)，抛开影响查询速度的次次要因素，我们需要解决的问题便不言而名。这种brute-search的方式实在是太耗时了，那么有没有方式能够缓解这种相应不够实时的问题呢。答案是有的，我们可以通过一下手段对这种brute-search低效的方式做一些缓解：

1. PCA降维。对于通过深度学习方式得到的特征，降维不会对信息造成大的损失，事实上在[Neural codes for image retrieval]()这篇文章中已经指出了PCA对于深度描述子几乎不会造成损失，小白菜之前也对这样一个结论做过验证，见下图：

![](http://i300.photobucket.com/albums/nn17/willard-yuan/pcaDNN_zpsgu3ydzgj.png)

2. 使用多线程技术。在计算余弦距离的时候，使用OpenMP多线程技术，这种方式能够较大幅度的降低搜索时间，比如CPU是8线程的，则可以将原来的时间降低为原来的8分之一。

上所列举的两种方式，能够缓解brute-search的低效，但并不能从根本上解决索引的低效问题。因此，为了适应大规模描述子的索引，需要构建一种合理的索引结构。