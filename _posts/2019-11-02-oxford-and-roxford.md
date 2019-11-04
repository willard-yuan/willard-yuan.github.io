---
layout: post
title: 图像检索：Oxford Building dataset的问题
categories: [计算机视觉]
tags: CV
---

Oxford Building dataset（后面简称为Oxford）从2007年发布，到2018年[Revisiting Oxford and Paris](http://cmp.felk.cvut.cz/~toliageo/p/RadenovicIscenToliasAvrithisChum_CVPR2018_Revisiting%20Oxford%20and%20Paris:%20Large-Scale%20Image%20Retrieval%20Benchmarking.pdf)重新整理发布为Revisiting Oxford Building dataset（后面简称为ROxford），整整十年，实例检索（instance retrieval）或物体检索（object retrieval）都跑在一个Ground Truth定义得不是很合理的数据上进行MAP（Mean Average Precision）评估，这期间，虽然有人意识到了Oxford数据集存在的问题，却一直等到10年后，才有人正式的对这个数据集GT定义的合理性给出正面的回应。

Oxford数据集小白菜也一直在用，之所以在实际中验证一些检索算法指标的时候喜欢用这个数据集，是因为这个数据集对小白菜而言，有两个优点：

- 计算MAP指标比较明晰（具体可以之前写过的关于[Oxford MAP的计算过程](http://yongyuan.name/blog/cbir-query-expansion.html)），方便
- 数据集规模不大，共5063张图片，验证起来比较快

然后小白菜也这么一直用着，虽然ROxford新定义的GT已经发布了。直到最近，在验证开发的局部特征检索系统在公开数据集上的效果时，一如既往的选择了Oxford的MAP作为衡量指标，发现了针对一些query，其定义的GT存在非常不合理的地方，下面举一个具体的query予以说明。

在Oxford里，`all_souls_000013.jpg`作为query（见[all_souls_1_query.txt](http://www.robots.ox.ac.uk/~vgg/data/oxbuildings/gt_files_170407.tgz)）时，包含相同建筑目标的`all_souls_000206.jpg`被当做跟query不相关的图片，放在了junk里（见all_souls_1_junk.txt）。`all_souls_000013.jpg`和`all_souls_000206.jpg`对应的图片分别为：

![drawing](http://yongyuan.name/imgs/posts/all_souls_000013_all_souls_000206.jpg)

从上面显示的图片可以看到，`all_souls_000206.jpg`跟`all_souls_000013.jpg`是相关的，它们包含了相同的建筑部分，其对应的匹配结果为：

![drawing](http://yongyuan.name/imgs/posts/all_souls_000013_matched.jpg)

显然，`all_souls_000206.jpg`应归属于good或ok里。这里面还有其他一些不合理的例子，上面列举的只是其中的一个示例。

所以无论是在论文里面或者实际测评实例检索、物体检索算法效果的时候，如果选用了Oxford数据集，最好不要再用老的GT来计算MAP了，而应该采用ROxford里定义的GT。
