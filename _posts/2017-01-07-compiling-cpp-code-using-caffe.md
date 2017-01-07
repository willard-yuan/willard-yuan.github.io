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

