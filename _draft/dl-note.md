
### Inner Product Layer

Inner Product Layer即全连接层，对于IP层的理解，可以简单的将其视为矩阵`1*N`和矩阵`N*M`相乘后得到`1*M`的维度向量。

举个简单的例子，比如输入全连接层的是一个`3*56*56`维度的数据，假设未知的权重维度为`N*M`，假设全连接层的输出为`num_ouput = 4096`，为了计算全连接层的输出，全连接层会将输入的数据`3*56*56` reshape 成为`1*N`的形式，即`1x(56x56x3) = 1x9408`，所以：

```
N = 9408  
M = num_ouput = 4096
```

由此，我们做了一个`(1x9408)`矩阵和`(9408x4096)`矩阵的乘法。如果`num_output`的值改变成为100，则做的是一个`(1x9408)`矩阵和`(9408x100)`矩阵的乘法。**Inner Product layer（常被称为全连接层）将输入视为一个vector，输出也是一个vector（height和width被设为1）**。

增大`num_output`会使得模型需要学习的权重参数增加。

[caffe inner\_product\_layer.cpp](https://github.com/BVLC/caffe/blob/master/src/caffe/layers/inner_product_layer.cpp)

参考

1. [What is the output of fully connected layer in CNN?](https://stackoverflow.com/questions/35788873/what-is-the-output-of-fully-connected-layer-in-cnn)
2. [caffe_cpu_gemm函数](http://blog.csdn.net/seven_first/article/details/47378697)
3. [Caffe学习：Layers](http://blog.csdn.net/u011762313/article/details/47361571)
4. [Caffe Layers](http://caffe.berkeleyvision.org/tutorial/layers.html)


### Split Layer和Concat Layer

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

### Caffe Python Layer

参考  

1. [Caffe Python Layer](https://chrischoy.github.io/research/caffe-python-layer/)  
2. [caffe添加pythonlayer](https://saicoco.github.io/pycaffe/)

### 随机梯度下降参数

> 学习速率（learning rate）初始化为0.01，在训练中当loss达到稳定时，将学习速度除以一个常数（例如10），重复多次；对于动量（momentum）一般设置为0.9，动量使weight的更新更为平缓，使学习过程更稳定、快速。例如Caffe中SolverParameter的技巧：  

```
base_lr: 0.01 # 开始学习速率为：α = 0.01=1e-2 
lr_policy: "step" # 学习策略: 每stepsize次迭代之后，将α乘以gamma
gamma: 0.1 # 学习速率变化因子 
stepsize: 100000 # 每100K次迭代，降低学习速率 
max_iter: 350000 # 训练的最大迭代次数350K 
momentum: 0.9 # 动量momentum为：μ = 0.9
```

参考 

1. [CAFFE官方教程学习笔记](https://zhuanlan.zhihu.com/p/22492036)

### 附录

1. [Ubuntu下借助Qt Creator 调试Caffe](http://blog.csdn.net/xg123321123/article/details/52817658)