---
layout: post
title: 图像检索：Fisher Information Matrix and Fisher Kernel
categories: [Image Retrieval]
tags: CBIR
---

> [罗纳德·费雪](http://wiki.mbalib.com/wiki/%E7%BD%97%E7%BA%B3%E5%BE%B7%C2%B7%E8%B4%B9%E9%9B%AA)（Sir Ronald Aylmer Fisher, FRS，1890.2.17－1962.7.29)，现代统计学与现代演化论的奠基者之一，安德斯·哈尔德称他是“一位几乎独自建立现代统计科学的天才”，理查·道金斯则认为他是“达尔文最伟大的继承者”。 

![](http://ose5hybez.bkt.clouddn.com/2015/1002/Ronald_Aylmer_Fisher.jpg) 

局部特征作为一种强鲁棒性的特征，其与全局特征构成了CV领域图像内容描述的基础。相比于全局特征，局部特征往往在对低层共有模式的表达上可以做到更细的粒度（关于局部和全局在视觉认知上的作用机制，强烈推荐阅读[尺度空间理论](https://en.wikipedia.org/wiki/Scale_space)），但同时也引发了新的问题，即**特征处理效率低、存储大等方面的问题**。因而需要将局部特征经过某种编码方式，最终表示成一种紧凑的全局特征表示。

Fisher Vector作为连接单向连接局部特征到全局表示的三大特征编码方法之一（另外两种编码方式见[图像检索：BoF、VLAD、FV三剑客](http://yongyuan.name/blog/CBIR-BoF-VLAD-FV.html)），无论是在学术研究领域还是在工业实际应用上，都具有很重要的地位。下面内容是小白菜对Fisher Vector中的Fisher信息矩和Fisher核的数学推导及对应物理意义的总结整理。

## Fisher信息矩和Fisher核

在空间$\chi$中，某样本$X$存在$T$个观测量，记为$X = \lbrace x_t, t=1 \dots T \rbrace$。对应到图像上，样本$X$为图像$I$提取到的$T$个$D$维的局部描述子，比如SIFT。设$\mu_\lambda$为概率密度函数，该函数包含有$M$个参数，即$\lambda = [\lambda_1, \dots, \lambda_M]$。根据生成式原理，空间$\chi$中的元素$X$可以由概率密度函数进行建模。在统计学上，分数函数（score funciton）可以由对数似然函数的梯度给出，即：

\begin{equation}
G^X_\lambda = \nabla log \mu_\lambda(X)
\label{sfun}
\end{equation}

上式对数函数的梯度，在数学形式上为对数似然函数的一阶偏导，它描述了每一个参数$\lambda_i$对该生成式过程的贡献度，换言之，该分数函数$G^X_\lambda$描述了生成式模型$\mu_\lambda$为了更好的拟合数据$X$，该模型中的参数需要做怎样的调整。又因为$G^X_\lambda \in R^M $是一个维度为$M$维的向量，所以该分数函数的维度仅依赖于$\lambda $中参数的数目$M$, 而于观测样本的数目$T$无关。此外，一般情况下，该分数函数的期望$E[ G^X_\lambda ] = 0 $，这一点对于下面讲到的Fisher信息矩物理意义的得到非常重要。

根据信息几何理论，含参分布$\Gamma = \lbrace \mu_\lambda, \lambda \in \Lambda \rbrace$可以视为一个黎曼流形$M_\Lambda$，其局部度量方式可以由Fisher信息矩(Fisher Information Matrix, FIM）$F_\lambda \in R^{M \times M}$:

\begin{equation}
F_{\lambda} = E_{ x \sim \mu_\lambda } [ G^X_\lambda (G^X_\lambda)^T ]
\label{fim}
\end{equation}

从上式可以看到，Fisher信息矩是分数函数的二阶矩。在一般条件下很容易证明（注意$E[ G^X_\lambda ] = 0 $）：

$$
\begin{aligned}
F_{\lambda} &= E_{ x \sim \mu_\lambda } [ G^X_\lambda (G^X_\lambda)^T ] \\\\
            &= E[(G^X_\lambda)^2] \\\\
            &= E[(G^X_\lambda)^2] - E[ G^X_\lambda ]^2 \\\\
            &= Var[G^X_\lambda]
\end{aligned}
$$

从上式可以看到，Fisher信息矩是用来估计最大似然估计（Maximum Likelihood Estimate, MLE）的方程的方差。它直观的表述就是，在独立性假设的条件下，随着收集的观测数据越来越多，这个方差由于是一个相加的形式，因而Fisher信息矩也就变的越来越大，也就表明得到的信息越来越多。

> 注：此处引用了[fisher information 的直观意义是什么?](https://www.zhihu.com/question/26561604)

对于两组不同的观察样本$X$和$Y$，Jaakkola和Haussler提出了使用Fisher核来度量它们之间的相似性，其数学表达形式为：

\begin{equation}
K_FK(X, Y) = (G^X_\lambda)^T F_\lambda^{-1} G^X_\lambda
\label{fk}
\end{equation}

又因为$F_{\lambda}$是半正定的，所以其逆矩阵是存在的。使用cholesky分解可以得到$F_\lambda^{-1} = (L_\lambda)^T L_\lambda$，上式可以写成内积的表示形式：

\begin{equation}
K_FK(X, Y) = (\wp^X_\lambda)^T \wp^Y_\lambda
\label{fk1}
\end{equation}

其中,
\begin{equation}
\wp^X_\lambda = L_\lambda G^X_\lambda = L_\lambda \nabla log \mu_\lambda(X)
\label{wp_lambda}
\end{equation}

上式是$L_\lambda$对$G^X_\lambda$的归一化，我们将$\wp^X_\lambda$称为Fisher向量，该Fisher向量$\wp^X_\lambda$等于梯度向量$G^X_\lambda$的维度，又由于$G^X_\lambda$的维度仅与概率密度函数的参数数目$M$有关，所以空间$\chi$中任意样本$X$的$T$个观测量最终都可以表示成一固定维度的向量。通过使用$\wp^X_\lambda$算子，使得非线性核相似性度量问题转化为线性问题。这种变换带来的一个明显的优势是，在分类的时候可以采用更高效的线性分类器。
