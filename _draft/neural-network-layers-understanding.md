---
layout: post
title: 深度学习：Neural Network Layers Understanding
categories: [Deep Learning]
tags: DL
---

> 我想做又应该做的事，都会做到；我想做却不应做的事，都会戒掉。

## Inner Product Layer

Inner Product Layer即全连接层，对于IP层的理解，可以简单的将其视为矩阵`1*N`和矩阵`N*M`相乘后得到`1*M`的维度向量。

举个简单的例子，比如输入全连接层的是一个`3*56*56`维度的数据，假设未知的权重维度为`N*M`，假设全连接层的输出为`num_ouput = 4096`，为了计算全连接层的输出，全连接层会将输入的数据`3*56*56` reshape 成为`1*N`的形式，即`1x(56x56x3) = 1x9408`，所以：

```
N = 9408
M = num_ouput = 4096
```

由此，我们做了一个`(1x9408)`矩阵和`(9408x4096)`矩阵的乘法。如果`num_output`的值改变成为100，则做的是一个`(1x9408)`矩阵和`(9408x100)`矩阵的乘法。**Inner Product layer（常被称为全连接层）将输入视为一个vector，输出也是一个vector（height和width被设为1）**。下面是IP层的示意图

![](http://ose5hybez.bkt.clouddn.com/2017/draft/fcgemm_corrected.png)

> 图片摘自[Why GEMM is at the heart of deep learning](https://petewarden.com/2015/04/20/why-gemm-is-at-the-heart-of-deep-learning/)

增大`num_output`会使得模型需要学习的权重参数增加。IP层一个典型的例子：

```text
layer {
  name: "ip1"
  type: "InnerProduct"
  bottom: "pool2"
  top: "ip1"
  # learning rate and decay multipliers for the weights
  param {
    lr_mult: 1
  }
  # learning rate and decay multipliers for the biases
  param {
    lr_mult: 2
  }
  inner_product_param {
    num_output: 500
    weight_filler {
      type: "xavier"
    }
    bias_filler {
      type: "constant"
    }
  }
}
```

有了上面对IP层的理解，对[caffe inner\_product\_layer.cpp](https://github.com/BVLC/caffe/blob/master/src/caffe/layers/inner_product_layer.cpp)中Forward的理解就比较自然了。下面是Caffe的IP层在CPU上的实现：

```cpp
template <typename Dtype>
void InnerProductLayer<Dtype>::Forward_cpu(const vector<Blob<Dtype>*>& bottom,
    const vector<Blob<Dtype>*>& top) {
  const Dtype* bottom_data = bottom[0]->cpu_data();
  Dtype* top_data = top[0]->mutable_cpu_data();
  const Dtype* weight = this->blobs_[0]->cpu_data();
  caffe_cpu_gemm<Dtype>(CblasNoTrans, transpose_ ? CblasNoTrans : CblasTrans,
      M_, N_, K_, (Dtype)1.,
      bottom_data, weight, (Dtype)0., top_data);
  if (bias_term_) {
    caffe_cpu_gemm<Dtype>(CblasNoTrans, CblasNoTrans, M_, N_, 1, (Dtype)1.,
        bias_multiplier_.cpu_data(),
        this->blobs_[1]->cpu_data(), (Dtype)1., top_data);
  }
}
```

上面完成矩阵与矩阵相乘的函数是`caffe_cpu_gemm<Dtype>`（见[math_functions.cpp](https://github.com/BVLC/caffe/blob/master/src/caffe/util/math_functions.cpp))，`caffe_cpu_gemm`函数矩阵相乘的具体数学表示形式为：

$$
\begin{equation}
   C=alpha*TransA(A)*TransB(B) + beta*C\\\\
\end{equation}
$$

上式中`TransX`是对`X`做的一种矩阵变换，比如转置、共轭等，具体是`cblas.h`中定义的为枚举类型。在[math_functions.cpp](https://github.com/BVLC/caffe/blob/master/src/caffe/util/math_functions.cpp)中，除了定义矩阵与矩阵相乘的`caffe_cpu_gemm`外，还定义了矩阵与向量的相乘，具体的函数为`caffe_cpu_gemv`，其数学表示形式为：

$$
\begin{equation}
   C=alpha*TransA(A)*y + beta*y\\\\
\end{equation}
$$

上面表达式中，`y`是向量，不是标量。

#### 参考

1. [Why GEMM is at the heart of deep learning](https://petewarden.com/2015/04/20/why-gemm-is-at-the-heart-of-deep-learning/)
2. [What is the output of fully connected layer in CNN?](https://stackoverflow.com/questions/35788873/what-is-the-output-of-fully-connected-layer-in-cnn)
3. [caffe_cpu_gemm函数](http://blog.csdn.net/seven_first/article/details/47378697)
4. [Caffe学习：Layers](http://blog.csdn.net/u011762313/article/details/47361571)
5. [Caffe Layers](http://caffe.berkeleyvision.org/tutorial/layers.html)

## GEMM

在上面的IP层中，我们已经涉及到了GEMM的知识，在这一小节里面，不妨对该知识点做一个延伸。

GEMM是BLAS (Basic Linear Algebra Subprograms)库的一部分，该库在1979年首次创建。为什么GEMM在深度学习中如此重要呢？我们可以先来看一个图：

![](http://ose5hybez.bkt.clouddn.com/2017/draft/gemm_cup_gpu.png)

> 图片摘自[Yangqing Jia](http://daggerfs.com/)的[thesis](http://www.eecs.berkeley.edu/Pubs/TechRpts/2014/EECS-2014-93.pdf)

上图是采用AlexNet对CNN网络中不同layer GPU和CPU的时间消耗，从更底层的实现可以看到CNN网络的主要时间消耗用在了FC (for fully-connected)和Conv (for convolution)，而FC和Conv在实现上都将其转为了矩阵相乘的形式。举个例子：

![](http://ose5hybez.bkt.clouddn.com/2017/draft/cnn_gemm.jpg)

> 图片摘自[cuDNN: Efficient Primitives for Deep Learning](http://arxiv.org/pdf/1410.0759.pdf)

上面Conv在Caffe中具体实现的时候，会将每一个小的patch拉成一个向量，很多patch构成的向量会构成一个大的矩阵，同样的对于多个卷积核展成一个矩阵形式，从而将图像的卷积转成了矩阵与矩阵的相乘（更形象化的解释参阅[在 Caffe 中如何计算卷积？](https://www.zhihu.com/question/28385679/answer/44297845)）。上面可以看到在FC和Conv上消耗的时间GPU占95%，CPU上占89%。因而GEMM的实现高效与否对于整个网络的效率有很大的影响。

那么什么是GEMM呢？GEMM的全称是GEneral Matrix to Matrix Multiplication，正如其字面意思所表达的，GEMM即表示两个输入矩阵进行相乘，得到一个输出的矩阵。两个矩阵在进行相乘的时候，通常会进行百万次的浮点运算。对于一个典型网络中的某一层，比如一个256 row*1152 column的矩阵和一个1152 row*192 column的矩阵，二者相乘57 million (256 x 1152 x 192)的浮点运算。因而，通常我们看到的情形是，一个网络在处理一帧的时候，需要几十亿的FLOPs（Floating-point operations per second，每秒浮点计算）。

既然知道了GEMM是限制整个网络时间消耗的主要部分，那么我们是不是可以对GEMM做优化调整呢？答案是否定的，GEMM采用Fortran编程语言实现，经过了科学计算编程人员几十年的优化，性能已经极致，所以很难再去进一步的优化，在Nvidia的论文[cuDNN: Efficient Primitives for Deep Learning](http://arxiv.org/pdf/1410.0759.pdf)中指出了还存在着其他的一些方法，但是他们最后采用的还是改进的GEMM版本实现。GEMM可匹敌的对手是傅里叶变换，将卷积转为频域的相乘，但是由于在图像的卷积中存在strides，使得傅里叶变换方式很难保持高效。

## Split Layer和Concat Layer

Split Layer用于将一个blob输入到多个layer的场合，跟这个layer功能相反的layer是Concat Layer，Concat Layer将多个输出层的结果concat到一起。通过split和concat这两个layer，可以构建不同层之间的关联。下面是split layer和concat layer的示例：

```
split layer例子
```

```
layer {
    name: "concat"
    bottom: "in1"
    bottom: "in2"
    top: "out"
    type: "Concat"
    concat_param { axis: 1 }
}
```

axis [default 1]: 0 表示沿着样本个数的维度（num）串联，1表示沿着通道维度（channels）串联。

参考

1. [Caffe Split Layer](http://caffe.berkeleyvision.org/tutorial/layers/split.html)

## 随机梯度下降SGD参数

```
base_lr: 0.01 # 开始学习速率为：α = 0.01=1e-2
lr_policy: "step" # 学习策略: 每stepsize次迭代之后，学习率变为base_lr * gamma ^ (floor(iter / stepsize))
gamma: 0.1 # 学习速率变化因子
stepsize: 100000 # 每100K次迭代，降低学习速率
max_iter: 350000 # 训练的最大迭代次数350K
momentum: 0.9 # 动量momentum为：μ = 0.9
```

`base_lr`：基础学习率，也就是刚开始迭代的时候使用的学习率。如果学习的时候出现diverge（比如loss非常大、或者NaN、或者inf、或者不收敛），此时可以降低base\_lr的值（比如0.001），然后重新训练，重复此过程知道找到收敛的base\_lr。
`lr_policy`：如果设置为step，则学习率的变化规则为：`base\_lr * gamma ^ (floor(iter / stepsize))
。比如上面的例子，在1-100K次迭代的时候，learning rate是base\_lr，在100k-200次时，learning rate是base\_lr^gamma，依次类推。
`momentum`: 取值通常在0.5-0.99之间。一般设为0.9，momentum可以让使用SGD的学习过程更加稳定以及快速。

参考

1. [CAFFE官方教程学习笔记](https://zhuanlan.zhihu.com/p/22492036)


## 损失函数Loss

> Hinge损失层用于计算one-vs-all hinge或者squared hinge损失。  
参数：norm [default 1]：正则项类型，L1和L2

```text
# L1 Norm
layer {
    name: "loss"
    type: "HingeLoss"
    bottom: "pred"
    bottom: "label"
}
# L2 Norm
layer {
    name: "loss"
    type: "HingeLoss"
    bottom: "pred"
    bottom: "label"
    top: "loss"
    hinge_loss_param {
        norm: L2
    }
}
```

[yongyuan.name/blog](http://yongyuan.name/blog)

## 附录

1. [Ubuntu下借助Qt Creator 调试Caffe](http://blog.csdn.net/xg123321123/article/details/52817658)
