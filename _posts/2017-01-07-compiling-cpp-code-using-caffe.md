---
layout: post
title: 机器视觉：makefile编译调用Caffe框架的C++程序
categories: [机器视觉]
tags: 机器视觉
---


Caffe作为在众多公司搞深度学习时较多使用的框架，其在使用的友好程度上显然要比后起的一些深度学习框架要差一些，虽然如此，其作为深度学习的第一个开源框架，自有它的很多优势，比如设计结构。关于Caffe的种种，这里不表，小白菜仅聊很小的一个点，即：**对于调用Caffe框架的C++程序，如何使用makefile进行编译的问题**。

这个问题是小白菜近两天遇到的一个问题，经过小半天的谷歌以及尝试，顺利解决。记录下来，一则备查询之需，二则对碰到相同问题的朋友也应该有帮助。当然对使用IDE的朋友，这个问题并不是问题，但是某些场合，比如开发环境在服务器上，这时候只能采用vim+makefile的方式来编写代码以及编译代码了，so我们终究还是避不过这个问题。

关于使用makefile编译调用Caffe框架的C++程序，有两种方式：一种是最容易且最笨的方法，即把你写的C++程序方法Caffe的examples目录里面，然后在`CMakeLists.txt`里面把你的C++程序添加到相应的位置，这种方式终究不是一个长久之道；另外一种是把Caffe编译成一个库，然后我们可以像正常使用一个库一样，调用和编译C++程序了。小白菜以为，此种方式是最优雅的方法，注意，对于makefile文件，我们并不是直接写的，而是通过写cmake文件然后编译生成的makefile文件。整个过程分为三步：

- 重新编译一份Caffe
- 编写cmake文件
- 编译目标文件

下面细解该方法的步骤。

## 重新编译一份Caffe

对于已有Caffe环境了的小伙伴，对于重新编译一份Caffe可能觉得多余，但小白菜以为，通过下面这种方式编译，可以让你后续的步骤能够顺利进行，执行下面命令：

```sh
git clone https://github.com/BVLC/caffe.git
git checkout master
cp Makefile.config.example Makefile.config
```
修改`Makefile.config`文件，小白菜的线上环境用的Openblas做的矩阵加速，所以BLAS这一块的配置如下：

```make
# BLAS choice:
# atlas for ATLAS (default)
# mkl for MKL
# open for OpenBlas
BLAS := open
BLAS_INCLUDE := /opt/OpenBLAS/include
BLAS_LIB := /opt/OpenBLAS/lib
```

然后，可以开始愉快地编译下面Caffe了：

```sh
mkdir build && cd build
cmake .. -DBUILD_SHARED_LIB=ON -DBLAS=open
cmake . -DCMAKE_BUILD_TYPE=Debug     # switch to debug
make -j 12 && make install           # installs by default to build_dir/install
cmake . -DCMAKE_BUILD_TYPE=Release   # switch to release
make -j 12 && make install           # doesn’t overwrite debug install
make pycaffe
```

上面编译完成后，我们在`build/install`目录下看到Caffe作为一个供调用的库的完整文件：

```sh
├── bin
├── include
├── lib
├── python
└── share
```
到这里，第一步走完了。回到关于推荐重新编译一份的问题，为什么推荐重新编译一份呢？这是因为，后面在写cmake文件的时候，我们是通过find_package来找Caffe库的，如果不按上面的过程重新编译一份，find_package无法找到Caffe的库目录。当然你也可以通过其他的方式绕过去，但如果想少些折腾，还是按这个来为妥。

此外，为了能够正常使用Caffe的Python接口，还需要按照Python的一些依赖模块：

```sh
cd caffe_root/python
pip install -r requirements.txt
```

**补充**：对于mac osx系统，如果按照上面编译完后，在`import caffe`时出现如下错误：

