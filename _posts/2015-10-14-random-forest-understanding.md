---
layout: post
title: 数据分类浅谈：随机森林
categories: [数据挖掘]
tags: 机器学习
---

## 随机森林定义

随机森林（Random Forest,以下简称RF）是一种树形分类器
$${h(x,\beta_k), k = 1,...}$$
的集合。其中元分类器${h(x,\beta_k)}$是用CART构建的没有剪枝（完全生长）的分类回归树：$x$是输入向量；$\beta_k$是独立同分布的随机向量，决定了单棵树的生长过程。森林的输出可以采用简单的多数投票法（针对分类，随机森林还可以用来做聚类）或单棵树输出结果的简单平均（针对回归）得到。

抛开上面正式的定义，对其进行直观的理解，随机森林就是将一堆决策树聚在一起，形成一个森林，当有一个新的输入样本进入的时候，就让森林中的每一棵决策树分别进行一下判断，看看这个样本应该 属于哪一类（对于分类算法），然后看看哪一类被选择最多，就预测这个样本为那一类。

## 随机森林构造过程
假设数据集的每一行代表一个样本，共$N$个样本，每一列代表一个feature（属性），共$M$个特征（属性），随机森林构造过程可分解如下：
1. 随机选取训练样本集：使用Bagging方法形成每棵树的训练集；
> 即进行行采样，采用**有放回**的方式(即Bagging方式)，也就是在采样得到的样本集合中，可能有重复的样本。假设每棵树的输入样本为$n$个，那么采样的样本也为$n$个。这样使得在训练的时候，每一棵树的输入样本都不是全部的样本，使得相对不容易出现over-fitting。

2. 随机选取分类feature（属性）集：对于每一次行采样后得到的$n$个样本，从$M$个feature(属性)中随机选取出$m, m << M$个feature（属性），以这$m$个feature(属性)上最好的分裂方式建立决策树；
3. 每棵树任其生长（即采用完全分裂的方式），不进行剪枝，这样决策树的某一个叶子节点要么是无法继续分裂的，要么里面的所有样本的都是指向的同一个分类。

一般很多的决策树算法都一个重要的步骤——**剪枝**，但是这里不用这么做，这是因为之前的两个随机采样的过程保证了随机性，所以就算不剪枝，也不会出现over-fitting。

按这种算法得到的随机森林中的每一棵都是很弱的，但是大家组合起来就很厉害了。可以这样比喻随机森林算法：每一棵决策树就是一个精通于某一个窄领域的专家（因为我们从M个feature中选择m让每一棵决策树进行学习），这样在随机森林中就有了很多个精通不同领域的专家，对一个新的问题（新的输入数据），可以用不同的角度去看待它，最终由各个专家，投票得到结果。有点类似论文审稿过程，由多个专家(各个专家精通或研究的方法可能不一样)给出不同的意见，然后综合几位专家的意见，决定论文是直接拒掉还是修改录用。

上面提到了bagging的概念，这个概念以及跟Boosting、Bootstrap等的联系，可以参考这篇文章[Bootstrap, Boosting, Bagging,Random forest 几种方法的联系](http://www.duzelong.com/wordpress/201508/archives1442/)。

## 影响随机森林分类性能的主要因素

1. 森林中单棵树的分类强度(Streng):每棵树的分类强大越大，则随机森林的分类性能越好；
2. 森林中树之间的相关性(Correlation)：树与树之间的相关性越大，则随机森林的分类性能越差。

## 随机森林的特点
1. 两个随机性（行样本采样随机和特征采样随机）的引入，使得随机森林不容易陷入over-fitting；
2. 两个随机性（行样本采样随机和特征采样随机）的引入，使得随机森林具备很好的抗噪声能力；
3. 对数据集的适应能力强：既能处理离散型数据类型，也能处理连续性数据类型，数据集无需规范化；

## 随机森林分类例子
在了解了随机森林的特性后，我们在[安德森鸢尾花卉数据集](https://zh.wikipedia.org/wiki/%E5%AE%89%E5%BE%B7%E6%A3%AE%E9%B8%A2%E5%B0%BE%E8%8A%B1%E5%8D%89%E6%95%B0%E6%8D%AE%E9%9B%86)上用随机森林对其做一个分类的小实验。安德森鸢尾花卉数据集的说明见上面给出的链接，其中每一类有50个样本，共3类。首先，我们对数据集进行划分，训练集每一类中抽取36个样本，将这36*3个样本保存在[train.csv](https://github.com/willard-yuan/machine-learning-notebook/blob/master/01--Random%20Forest/train.csv)中，剩下的样本作为测试集保存在[test.csv](https://github.com/willard-yuan/machine-learning-notebook/blob/master/01--Random%20Forest/test.csv)。下面是用scikit-learn中的random forest做的分类代码：
{% gist c827db48b9c414716b90 %}
或者到这里nbviewer上查看[Random Forest.ipynb](http://nbviewer.ipython.org/gist/willard-yuan/c827db48b9c414716b90)

可以看到，在这个数据集上，随机森林对类别的预测表现非常的出色。

参考文章

1. [Random Forest](http://www.wujiame.com/blog/2015/02/16/random-forest/)
2. [Bootstrap, Boosting, Bagging,Random forest 几种方法的联系](http://www.duzelong.com/wordpress/201508/archives1442/)
3. [使用scikit-learn解释随机森林算法](http://www.csdn.net/article/2015-10-08/2825851)
4. [Random Forest in scikit-learn](http://alexhwoods.com/2015/07/01/random-forest-in-scikit-learn/)
