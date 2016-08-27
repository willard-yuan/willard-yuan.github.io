---
layout: post
title: 机器视觉：使用Dlib库做物体检测
categories: [Machine Learning]
tags: Dlib
---

>D-lib：A toolkit for making real world machine learning and data analysis applications in C++。

官网地址为：http://dlib.net/，跨平台。

---

## 下载D-lib

D-lib库原来托管在[sourceforge](http://sourceforge.net/projects/dclib/files/latest/download)上，关于本库的讨论可以见这里[Discussion](http://sourceforge.net/p/dclib/discussion/)。最近作者也在github上托管了一份[dlib](https://github.com/davisking/dlib)。

## 配置D-lib

D-lib不需要依赖别的库。在VS2008中配置，只需要把d-lib-xx.xx添加到包含文件中：

![vs2008-dlib]({{ site.url }}/images/posts/vs2008-dlib.jpg)

## 编译自带实例

D-lib自带了很多很好且非常实用的例子，要运行D-lib的例子，安装cmake，然后安装：

```sh
cd dlib/test
mkdir build
cd build
cmake ..
cmake --build . --config Release
./dtest --runall
```

进行单元测试。

编译D-lib自带的例子

```sh
cd examples
mkdir build
cd build
cmake ..
cmake --build . --config Release
```

在build目录下，找到Reasese目录，进入所在目录，可以看到生成的exe可执行文件。官网[编译说明](http://dlib.net/compile.html)。

## OS X配置

转到了OS X下，所以对OS X下安装配置做一些补充。在**Dlib**的github的issue里发现别人遇到了类似的问题，所以自己尝试着回答了一下，主要把自己配置以及使用的过程说明了一下，这里不单独再列出来了，安装过程中记得先安装XQuartz后在编译，具体详细的细节可以参考我的回答[Can't run example code in Xcode using webcam_face_pose_ex.cpp?](https://github.com/davisking/dlib/issues/57)。

***注意***：在Xcode中使用**dlib**时，记得把**X11**，如下面所示：

![](http://i300.photobucket.com/albums/nn17/willard-yuan/x11_zpsvho1a1p8.png)

Dlib-19.1编译的时候，在安装了XQuartz的前提下，仍然报与X11的错误，具体如下：

```sh
make[2]: *** [dlib_build/CMakeFiles/dlib.dir/gui_widgets/fonts.cpp.o] Error 1
make[1]: *** [dlib_build/CMakeFiles/dlib.dir/all] Error 2
make: *** [all] Error 2
error: cmake build failed!
```
完全删除XQuartz(如何完全删除XQuartz可以参考这个[传送门](https://gist.github.com/tonymtz/714e73ccb79e21c4fc9c))，重新安装仍然出现此问题，遂将编译器改为llvm，具体编译命令为：

```sh
cd examples
mkdir build
cd build
cmake -G Xcode ..
cmake --build . --config Release
```
编译成功。


## 检测物体

D-lib自带了人脸检测器，如果要检测别的物体，先要训练出对应的检测器。

### 对训练数据集图像进行标注

D-lib自带了图像标注工作，对应在tools目录下，非常的好用。在使用该工具前，先用cmake对原代码进行编译：

```sh
cd dclib/tools/imglab
mkdir build
cd build
cmake ..
cmake --build . --config Release
```

生成exe可执行文件，然后分下面步骤进行标注。

- 生成XML文件，在该文件中会将训练图片文件名包含在里面

```sh
Win: imglab -c mydataset.xml C:\Users\willard\Desktop\images

Linux: ./imglab -c mydataset.xml /tmp/images
```

- 标注图像

```sh
Win: imglab C:\Users\willard\Desktop\images\mydataset.xml
Linux: ./imglab mydataset.xml
```

运行上面命令后，会弹出下面标注对话框:

![imlab-example]({{ site.url }}/images/posts/imlab-example.jpg)

一旦标注完成，点击菜单保存即可。你还可以通过下面的命令：

```sh
imglab mydataset.xml
```

进行验证。完成标注后，我们可以用例子中的train_object_detector.exe训练检测器：

```sh
train_object_detector.exe –tv C:\Users\willard\Desktop\images\mydataset.xml
```

迭代收敛后，可以看到检测器在训练集本身的presicion、recall、average presicion是多少。同时在imglab.exe目录下，会生成object_detector.svm检测模板。模板训练好后，同样可以使用train_object_detector.exe对图片物体进行检测了：

```sh
train_object_detector.exe （路径+）图片
```

### 修改源码进行物体检测

D-lib自带的例子很多都是通过paser通过shell传递参数的，这样做在使用时确实很方便，不过我们有时我们希望直接在程序中传递参数。具体怎么修改，这里不列出，主要讲一下需要注意的地方。

### 载入图片

D-lib中的例子train_object_dectector用debug编译方式编译后，然后去检测图片，会报“。。。JPEG and PNG files”的错误，这里在编译的时候，如果我们要检测的图片是jpg格式的话，我们需要把libjpeg里面的文件全部加入到所建的项目里面，另外在源码的最前面，要定义`define DLIB_JPEG_SUPPORT`，同时在source.cpp里面，在`#ifdef DLIB_JPEG_SUPPORT`的前面加上`#define DLIB_JPEG_SUPPORT`，这样程序就可以准确运行了。不过这种方式有一个弊端，程序在编译的时候，添加进来的libjpeg也要重新编译，使得编译时间比较长。

### 使用opencv载入图片

D-lib支持Opencv，所以可以将D-lib和OpenCV结合起来使用。D-lib对OpenCV的支持是2.1以后的版本的，所以如果使用的是2.1以后的版本的话，不需要对D-lib下OpenCV所在的文件夹下的文件进行修改了。如果使用的是2.1（比如我现在使用的是OpenCV2.1），需要把文件夹下各个文件中包含的OpenCV头文件注释掉，即：

```sh
//Dlib dafault
//#include <opencv2/core/core.hpp>
//#include <opencv2/core/types_c.h>
```

并将OpenCV2.1的头文件包含进来，代码如下：

```sh
// OpenCV 2.1.0
#include<cv.h>
#include<cvaux.h>
#include<highgui.h>
#include<cxcore.h>
```

修改完后，在载入图片的时候，便不再需要依赖D-lib的libjpeg载入图片功能了，这样在每次建立新项目的时候不再需要将libjpeg里面的文件全部加入到所建的项目里面。只需将all文件夹下的source.cpp添加到项目里去即可。

## 程序加速

在fhog_object_detector_ex.cpp中有注释说明“Note that this program executes fastest when compiled with at least SSE2 instructions enabled.  So if you are using a PC with an Intel or AMD chip then you should enable at least SSE2 instructions.”，如果没注意到这点，你自己单独编译而不是用cmake编译出来的可执行文件exe，那么你在执行程序时，程序极可能执行的速度比较慢，无论你是选用debug版还是release版。

实际上，在用cmake编译的时候，dlib文件夹下cmake文件里有设置SSE2开启了。所以如果我们要提高在VS2008里面编译出来的程序的执行效率，我们要在VS2008编译的时候做开始SSE2的设置。详细设置如下：

![vs2008-sse2]({{ site.url }}/images/posts/vs2008-sse2.jpg)

启用增强指令集中的SSE2即可加速程序的执行效率。
