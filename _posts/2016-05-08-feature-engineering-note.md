---
layout: post
title: 数据分类：特征处理
categories: [数据挖掘]
tags: 数据挖掘
---

## 特征处理

**问题1：连续特征和离散特征同时存在时如何处理？**  
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
