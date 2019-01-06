---
layout: post
title: 图像检索：All about triplet loss for image retrieval
categories: [计算机视觉]
tags: CV
---

在前面的一些博文比如[layer选择与fine-tuning性能提升验证](http://yongyuan.name/blog/layer-selection-and-finetune-for-cbir.html)中，已经探讨过许多使用基于分类模型或者预训练模型加空间权重等之类的方法，在这篇博文中，小白菜将探讨基于triplet loss及其变种的实例检索方法。关于triplet loss训练实例检索特征，网上博文也讲述得比较多，比如shuokay的[CNN 图像检索](http://shuokay.com/2016/10/22/dl-for-image-retrieval/)，作为早期采用采用triplet loss做图像检索的博文布道者，在今天看来，仍然是一篇非常不错的博文。今天小白菜希望类似[All about VLAD](https://www.robots.ox.ac.uk/~vgg/publications/2013/arandjelovic13/arandjelovic13.pdf)一样，就triplet loss用于实例检索，做一个更加细节完整的总结以及实验的方方面面。在正式动笔前，先推荐3篇非常好的论文：

- [End-to-end Learning of Deep Visual Representations for Image retrieval](https://arxiv.org/abs/1610.07940), IJCV 2017.
- [In Defense of the Triplet Loss for Person Re-Identification](https://arxiv.org/abs/1703.07737), 2017.
- [Features for Multi-Target Multi-Camera Tracking and Re-Identification](http://openaccess.thecvf.com/content_cvpr_2018/papers/Ristani_Features_for_Multi-Target_CVPR_2018_paper.pdf), CVPR 2018.

这3篇文章非常经典，非常值得一读，本篇的总结以及实验主要基于这3篇文章。第一篇是第一个使用triplet loss把Oxford building建筑数据集mAP做到80%+的文章；第二篇是关于triplet loss在训练时候，如何用batch hard方式做online hard mining的方法，论文公布了完整的[训练代码](https://github.com/VisualComputingInstitute/triplet-reid)，代码质量非常高；第三篇将triplet loss改进为weighted triplet loss，其中最值得称道的地方在于，它将普通的triplet loss、batch hard的triplet loss和weighted triplet loss以非常完整的公式给出来，三者之间的区别解释得非常漂亮。下面小白菜分别以这3篇文章为基础，总结triplet loss用于实例检索特征学习的心得与实验。

### Deep Image Retrieval

Deep Image Retrieval在刚开始出来的时候，小白菜读过几遍，对将RMAC（RMAC的介绍请参阅[layer选择与fine-tuning性能提升验证](http://yongyuan.name/blog/layer-selection-and-finetune-for-cbir.html)）加入到网络中做成一个end2end的方式这一点其实理解得不是那么有感触，当时只觉得这一点不算是主要的创新点，毕竟RMAC是已有的了，比较有贡献的是训练数据清洗那一块以及这篇是第一个使用triplet loss把Oxford building建筑数据集mAP做到80%+的文章。这一段时间，当小白菜回过头来重新读这篇文章并实现相关实验的时候，发觉这个end2end的RMAC对mAP起了非常大的提升作用，论文后面也实验了用RPN网络来替代RMAC，实验效果显示提升很小，从而也间接验证了RMAC的有效性。

![](http://yongyuan.name/imgs/posts/dir_rmac.jpg)

Deep Image Retrieval训练框架核心的东西如上图所示。比较重要的两个地方是：一是在对最后的feature map做roi pooling的时候，采用的RMAC（共得到21个区域框特征）；二是这21个区域块的特征做中心化，然后再接全连接，两个合在一块，相当于RMAC的PCA降维。

