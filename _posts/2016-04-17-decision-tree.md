---
layout: post
title: 数据分类：决策树
categories: [机器学习]
tags: 决策树
---

## 背景

决策树(decision tree)是一种基本的分类和**回归**(后面补充一个回归的例子?)方法，它呈现的是一种树形结构，可以认为是if-then规则的集合。其其主要优点是模型具有很好的**可读性**，且**分类速度快**；缺点是可能会产生过度匹配的问题(所以一般都会有决策树的剪枝过程)。决策树在学习时，利用训练数据，根据损失函数最小化原则建立决策树模型，其学习过程包括3个步骤：特征选择、决策树生成和决策树修剪。决策树学习的思想来源主要有Quinlan在1986年提出的ID3算法和1993年提出的C4.5算法，以及由Breiman等人在1986年提出的CART算法。

决策树在现实生活中，已得到了很广泛的应用，举两个很常见的例子：

- 猜测人物，游戏的规则很简单：参与游戏的一方在脑海里想某个人，然后游戏页面一次一个选择选项陆续让你回答，比如，"这个人是在现代还是古代?"，一般问题的答案只能回答是还是不是，最后根据你一系列的回答便可以对你所想的某个人做出推断，比如你所想的这个人是你老爸。

- 投资指导或贷款申请。比如炒股，通过app新开账户后，有的会给出一个投资建议的指导，在生成这份指导建议前，会让你对某些问题(一般几个)进行回答，然后根据你的回答，生成一份对你投资类型的判断，开过这类账户的用户应该都有这个体验。另外一个就是贷款申请，会根据你的年龄、有无工作、是否有房子、信贷情况指标来决定是否给你贷款。

实际上，近来的调查研究表明决策树也是**最经常**使用的数据挖掘算法。接下来，按决策树的学习步骤先介绍决策树模型定义，然后介绍特征选择、决策树生成以及决策树的剪枝，最后编码测试一个实际的例子。

## 决策树模型定义

决策树模型是一种描述对实例进行分类的树形结构，它有结点(node)和有向边(directed edge)组成，结点有两种类型：内部结点(internal node)和叶结点(leaf node)。内部结点表示一个特征或者属性，叶结点表示一个类别。

在用决策树进行预测时，对于输入的某个样本$x_{test}$，从根结点开始，对$x_{test}$的某一个特征进行测试，根据测试的结果，将$x_{test}$分配分配到其子结点；然后递归的进行下一个规则的判断，直到到达叶结点，最后将$x_{test}$分配到叶结点的类中。

