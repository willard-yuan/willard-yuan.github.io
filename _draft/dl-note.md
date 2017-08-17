
### Inner Product Layer


Inner Product Layer即全连接层，对于IP层的理解，可以简单的将其视为矩阵`1*N`和矩阵`N*M`相乘后得到`1*M`的维度向量。

举个简单的例子，比如输入全连接层的是一个`3*56*56`维度的数据，假设未知的权重维度为`N*M`，假设全连接层的输出为`num_ouput = 4096`，为了计算全连接层的输出，全连接层会将输入的数据`3*56*56` reshape 成为`1*N`的形式，即`1x(56x56x3) = 1x9408`，所以：

```
N = 9408  
M = num_ouput = 4096
```

由此，我们做了一个`(1x9408)`矩阵和`(9408x4096)`矩阵的乘法。如果`num_output`的值改变成为100，则做的是一个`(1x9408)`矩阵和`(9408x100)`矩阵的乘法。增大`num_output`会使得模型需要学习的权重参数增加。

[caffe inner_product_layer.cpp](https://github.com/BVLC/caffe/blob/master/src/caffe/layers/inner_product_layer.cpp)

参考

1. [What is the output of fully connected layer in CNN?](https://stackoverflow.com/questions/35788873/what-is-the-output-of-fully-connected-layer-in-cnn)
2. [caffe_cpu_gemm函数](http://blog.csdn.net/seven_first/article/details/47378697)