---
layout: post
title: 数据分类：特征处理
categories: [数据挖掘]
tags: 数据挖掘
---

## 特征处理

### 连续特征和离散特征同时存在时如何处理?
quora上有人问到了这方面的问题：[What are good ways to deal with problems where you have both discrete and continous features?](https://www.quora.com/What-are-good-ways-to-deal-with-problems-where-you-have-both-discrete-and-continous-features)主要的思路是对离散的特征进行二值化处理，比如答案中举的例子：  

```text
x = 价格(连续型特征)  种类类别(离散型特征)  y = 产品卖出数量  
[35.99 Red]  
[42.95 Green]  
[10.50 Red]  
[74.99 Blue]
```

由于上面产品的类别有3种可能的取值，所以我们可以用3个虚拟的变量来特换掉种类类别这个特征，这种特征处理方式跟自然语言处理的one-hot处理方式一样，所以我们可以将上面的特征进行处理后每个样本可以用一个4维的向量来表示：

```text
[35.99 1 0 0]  
[42.95 0 1 0]  
[10.50 1 0 0]   
[74.99 0 0 1]
```

特征经过上面的预处理后，便可以使用这些特征做回归啊等机器学习任务，如果使用线性回归的话，我们需要学习5个权重(每一个特征对应一个权重，偏执项也可以视为一个权重，\\((w_1x_1 + w_2x_2 + w_3x_3 + w_4x_4 + w_0)\\)。此外，我们还需要对每一列的特征进行均值归一化，即\\((x_{col_i} - \mu)/\sigma\\)。
。其实对样本种类类别，我们可以只用两个维度的进行表示也可以可行的，即以如下方式进行表示： 

```text
[35.99 0 0]  
[42.95 0 1]  
[10.50 0 0]   
[74.99 1 0]  
```

一般对于特征中既包含有连续特征又包含有离散特征，对于离散特征差不多都采用这种方式进行处理，但是这种方式有一个比较大的问题，就是当离散特征可能的取值比较多时，会导致通过这种方式处理后的特征维度非常高(one-hot表示方法都有这样一种特点)，向量非常的稀疏，在存储以及运算的时候，可以通过使用一些支持稀疏表示的矩阵库进行处理(比如Armadillo有稀疏矩阵的表示)。

一些不同的回归模型比较：  
1. [7 Types of Regression Techniques you should know](http://www.analyticsvidhya.com/blog/2015/08/comprehensive-guide-regression/)  
2. [10 types of regressions. Which one to use?](http://www.datasciencecentral.com/profiles/blogs/10-types-of-regressions-which-one-to-use)  
3. [Regression analysis using Python](http://www.turingfinance.com/regression-analysis-using-python-statsmodels-and-quandl/)  
4. [scikit learn logistic regression](http://scikit-learn.org/stable/modules/generated/sklearn.linear_model.LogisticRegression.html)

### 对数变换  
价格敏感模型：对特征进行对数变换，然后采用线性回归模型。   
那么**问题**来了： 为什么采用对数变换？具体解释可以阅读[在统计学中为什么要对变量取对数](https://www.zhihu.com/question/20099757/answer/26586088)，在这个回答里解释得非常明白了。总结原因有2个：  
1. 使数据分布更平稳。对数变换能够很好地将随着自变量的增加，因变量的方差也增大的模型转化为我们熟知的问题。   
2. 承接第1点，将非线性的数据通过对数变换，转换为线性数据，便于使用线性模型进行回归。  
关于这一点，可以（大致）类比一下SVM，比如SVM对于线性不可分的数据，先对数据进行核函数映射，将低维的数据映射到高维空间，使数据在摄影后的高维空间中线性可分。  

注意：对数变换也不一定是最好的变换。数据变换还有方式还有根号变换，比如计算机视觉中常用的图像描述子SIFT，通过对特征进行根号变换后，可以得到rootSIFT。  