下图是决策树的示意图，图中的方框表示内部结点，圆型表示叶结点，即所属的类别。
![drawing](http://i300.photobucket.com/albums/nn17/willard-yuan/blog/Screen%20Shot%202015-10-23%20at%2023.55.27_zps5youxktx.png)
再举个具体的例子：
![drawing](http://i300.photobucket.com/albums/nn17/willard-yuan/blog/Screen%20Shot%202015-10-24%20at%2000.06.52_zpscvm4idpn.png)
上面，将邮件按重要性分成了3类：即无聊时阅读的邮件、需要即使处理的邮件以及无需阅读的垃圾邮件。

在前面**背景**中讲到，可以认为决策树是if-then规则的集合。从上面给出的两个图示也可以很明显的得到这样的结论。决策树转换成if-then规则的过程是这样的：由决策树的根结点的每一条路径构建一条规则，路径上内部结点的特征对应着规则的条件，叶结点对应的是规则的结论。由于决策树在对测试样本进行类别判定时，经过的判别路径（规则）只有一条，且判定的结果一定是属于叶结点中的某个，所以可以得出一个重要的性质：决策树的路径是**完备且互斥**的。也就是每一个实例都只能被一条路径（对应的规则子集）所覆盖（或满足）。

## 决策树学习

对于给定的数据集`\( D={\{(x_1, y_1),(x_2, y_2),...,(x_N, y_N) \}} \)`共N个样本，`\( x_i=(x_i^{(1)},x_i^{(2)},...,x_i^{(n)})^T \)`为样本$i$对应的$n$个特征，比如前面所举的贷款的例子，年龄、有无工作、是否有房子、信贷情况4个特征，$y\in{\{1,2,...,K\}}$为类标记，决策树学习的目标就是要根据给定的训练集构造一个决策树模型，是它能对未知样本进行正确的分类。

决策树从本质上来说，是从训练数据中归纳出一组分类规则，与训练数据集不相矛盾的决策树(即能对训练数据进行正确分类的决策树)可能有多个，也可能没有，我们需要的是一个与训练数据矛盾最小的决策树，同时又具备很好的泛化能力。决策树学习用损失函数表示这一目标，其损失函数通常是正则化的极大似然函数，学习的策略是使损失函数最小化。由于从所有可能的决策树中选取最优决策树是一个NP问题(?)，所以一般采用启发式方法，近似去求解这一问题，不过这样得到的决策树是次优解。

具体地，先开始构建根结点，将所有的训练数据都放在根结点，选择一个最优特征(这个最优特征按照什么标准进行选择?)，按照这一特征将训练数据集分割成子集，使得各个子集有一个在当前条件下分类是最好的(数据经过分类后更有序，信息熵最小)，如果这些子集基本已经能够被准确分类，那么就可以构建叶结点了，并将这些子集分到对应的叶结点中去，如果还有子集不能被正确分类，那么就继续对这些子集选择新的最优特征，继续对其进行分割，如此递归的进行下去，直到所有训练数据的子集基本被准确分类，或者没有合适的特征为止。

前面我们提到，决策树有可能出现过度匹配的问题，即决策树在训练数据集上有很好的分类精度，但是在测试数据上可能表现得很糟糕，这种情况就是所谓的过度匹配(过拟合)现象。为了削减这种现象，需要对已生成的树进行剪枝，将树变得更简单，从而使它具有更好的泛化能力。具体地，**就是去掉过于细节的叶结点，使其回退到父结点，甚至是更高的结点，然后将父结点或更高的结点改为新的叶结点**。

如果特征数目很多，可以先进行特征选择，去除部分冗余特征，只留下对训练数据有较好的分类能力的特征。

需要注意的是，决策树的生成对应于模型的局部选择，决策树的剪枝对应于模型的全局选择，即生成时只考虑了局部最优，而剪枝则考虑了全局最优。

在上面进行最优特征选择的时候，我们引出了这样一个问题，即"这个最优特征是按照什么标准选择出来的?"，为了回答这个问题，我们对这个问题进行详细的论述。

## 特征选择问题

特征选择是决定用哪个特征来决定划分特征空间。每次划分的时候，我们只选取一个特征属性，如果选取的训练集$D$中有$n$个特征，第一次选择哪个特征作为划分数据集的参考属性呢？

比如下表包含了5个海洋动物，特征包括：不浮出水面是否可以生存，是否有脚蹼。这5个海洋动物可以分成两类：鱼类和非鱼类。现在在构建根结点时，我们是选择第一个特征属性呢还是选择第二个特征属性划分数据。为了对这个问题的标准进行定量度量，我们选取信息增益或信息增益比作为我们选取特征的准则。
![](http://i300.photobucket.com/albums/nn17/willard-yuan/blog/Screen%20Shot%202015-10-24%20at%2010.39.57_zps3iqdbwe9.png)
划分数据数据集的大原则是：将无序的数据变得更加有序。度量数据杂乱无章程度的一种方法就是使用信息论中的信息熵，在划分数据之前和之后信息发生的变化称为信息增益，通过计算每个特征划分数据集获得的信息增益，获得信息增益最大的特征就是当前数据集下最好的用于划分数据最好的特征。

### 信息增益

在信息论和概率统计中，熵是表示随机变量不确定性的度量，熵越大，表示数据越杂乱无章，反之，则说明数据越有序。设$X$是一个取有限个值的离散随机变量，其概率分布为：

$$
\begin{equation}
   P(X = x_i) = p_i, i = 1, 2, ...,n
\end{equation}
$$

则随机变量$X$的熵定义为：

$$
\begin{aligned}
H(X) = - \sum_{i=1}^{n}p_ilogp_i
\end{aligned}
$$

若$p_i=0$，则定义$0log0=0$，上式中的对数底数通常以2为底或以e为底，这是熵的单位分别称为比特(bit)或纳特(nat)。由上式熵的定义式可知，熵只依赖于$X$的分布，而与$X$的取值无关，所以也可将$X$的熵$H(X)$记为$H(p)$。同时，从定义可以验证，$0<=H(p)<=logn$。当随机变量只取两个值，比如0、1时，即$X$服从0-1分布时，熵为：

$$
\begin{aligned}
H(p)=-plog_2p-(1-p)log_2(1-p)
\end{aligned}
$$

我们可以用pyhon画出熵$H(x)$随概率$p$变化的曲线：

```python
import numpy as np

p = np.linspace(0.,1.,11)
print p

Hp = -p*np.log2(p)-(1-p)*np.log2(1-p)
Hp[0] = Hp[-1] = 0
print Hp

%matplotlib inline
import matplotlib
from pylab import *
import matplotlib.pyplot as plt

fig = plt.figure()
ax = fig.gca()
ax.set_xticks(p)
plt.plot(p,Hp)
grid(True)
plt.xlabel('$p$')
plt.ylabel('$H(p)$')

plt.show()
```

运行上面代码，可以得到下图：
![](http://i300.photobucket.com/albums/nn17/willard-yuan/download_zps9lv2ptzd.png)
可以看到，但$p=1-p=0.5$时，即取0或1的概率都是0.5时，熵最大，随机变量不确定性最大。

在了解了信息熵的定义后，我们半手工计算一下前面海洋生物数据集上的信息熵：

```python
marineEnt = -0.4*np.log2(0.4)-0.6*np.log2(0.6)
print "the entropy of the marine organism: %.20f" % marineEnt
# the entropy of the marine organism: 0.97095059445466858072
```
上面显示在海洋生物数据集上的信息熵为0.97095059445466858072。下面对于对计算信息熵进行完整的编码，使得其能够更方便计算某个数据集的信息熵，具体如下：

```python
def creatData():
    dataSet = [[1, 1, 'yes'], [1, 1, 'yes'], [1, 0, 'no'], [0, 1, 'no'], [0, 1, 'no']]
    labels = ['no surfacing', 'flippers']
    return dataSet, labels

myData, labels = creatData()
print myData
# [[1, 1, 'yes'], [1, 1, 'yes'], [1, 0, 'no'], [0, 1, 'no'], [0, 1, 'no']]

from math import log

def calShannonEnt(dataSet):
    dataSet = myData
    numEntries = len(dataSet)
    print "the number of marine organism: %d" % numEntries
    labelCounts = {}
    for featVec in dataSet:
        currentLabel = featVec[-1]  #获取当前样本的类别标签，即"yes"或“no”
        if currentLabel not in labelCounts.keys():
            labelCounts[currentLabel] = 0  #如果当前样本的类别在labelCounts没有记录，则常见该类别的记录
        labelCounts[currentLabel] += 1
    print "label counts:"
    print labelCounts
    shannonEnt = 0.0
    for key in labelCounts:
        prob = float(labelCounts[key])/numEntries
        shannonEnt -= prob*math.log(prob, 2.0)
    return shannonEnt

print "the entropy of the marine organism: %.20f" % calShannonEnt(myData)

#the number of marine organism: 5
#label counts:
#{'yes': 2, 'no': 3}
#the entropy of the marine organism: 0.97095059445466858072
```

从上面给出的结果可以看到，计算出来的信息熵跟我们半手工计算出来的结果是一致的。决策树学习应用信息增益准则来选择特征，上面我们对信息熵有了比较好的理解后，我们进一步来看看信息增益。

### 信息增益

特征$A$对训练数据集$D$的信息增益$g(D,A)$，定义为集合$D$的经验熵$H(D)$与特征$A$给定条件下$D$的经验**条件熵$H(D\|A)$**之差，即：

$$
\begin{aligned}
g(D,A) = H(D) - H(D|A)
\end{aligned}
$$

条件熵$H(Y\|X)$定义为$X$给定的条件下$Y$的条件概率分布的熵对$X$的数学期望(是不是很拗口?)，其数学表达形式为：

$$
\begin{aligned}
H(Y|X) = \sum_{i=1}^np_iH(Y|X=x_i)
\end{aligned}
$$

这里，$p_i=P(X=x_i), i = 1,2,...,n$。一般地，熵$H(Y)$与条件熵$H(Y\|X)$之差称为互信息(mutual information)。决策树学习中的互信息增益等价于训练数据集中**类与特征的互信息**。

给定训练数据集$D$和特征$A$，经验熵$H(D)$表示数据集$D$进行分类的不确定性，而经验条件熵$H(D\|A)$表示在特征$A$给定的条件下对数据集$D$进行分类的不确定性，它们的差，即信息增益，表示**由于特征$A$而使得对数据集$D$的分类的不确定性减少的程度**。显然，对于数据集$D$而言，信息增益依赖于特征，不同的特征往往具有不同的信息增益，信息增益大的特征具有更强的分类能力。

根据信息增益准则的特征选择方法是：对训练数据集(或子集)$D$，计算其每个特征的信息增益，并比较它们的大小，选择信息增益最大的特征。

回到上面海洋生物的数据集，我们先手工分别来算一下按“不浮出水面是否可以生存”(将该特征用$A_1$来表示)和按“是否是脚蹼”(将该特征用$A_2$来表示)的信息增益：

$$
\begin{aligned}
g(D, A_1) & = H(D) - H(D|A) \\
& = H(D) - \left(\frac{3}{5}H(D_1) + \frac{2}{5}H(D_2)\right) \\\\
& = H(D) - \left[\frac{3}{5}\left((-\frac{2}{3})log_2\frac{2}{3} + (-\frac{1}{3})log_2\frac{1}{3}\right) + \frac{2}{5}(-1)log_21\right] \\\\
& = H(D) + \frac{2}{5}log_2\frac{2}{3} + \frac{1}{5}log_2\frac{1}{3}
\end{aligned}
$$

同样，可以算得$g(D,A_2)$:

$$
\begin{aligned}
g(D,A_2) & = H(D) - \left(\frac{4}{5}H(D_1) + \frac{1}{5}H(D_1)\right) \\\\
& = H(D) - \left(\frac{4}{5}(-\frac{2}{4}log\frac{2}{4}  -\frac{2}{4}log\frac{2}{4})\right)\\\\
& = H(D) + \frac{4}{5}log_2\frac{1}{2}\\\\
& = H(D) - 0.8
\end{aligned}
$$

接下来，我们用python计算具体的值：

```python
gA1 = HD+0.4*np.log2(2.0/3.0)+0.2*np.log2(1.0/3.0)
print "g(D, A1): %f" %gA1
gA2 = HD-0.8
print "g(D, A2): %f" %gA2
#g(D, A1): 0.419973
#g(D, A2): 0.170951
```

由于以特征A1划分数据集的信息增益$g(D,A_1)$大于以特征A2划分数据集的信息增益$g(D,A_2)$，所以，在初始划分数据集的时候，我们选择“不浮出水面是否可以生存”这个规则来划分训练数据。

下面，我们用python来计算信息增益，并验证一下其结果跟我们手算的结果是否一致，以及跟我们手工计算得出来应该选择“不浮出水面是否可以生存”的结论是否一致。

为了后续程序的理解，我们重新把上面海洋生物的表放这里，并把“是”用“1”代替，“否”用“0”代替，后面类别的“是”用“yes”代替，“否”用“0”代替：

| 海洋生物样本 | 不浮出水面是否可以生存 | 是否有脚蹼 | 属于鱼类 |
|:-----------:|:------------------:| :--------:|:--------:|
|      1     |        1           |      1    |    yes   |
|      2     |        1           |      1    |    yes   |
|      3     |        1           |      0    |    no    |
|      4     |        0           |      1    |    no    |
|      5     |        0           |      1    |    no    |

下面是按照给定特征划分数据集的代码：

```python
def splitDataSet(dataSet, axis, value):
    retDataSet = []
    for featVec in dataSet:
        if featVec[axis] == value:
            reducedFeatVec = featVec[:axis]
            reducedFeatVec.extend(featVec[axis+1:])
            retDataSet.append(reducedFeatVec)
    return retDataSet

dataSet = myData
axis = 0
value = 1
myDat = splitDataSet(dataSet, axis, value)
print myDat
#myDat的输出：[[1, 'yes'], [1, 'yes'], [0, 'no']]
```

上面，我们按第一个特征A1将数据进行了划分，接下来我们计算特征的不同划分，来计算信息增益：

```python
numFeatures = len(dataSet[0]) - 1
baseEntropy = calShannonEnt(dataSet)
print "Base entropy: %f" % baseEntropy

print

bestInGain = 0.0
bestFeature = -1
for i in range(numFeatures):
    featList = [example[i] for example in dataSet]
    print "==========select feature========="
    print featList
    print
    uniqueVals = set(featList)
    newEntropy = 0.0
    for value in uniqueVals:
        subDataSet = splitDataSet(dataSet, i, value)
        print "sub-dataset: "
        print subDataSet
        print
        prob = len(subDataSet)/float(len(dataSet))
        newEntropy += prob*calShannonEnt(subDataSet)
    infoGain = baseEntropy - newEntropy
    print "information gain: %f20" % infoGain
    if (infoGain > bestInGain):
        bestInGain = infoGain
        bestFeature = i

print "\nThe selected best feature: %d" % bestFeature
```

运行上面代码，我们可以得到如下的结果：

```bash
the number of marine organism: 5
label counts:
{'yes': 2, 'no': 3}
Base entropy: 0.970951

==========feature candidate=========
[1, 1, 1, 0, 0]

sub-dataset:
[[1, 'no'], [1, 'no']]

the number of marine organism: 2
label counts:
{'no': 2}
sub-dataset:
[[1, 'yes'], [1, 'yes'], [0, 'no']]

the number of marine organism: 3
label counts:
{'yes': 2, 'no': 1}
information gain: 0.41997320
==========feature candidate=========
[1, 1, 0, 1, 1]

sub-dataset:
[[1, 'no']]

the number of marine organism: 1
label counts:
{'no': 1}
sub-dataset:
[[1, 'yes'], [1, 'yes'], [0, 'no'], [0, 'no']]

the number of marine organism: 4
label counts:
{'yes': 2, 'no': 2}
information gain: 0.17095120

The selected best feature: 0
```

对于特征$A_1$，得出的信息增益是$0.41997320$；对于特征$A_2$，得出的信息增益是$0.17095120$，同时，选取出的特征是第$0$个特征，这与我们前面手工计算的结果是完成一致的，也表明程序写得是没问题的。

实际上，在上面计算完了信息增益后，我们还可以进一步计算信息增益比，接下来，我们稍微花些笔墨介绍一下信息增益比。

### 信息增益比

信息增益比的大小是相对于训练数据集而言的，并没有绝对的意义。它也可以作为特征选择的一种准则，其定义形式为：

$$
\begin{aligned}
g_R(D,A)&=\frac{g(D,A)}{H(D)}\\\\
&=\frac{H(D) - H(D|A)}{H(D)}\\\\
&=1-\frac{H(D|A)}{H(D)}
\end{aligned}
$$

顺带了解了这个概念后，我们重新回到原来的问题(先到这里，后面补充)。


