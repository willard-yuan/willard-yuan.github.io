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

![](https://i300.photobucket.com/albums/nn17/willard-yuan/kdTree-LSH_zpsqehttqom.png)

对KD树选择从哪一维度进行开始划分的标准，采用的是求每一个维度的方差，然后选择方差最大的那个维度开始划分。这里有一个比较有意思的问题是：**为何要选择方差作为维度划分选取的标准**？我们都知道，方差的大小可以反映数据的波动性。方差大表示数据波动性越大，选择方差最大的开始划分空间，可以使得所需的划分面数目最小，反映到树数据结构上，可以使得我们构建的KD树的树深度尽可能的小。为了更进一步加深对这一点的认识，可以看下面小白菜做的一个简单的示例图：

## 哈希方法

直接采用brute线性扫描，因为图库才5064张图像，所以没必要建索引。在实际应用中，我们可以采用哈希、倒排PQ等方式，这一部分可以细讲很多，有机会的话，小白菜单独拿一个篇幅整理实用的索引方法。

## 矢量量化方法

实验评价指标采用平均检索精度(mAP, mean average precision), mAP如何计算可以阅读[信息检索评价指标](http://yongyuan.name/blog/evaluation-of-information-retrieval.html)，里面有对mAP如何计算的详细介绍。

对于Oxford Building图像数据库，mAP的计算过程有必要详细介绍一下。Oxford Building的groundtruth有三类：good, ok和junk。对于某个检索结果，如果它在good和ok中，则被判为是与查询图像相关的；如果在junk中，则被判为是不相关的。我们可以细致的阅读一下Oxford Building的mAP计算代码：

```cpp
float compute_ap(const set<string>& pos, const set<string>& amb, const vector<string>& ranked_list){
  float old_recall = 0.0;
  float old_precision = 1.0;
  float ap = 0.0;
  
  size_t intersect_size = 0;
  size_t i = 0;
  size_t j = 0;
  for ( ; i<ranked_list.size(); ++i) {
    if (amb.count(ranked_list[i])) continue;
    if (pos.count(ranked_list[i])) intersect_size++;

    float recall = intersect_size / (float)pos.size();
    float precision = intersect_size / (j + 1.0);

    ap += (recall - old_recall)*((old_precision + precision)/2.0);

    old_recall = recall;
    old_precision = precision;
    j++;
  }
  return ap;
}
```

其中，`pos`即是由good和ok构成的set，`amb`是junk构成的set，`ranked_list`即查询得到的结果。可以看到Oxford Building上计算的AP是检索准确率(precision)和检索召回率(recall)曲线围成的面积(梯形面积，积分思想)，mAP即是对AP的平均。

理解完了Oxford Building的mAP计算过程，还有一个需要考虑的问题是：对于查询图像特征的提取，我们要不要把Oxford Building提供的区域框用上，即在提取特征的时候，我们是在整个图像提取特征，还是在区域框内提取特征？**在图像检索的论文中，在计算Oxford Building的mAP时，都是在区域框内提取特征。但是放在实际中，我们肯定是希望我们的图像检索方法能够尽可能的减少交互，即在不框选区域的时候，也能够取得很好的检索精度**。所以，基于这样的意图，在实际中测评检索算法的mAP时，小白菜更喜欢采用在整个图像上提取特征的方式。当然，如果不嫌麻烦的话，可以两种方式都测评一下。

## 查询拓展对mAP的提升

库内查询，所以返回的top@1为查询图像自身，并且采用的是全图查询(即上面提到的对于查询图像是在整个图像上提取特征，而不是在区域框内提取特征)，表中top@K表示取前K个样本求和取平均。

top@K | 0 | 1 |  2 | 3| 4| 5 | 6 | 7 | 8 | 9 | 10 |
---|---|---|---|---|---|---|---|---|---|---|---|
MAP | 61.91% | 61.91% | 65.42% | 66.52% | 66.07% | 66.38% | 66.51% | 65.65% | 65.16% | 63.46% | 62.41%

上面表格中mAP随top@K用曲线表示如下：

![drawing](http://i300.photobucket.com/albums/nn17/willard-yuan/blog/qe_map_zpsbat8vy5x.png)

在不做Query Expansion的时候，即top@K=0时，mAP为61.91%。因为查询属于库内查询，所以top@K=1时，仍然是查询向量本身，故结果与top@K=0是一样的。从实验的结果可以看出，Query Expansion确实能够提升检索的精度，在top@K=3的时候，取得了最高的检索精度。相比于不做Query Expansion，Query Expansion可以提高4%-5%的检索精度。

所以，**在实际中，做Query Expansion完全是有必要的，一则是它实现简单，二则是它提升的效果还是比较明显的**
