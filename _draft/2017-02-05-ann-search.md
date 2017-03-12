---
layout: post
title: 图像检索：再叙ANN Search
categories: [Image Retrieval]
tags: ANN
---

每逢碰到这个ANN的简称，小白菜总是想到Artificial Neural Network人工神经网络，不过这里要展开的ANN并不是Artificial Neural Network，而是已被小白菜之前写过很多次的Approximate Nearest Neighbor搜索。虽然读书的那会儿，这一块的工作专注得比较多，比如哈希，也整理过一个像模像样的工具包[hashing-baseline-for-image-retrieval](https://github.com/willard-yuan/hashing-baseline-for-image-retrieval)，以及包括KD树、PQ乘积量化等近似最近邻搜索，但这些东西放在今天小白菜的知识体系里来看，依然自以为还非常的散乱。所以借再次有专研的机会之际，再做一次整理，完善自己在索引这方面的知识体系。

在具体到不同类的索引方法分类前，小白菜以为，从宏观上对ANN有下面的认知显得很有必要：**brute-force搜索的方式是在全空间进行搜索，为了加快查找的速度，几乎所有的ANN方法都是通过对全空间分割，将其分割成很多小的子空间，在搜索的时候，通过某种方式，快速锁定在某一（几）子空间，然后在该（几个）子空间里做遍历**。可以看到，正是因为缩减了遍历的空间大小范围，从而使得ANN能够处理大规模数据的索引。

根据小白菜现有的对ANN的掌握，可以将ANN的方法分为三大类：基于树的方法、哈希方法、矢量量化方法。这三种方法里面，着重总结典型方法，其中由以哈希方法、矢量量化方法为主。

## 基于树的方法

几乎所有的ANN方法都是对全空间的划分，所以基于树的方法也不例外。基于树的方法采用**树**这种数据结构的方法来表达对全空间的划分，其中又以KD树最为经典。下面左图是KD树对全空间的划分过程，以及用树这种数据结构来表达的一个过程。

![drawing](http://i300.photobucket.com/albums/nn17/willard-yuan/blog/kdTree_zpshq4ywnby.png)

对KD树选择从哪一维度进行开始划分的标准，采用的是求每一个维度的方差，然后选择方差最大的那个维度开始划分。这里有一个比较有意思的问题是：**为何要选择方差作为维度划分选取的标准**？我们都知道，方差的大小可以反映数据的波动性。方差大表示数据波动性越大，选择方差最大的开始划分空间，可以使得所需的划分面数目最小，反映到树数据结构上，可以使得我们构建的KD树的树深度尽可能的小。为了更进一步加深对这一点的认识，可以以一个简单的示例图说明：

![drawing](http://i300.photobucket.com/albums/nn17/willard-yuan/blog/kd_zpslmugktds.jpeg)

假设不以方差最大的x轴为划分面(x_var = 16.25)，而是以y轴(y_var = 0.0)轴为划分面，如图中虚线所示，可以看到，该划分使得图中的四个点都落入在同一个子空间中，从而使得该划分成为一个无效的划分，体现在以树结构上，就是多了一层无用的树深度。而以x轴为初始划分则不同(图像实线所示)，以x轴为初始划分可以得到数据能够比较均匀的散布在左右两个子空间中，从而使得整体的查找时间能够最短。注意，在实际的kd树划分的时候，并不是图中虚线所示，而是选取中值最近的点。上面示意图构建的具体kd树如下所示：

```python
In [9]: kdtree.visualize(tree)

                       (9, 4)

             (2, 4)              (10, 4)

        (1, 4)
```

一般而言，在空间维度比较低的时候，KD树是比较高效的，当空间维度较高时，可以采用下面的哈希方法或者矢量量化方法。

> kd-trees are not suitable for efficiently finding the nearest neighbour in high dimensional spaces.  In very high dimensional spaces, the curse of dimensionality causes the algorithm to need to visit many more branches than in lower dimensional spaces. In particular, when the number of points is only slightly higher than the number of dimensions, the algorithm is only slightly better than a linear search of all of the points.

## 哈希方法


## 矢量量化方法

