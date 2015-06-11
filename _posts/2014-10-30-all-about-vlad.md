---
layout: post
title: All about VLAD
categories: [image retrieval]
---

正如标题所示，这里将记录VLAD的一切。VLAD本小子虽然也读过几篇这方面的paper，不过读的时候一直理解的很粗糙。所以想借此机会开个帖子，一方面驱动自己去加深对它的理解，另一方面把这些自己对它的理解记录下来，方便自己查阅。

##VLAD初步

在进行理论分析之前，先来看看VLAD长个什么样子，这里本小子分步展开VLAD是怎么得来的。

1. 提取SIFT特征。对于一个样本数为N的数据库，先对图像库中的所有图像提取SIFT描述子，假设提取到了所有SIFT描述子数目为n,用X来表示的话，X就是一个n*128的矩阵。
2. 聚类生成词汇向量。假设要生成K个单词，对X直接用Kmeans聚成K类，类中心即为单词(也叫码字)。
3. 生成VLAD向量。这一步其实如果对BOW的生成过程清楚的话，这一步理解起来就非常简单了。BOW统计的是描述子落入最近单词里的数目，而VLAD统计的则是这些落入最近单词里与该单词的累积残差。根据Aggregating local image descriptors into compact
codes的描述：

>By counting the number of occurrences of visual words,
BOW encodes the 0-order statistics of the distribution of descriptors. The Fisher vector extends the BOW by encoding high-order statistics (first and, optionally, second order).

BOW做的是描述子的0阶统计分布，而FV则是扩展了的BOW的高阶统计。这里引出来的FV是什么呢？VLAD是FV的特例，这里我们先不关注FV，我们只要借此推得VLAD是BOW的高阶统计就行。

经过上面三个步骤后，一幅图像可以用一个1*(K*128)维的向量表示。为了初步验证上面的过程是否正确，来看看上面那篇论文中VLAD的维数是否如这里所理解的是一个1*(K*128)维的向量，直接看实验表：

![VLAD01]({{ site.url }}/images/posts/VLAD01.png)

上表中FV和VLAD的D表示维数，我们看到D=K*64,这里为什么不是128呢？原因在于作者对SIFT进行了PCA降维处理，将128维降到了64维。

上面VLAD生成过程用文字描述起来不够简洁，直接把论文里计算VLAD的算法流图扒过来了，算法流图如下：

![VLAD01]({{ site.url }}/images/posts/VLAD02.png)

##提取VLAD

在对VLAD有了初步的认识后，接下来我们可以动手提取VLAD，通过实验来进一步了解VLAD。

(待续)


参考：

1. [机器学习笔记——Fisher vector coding](http://blog.csdn.net/breeze5428/article/details/32706507)
2. [Large-scale visual recognition Novel patch aggregation mechanisms](http://people.rennes.inria.fr/Herve.Jegou/courses/2012_cpvr_tutorial/4-new-patch-agggregation.pptx.pdf)
3. [VLAD](http://blog.csdn.net/breeze5428/article/details/36441179)