```sh
26852 segmentation fault python
```
这个错误主要是Makefile.conf中python的include和lib设置不合理所引起的，具体可以参考[Segfault on PyCaffe import](https://github.com/BVLC/caffe/issues/2677)。将`PYTHON_INCLUDE`和`PYTHON_LIB`修改为：

```sh
PYTHON_INCLUDE := /usr/local/Cellar/python/2.7.13/Frameworks/Python.framework/Versions/2.7/include/python2.7

PYTHON_LIB := /usr/local/Cellar/python/2.7.13/Frameworks/Python.framework/Versions/2.7/lib
```
然后重新按照前面的步骤编译一遍即可解决上面的bug。

### 虚拟环境运行Caffe异常

讲真，只要使用python编程，anaconda绝对是一把利器。集成的ipython、jupyter、常用的第三方模块以及虚拟环境，可以省去不少让人折腾的功夫。举个例子，在日常的开发中，小白菜做开发都是在服务器上，但服务器上没有sudo权限，所以如果用Pyhon做开发，弄个虚拟开发环境必不可少。一直以来，小白菜都是用的Virtualenv来构建虚拟环境。这几天，在看Anaconda的bin目录下，发觉了Anaconda也有activate，然后揣测它应该跟Virtualenv，然后执行`source activate`，安装了Keras测试一下，发觉它并没有安装在系统目录里，而是安装在Anaconda目录下，甚喜，因为这意味着小白菜以后可以随意安装自己需要的安装包。

为了方便导入Caffe，将Caffe的Python目添加到环境变量中：

```sh
export PYTHONPATH=/home/yuanyong/caffe/python:$PYTHONPATH
```

执行`source .bashrc`，然后启动ipython，导入Caffe，异常抛出如下：

```python
In [4]: import caffe

In [5]: QXcbConnection: Could not connect to display
已放弃(吐核)
```
因为服务器上无图像界面服务，所以推测这个错误应该跟这个图像界面的相关，然后谷歌到了[Generating matplotlib graphs without a running X server](http://stackoverflow.com/questions/4931376/generating-matplotlib-graphs-without-a-running-x-server)，在导入Caffe之前，使用Agg backend作为后端渲染，即：

```python
In [2]: import matplotlib as mpl
In [3]: mpl.use('Agg')
In [4]: import caffe
```
异常消除。这个问题比较奇怪，后来小白菜不执行\[2\]\[3\]发觉没出现原来的错误了，不过不管出不出现了，整理以备再次出现此问题。


## 编写cmake文件

顺利完成了**重新编译一份Caffe**的步骤后，我们来写(复制)一份`CMakeLists.txt`文件：

```cmake
cmake_minimum_required(VERSION 2.8.8)
find_package(Caffe)
include_directories(${Caffe_INCLUDE_DIRS})
add_definitions(${Caffe_DEFINITIONS})    # ex. -DCPU_ONLY  
add_executable(caffeinated_application extract_features.cpp)
target_link_libraries(caffeinated_application ${Caffe_LIBRARIES})
```
此份文件来自[Improved CMake scripts](https://github.com/BVLC/caffe/pull/1667)。上面，小白菜要单独编译一份经过修改后的提取特征的文件`extract_features.cpp`，整个目录是这样的：

```sh
├── CMakeLists.txt
└── extract_features.cpp
```

## 编译目标文件

我们进入到包含`CMakeLists.txt`和`extract_features.cpp`文件的目录，执行下面命令：

```sh
mkdir build
cd build
cmake ..
make
```
执行到这一步，得到了我们的最终可执行文件`caffeinated_application`，我们的整个使用makefile编译调用Caffe框架的C++程序的问题已完结。

通过此种方法，我们能够很优雅的解决使用makefile编译调用Caffe框架的C++程序的问题，后面就可以愉快地写各种调用Caffe框架的代码了。

### 附录

1. [如何在Macosx上安装caffe](http://cp0000.github.io/2016/10/22/install-caffe-on-macosx/)