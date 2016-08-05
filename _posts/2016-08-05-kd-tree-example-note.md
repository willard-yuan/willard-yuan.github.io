---
layout: post
title: 机器学习：KD-Tree常见教材的一个示例错误说明
categories: [Hive]
tags: Hive
---

KD-Tree是一种对空间进行分割的方法，使得在搜索阶段可以缩小空间搜索的范围，因而它是一种典型的近似最近邻搜索方法(ANN search)。在前一篇[图像检索：基于内容的图像检索技术](http://yongyuan.name/blog/cbir-technique-summary.html)文章里，曾稍微介绍过（面向图像检索的）基于树的搜索方法和哈希搜索方法的优劣势。这些天，入手了一本此前看过了电子版的[统计学习方法]()纸质版一书，得以在地铁上打发无聊的时光。前几日，老汤的妹子也在刷此书，问到了书中在讲解KD-Tree时所举的一个KD-Tree构造过程的例子，这个例子在几乎所有介绍KD-Tree的资料中大概都会用它来做示例展示，相信看过KD-Tree资料介绍的同学都见到过，例子具体如下

> 给定一个二维空间的数据集:  
$$
\begin{equation}
   T={\{(2,3)^T,(5,4)^T,(9,6)^T,(4,7)^T,(8,1)^T,(7,2)^T\}}
\end{equation}
$$  
构建一个平衡树。  

所有在介绍这个例子的资料中的解法是这样的：以计算各维度(这里只有两个维度)的方差作为选取划分的标准，比如在刚开始的时候，我们计算得到$$x^(1)$$方向上的方差要比$$x^(2)$$方向的方差要大，所以我们选取$$x^(1)$$轴，6个数据点的$$x^(1)$$坐标的**中位数是7**（**为啥是7，你在逗我？**），以平面$$x^(1)=7$$将空间分为左、右两个子矩形（子节点）；接着，左矩形以$$x^(2)=4$$分为两个子矩形，右矩形以$$x^(2)=6$$分为两个子矩形，如此递归，最后得到了下面的特征空间划分：  
![](https://github.com/Hareric/Lumberroom/raw/master/blog_graph/KDtree%20%E6%95%A3%E7%82%B9%E5%9B%BE.png)

如果你也有上面一样的疑问，那就对了，**中位数**这个应该非常的好理解。对于某序列，对其进行排序后，如果序列的长度是奇数，那中位数就是中间的那个数；如果是偶数，则中位数是中间两个数的平均。那上面的KD-Tree树中的中位数是不是这么定义的呢，按照[统计学习方法]()一书在**41页注脚**标识的，很不幸的告诉你，在该书中中位数确实是这样定义的。所以如果觉得中位数是6属于正确的理解，但为啥在所有的对这个例子的介绍中，答案为啥都是7？问题到底出在哪里？

为了回答上面这个问题，我们推本溯源到这个示例最原始的出处。这个例子最原始的出处来自于维基百科[kd-tree](https://en.wikipedia.org/wiki/K-d_tree)，里面的例子正是这个例子，而且答案告诉我们正是我们想不明白的**7**，所以我们从这个例子最原始的地方尝试解开问题的答案。我想最好的答案就是看页面上给出的代码了，下面是摘自维基百科[kd-tree](https://en.wikipedia.org/wiki/K-d_tree)的Python代码：

```python
from collections import namedtuple
from operator import itemgetter
from pprint import pformat

class Node(namedtuple('Node', 'location left_child right_child')):
    def __repr__(self):
        return pformat(tuple(self))

def kdtree(point_list, depth=0):
    try:
        k = len(point_list[0]) # assumes all points have the same dimension
    except IndexError as e: # if not point_list:
        return None
    # Select axis based on depth so that axis cycles through all valid values
    axis = depth % k
 
    # Sort point list and choose median as pivot element
    point_list.sort(key=itemgetter(axis))
    median = len(point_list) // 2 # choose median
 
    # Create node and construct subtrees
    return Node(
        location=point_list[median],
        left_child=kdtree(point_list[:median], depth + 1),
        right_child=kdtree(point_list[median + 1:], depth + 1)
    )

def main():
    """Example usage"""
    point_list = [(2,3), (5,4), (9,6), (4,7), (8,1), (7,2)]
    tree = kdtree(point_list)
    print(tree)

if __name__ == '__main__':
    main()
```

上面代码中，求中位数的代码为：

```python
point_list.sort(key=itemgetter(axis))
median = len(point_list) // 2 # choose median
location=point_list[median]
```
`len(point_list) // 2`为序列的长度除2后向下取整，结果为3，由于Python序列的索引是从0开始的（差不多所有的编程语言索引都是从0开始的，就我所知的matlab是个例外），所以实际中位数的取值就是排序后的第4个数，所以中位数的结果通过此程序得到的是7。现在我们从这段代码可以得到，在KD-Tree中中位数的求取是序列的长度除以2向下取整后的下一个数（升序排序）。所以，问题出在中位数定义不一致上，[统计学习方法]()一书在**41页注脚中定义的中位数的定义是错误的**。

这个坑我想很多人在看KD-Tree的中文资料的时候肯定都踩过，或者或多或少都存在这样的疑问，甚至还展开了讨论（详见July写的[从K近邻算法、距离度量谈到KD树、SIFT+BBF算法](http://blog.csdn.net/v_july_v/article/details/8203674)底下评论展开的讨论），当然这里还有一个问题：为什么这个中位数定义的是向下取整后的下一位，而不是当前这一个？这一点，我自己的理解是虽然划分的空间结构不一致，但是在查找的时候，不会影响最终的搜索结果。

最后，虽然关于KD-Tree的资料有很多介绍，我还是推荐一篇关于KD-Tree的博文[KNN算法实现之KD树](http://hareric.com/2016/05/22/KNN%E7%AE%97%E6%B3%95%E5%AE%9E%E7%8E%B0%E4%B9%8BKD%E6%A0%91/)，步骤分解得比较细，对于想要了解KD-Tree的原理的同学，还是值得推荐一读的。