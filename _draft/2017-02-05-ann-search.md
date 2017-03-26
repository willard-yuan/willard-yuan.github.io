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

> kd-trees are not suitable for efficiently finding the nearest neighbour in high dimensional spaces.  
In very high dimensional spaces, the curse of dimensionality causes the algorithm to need to visit many more branches than in lower dimensional spaces. In particular, when the number of points is only slightly higher than the number of dimensions, the algorithm is only slightly better than a linear search of all of the points.

## 哈希方法

哈希，顾名思义，就是将连续的实值散列化为0、1的离散值。在散列化的过程中，对散列化函数(也就是哈希函数)有一定的要求。根据学习的策略，可以将哈希方法分为无监督、有监督和半监督三种类型。在评估某种哈希方法用于图像检索的检索精度时，可以使用knn得到的近邻作为ground truth，也可以使用样本自身的类别作为ground truth。所以在实际评估准确度的时候，根据ground truth的定义，这里面是有一点小的trick的。通常对于无监督的哈希图像检索方法，由于我们使用的都是未标记的数据样本，所以我们会很自然的采用knn得到的近邻作为ground truth，但是对于图像检索的这一任务时，在对哈希函数的构造过程中，通常会有“相似的样本经编码后距离尽可能的近，不相似的样本编码后则尽可能的远”这一基本要求，这里讲到的相似，指语义的相似，因而你会发现，编码的基本要求放在无监督哈希方法里，似乎与采用knn得到的近邻作为ground truth的评价方式有些南辕北辙。对无监督哈希方法的ground truth一点小的疑惑在小白菜读书的时候就心存这样的困惑，一直悬而未解。当然，在做无监督的图像哈希方法，采用样本自身的类别作为ground truth是毋庸置疑的。


小白菜读书那会儿，研究了很多的哈希图像检索方法（见[hashing-baseline-for-image-retrieval](https://github.com/willard-yuan/hashing-baseline-for-image-retrieval)），有时候总会给一些工程实践上的错觉（在今天看来是这样的），即新论文里的方法远远碾压经典的方法，那是不是在实际中这些方法就很work很好使。实践的经历告诉小白菜，还是经典的东西更靠谱，不是因为新的方法不好，而是新的事物需要经过时间的沉淀与优化。

所以，这里不会对近两年的哈希方法做铺陈，而是聊一聊工程中在要使用到哈希方法的场景下一般都会选用的局部敏感哈希（Local Sensitive Hashing, LSH）以及大杀器[Falconn](https://falconn-lib.org/)。

于LSH的结果，小白菜以为，[Locality-Sensitive Hashing: a Primer](https://github.com/FALCONN-LIB/FALCONN/wiki/LSH-Primer)这个讲解得极好，推荐一读。下面是小白菜结合自己的理解，提炼的一些在小白菜看来需要重点理解的知识。

- 局部敏感是啥？

当一个函数（或者更准确的说，哈希函数家族）具有如下属性的时候，我们说该哈希函数是局部敏感的：相近的样本点对比相远的样本点对更容易发生碰撞。

- 用哈希为什么可以加速查找？

对于brute force搜索，需要遍历数据集中的所有点，而使用哈希，我们首先找到查询样本落入在哪个cell(即所谓的桶)中，如果空间的划分是在我们想要的相似性度量下进行分割的，则查询样本的最近邻将极有可能落在查询样本的cell中，如此我们只需要在当前的cell中遍历比较，而不用在所有的数据集中进行遍历。

## 矢量量化方法

