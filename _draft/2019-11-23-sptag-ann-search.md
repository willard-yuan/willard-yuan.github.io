---
layout: post
title: 图像检索：SPTAG向量索引算法详解
categories: [计算机视觉]
tags: CV
---

## SPTAG核心思想

SPTAG构建索引过程，主要由两个步骤，先对空间做分割，具体采用构建Tree（采用KD树或KMeans），然后再构建Relative Neighborhood Graph。其中，Tree的叶节点位置，充当为子Graph的入节点。该过程官网给给了一个很直观的示意图：

![drawing](http://yongyuan.name/imgs/posts/sptag.png)

上述示意图表达了SPTAG的核心思想：先构建Tree结构（图中黄色、绿色、蓝色圈圈所示，为Tree的节点），然后再构建Relative Neighborhood Graph，每一个叶节点会当做每个子邻域Graph的入节点。在搜索的时候，通过二叉查找，找到跟query距离最近的叶节点，便可以快速锁定到目标子邻域Graph，然后在子邻域Grap里面找到K近邻。

构建索引的过程中，最主要的两个步骤：

SPTAG包含的方法 | 构建索引第一步 | 构建索引第二步 | 优点 |
---|---|---|---
SPTAG-KDT |	构建KD-Tree |	构建Relative Neighborhood Graph (RNG) | 构建索引速度较快 |
SPTAG-BKT |	构建Balanced KMeans Tree |	构建Relative Neighborhood Graph (RNG) | 召回率更好 |

这两个方法，并无实质区别，只不过在第一步做子空间划分的时候，采用的子空间划分手段不一样，即：

- SPTAG-KDT采用的是KD-Tree做的子空间划分，KD-Tree构建Tree的过程，是一个相对较快的过程，所以SPTAG-KDT具备构建索引较快的优点；
- SPTAG-BKT采用层次KMeans聚类的方式对空间进行分割，构建Balanced KMeans Tree，由于聚类是一个相比较慢且分割得更均衡的过程，所以SPTAG-BKT在召回率上，比SPTAG-KDT具备更好的召回率；

## SPTAG与HNSW对比

SPTAG跟HNSW，都属于Graph索引方法，所以两者有很多相似的地方，比如都具备分层结构（通过分层结构，将搜索复杂度降下来），最低层都包含了所有的索引数据等。

二者最大的不同体现在入节点的构造上：

- SPTAG采用Tree的方式（这种方式直观容易让人想到）构造入节点，将Tree的叶节点作为RNG的入节点，所以SPTAG是一种异质数据结构的分层结构（Tree+Graph）；
- HNSW是真正意义上的同质数据结构分层（Graph直接分层），从顶层开始贪心遍历graph，以便在某层A中找到最近邻。当在A层找到局部最小值之后，再将A层中找到的最近邻作为输入点（entry point），继续在下一层中寻找最近邻，重复该过程；

可以从下面SPTAG和HNSW示意图，更直观的感受二者的相似点与差异点：

![drawing](http://yongyuan.name/imgs/posts/sptag_hnsw.jpg)

最底下一层都是索引的元素，上面几层构建的目的，都是为了快速搜寻到目标子区域，而构建的查找"捷径"。从入节点的构造方式上来看，HNSW的处理手段更高明，代码看上去更简洁、优雅，而SPTAG除了Graph本身外，由于采用Tree方法作为入节点，在实现过程中，需要引入两种数据结构。