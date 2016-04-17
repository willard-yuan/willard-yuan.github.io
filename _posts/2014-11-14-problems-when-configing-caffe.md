---
layout: post
title: 环境配置：Caffe配置中的一些问题
categories: [Machine Learning]
tags: Caffe
---

一直想将DL用于自己目前研究的image retrieval中，实际上，本小子在之前的博文[Deep Learning for Content-Based Image Retrieval](http://yongyuan.name/blog/deep-learning-for-cbir.html)关于用DL做检索的paper也做了些调研。可以看出，虽然DL现在很火，但是将其用于image retrieval似乎还并不多。这连天正好忙里偷闲，在Ubuntu12.04中把caffe捣鼓了一番，成功，只能说配置起来真的很egg pain。下面是自己在配置过程中出现的一些问题，配置的时候自己特地做了笔记，便于后面查阅。

1、 CUDA自带了显卡驱动，安装后图形界面分辨率变模糊，NVIDIA图形配置是出现:

```text
You do not appear to be using the NVIDIA X driver. Please edit your X configuration file (just run nvidia-xconfig as root), and restart the X server
```
主要是由于没激活安装的显卡:

>I was also facing the same problem. Now that you asked it, I wanted to fix >in my computer as well. So here is how you do it.

>EDIT: sudo apt-get install nvidia-current

>sudo nvidia-xconfig. This will just create the file /etc/X11/xorg.conf. Next do
>
>sudo software-properties-gtk

[答案链接](http://askubuntu.com/questions/286654/nvidia-driver-installed-successfully-but-not-activated)按照上面安装后，重启，完成激活。

2、`/include/caffe/common.hpp:5:27: 致命错误： gflags/gflags.h：没有那个文件或目录编译中断。make: *** [.build_release/src/caffe/common.o] 错误`。可以看出跟gflags有关，大概推测是gflags没装，于是按照教程把下面的都安装了：

```sh
# 安装glog/gflags/lmdb
# glog
wget https://google-glog.googlecode.com/files/glog-0.3.3.tar.gz
tar zxvf glog-0.3.3.tar.gz
cd glog-0.3.3
./configure
make && make install
# gflags
wget https://github.com/schuhschuh/gflags/archive/master.zip
unzip master.zip
cd gflags-master
mkdir build && cd build
export CXXFLAGS="-fPIC" && cmake .. && make VERBOSE=1
make && make install
# lmdb
git clone https://gitorious.org//mdb/mdb.git
cd mdb/libraries/liblmdb
make && make install
```
3、如果用make all编译caffe时出现mkl错误：`./include/caffe/util/mkl_alternate.hpp:6:17: 致命错误： mkl.h：没有那个文件或目录
编译中断`。主要是因为MKL与CUDA的环境设置没设置好。另外安装MKL时最好选择默认路径：

```sh
/opt/intel/lib/intel64
/opt/intel/mkl/lib/intel64
```
4、出现：`/usr/bin/ld: cannot find -lboost_system
collect2: ld 返回 1make: *** [.build_release/lib/libcaffe.so] 错误`。这个需要安装libboost-dev,运行下面命令即可完成按照：

```sh
sudo apt-get install libboost-all-dev
```
安装Caffe并测试。切换到Caffe的下载文件夹，然后执行：

```sh
$ cp Makefile.config.example Makefile.config
```
修改新生成的Makefile.config文件，修改“BLAS := mkl”，这个非常重要。

```sh
$ make clean
$ make all
$ make test
$ make runtest
```
新建cuda.conf，并编辑之：

```sh
$ sudo touch cuda.conf
$ sudo vim cuda.conf
```
在新建的`cuda.conf`中添加：

```text
/usr/local/cuda/lib64
/lib
```
完成lib文件的链接操作，执行：

```sh
$ sudo ldconfig -v
```
5、When ./create_mnist.sh, fault: convert_mnist_data.bin: not found

这个问题，在caffe github上有人提出了issue,[链接传送门](https://github.com/BVLC/caffe/issues/1251),按照答案说的，对于caffe，必须得在caffe的根目录，所以根目录运行脚本吧。

最后，如果没用GPU的话，在`examples/mnist/lenet_solver.prototxt`最后一行修改GPU为CPU。

## caffe python接口安装

1、 如果没有pip的话，先安装pip。进入caffe python目录，安装所需要的依赖关系：

```sh
sudo pip install -r requirement.txt
```
用requirements.txt失败，用 Anaconda安装`sudo pip install -r /path/to/caffe/python/requirements.txt`在执行上述命令时， 会报错导致不能完全安装所有需要的包。 可以按照官方建议安装anaconda包。 在anaconda官网下载.sh文件，执行，最后添加bin目录到环境变量即可(在安装的时候会询问你时是否添加)。

注意：Anaconda安装的库并没有在python的库目录中。

2、 错误：libm.so.6: GLIBC_2.15 not found, required by libopencv。。。将libm.so.6和libm.so重命名为别的即可,比如：

```sh
sudo mv libm.so.6 libm.so.6.backup
sudo mv libm.so libm.so.backup
```

3、 你需要安装ipython和ipython qtconsole。安装完后可以用下面的脚本测试:

```python
import sys
sys.path.append('/home/yong/anaconda/lib/python2.7/site-packages')
sys.path.append('/usr/lib/python2.7/dist-packages')

import numpy as np
import matplotlib.pyplot as plt
%matplotlib inline

# Make sure that caffe is on the python path:
caffe_root = '../'  # this file is expected to be in {caffe_root}/examples

sys.path.insert(0, caffe_root + 'python')

import caffe

plt.rcParams['figure.figsize'] = (10, 10)
plt.rcParams['image.interpolation'] = 'nearest'
plt.rcParams['image.cmap'] = 'gray'
```

参考：

1. [caffe官网](http://caffe.berkeleyvision.org/installation.html)

2. [Ubuntu12.04上面用CPU编译使用caffe（不完全安装）](http://blog.csdn.net/zxd675816777/article/details/39649281)

3. [Caffe + Ubuntu 14.04 + CUDA 6.5 新手安装配置指南](http://blog.csdn.net/u013476464/article/details/38071075)

4. [Caffe配置过程](http://www.haogongju.net/art/2433691)

5. [DIY Deep Learning for Vision: a Hands-On Tutorial with Caffe](https://docs.google.com/presentation/d/1UeKXVgRvvxg9OUdh_UiC5G71UMscNPlvArsWER41PsU/preview?sle=true&slide=id.g355666fe0_0104)
