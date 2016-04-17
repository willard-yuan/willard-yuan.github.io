---
layout: post
title: 环境配置：Mac下OpenCV3.0和OpenCV2.x自由切换
categories: [Python]
tags: Python
---

## 背景

在[Mac下安装OpenCV3.0和Anaconda][1]一文中已经总结了OpenCV3.0在Mac下的安装方法，但在实际使用的时候，发觉OpenCV3.0跟OpenCV2.x差别还是比较大的，比如在[BoW图像检索Python实战][2]中原本写的程序根本没法在OpenCV3.0下跑，想SIFT、SURF都移到了[opencv\_contrib][3]。将SIFT、SUFR移出OpenCV的原因在[opencv\_contrib][4]中说明如下：

> This repository is intended for development of so-called "extra" modules, contributed functionality. New modules quite often do not have stable API, and they are not well-tested. Thus, they shouldn't be released as a part of official OpenCV distribution, since the library maintains binary compatibility, and tries to provide decent performance and stability.

> So, all the new modules should be developed separately, and published in the opencv\_contrib repository at first. Later, when the module matures and gains popularity, it is moved to the central OpenCV repository, and the development team provides production quality support for this module.

总之就是这些模块还不是很稳定，需要不断的测试和修改，OpenCV中的SIFT效果确实还不尽如人意。所以，在OpenCV3.0中要使用SIFT、SURF等特征你需要额外的按照[opencv\_contrib][5]。

> The opencv\_contrib  repo which contains extra modules for OpenCV, such as feature detection, local invariant descriptors (SIFT, SURF, etc.), text detection in natural images, line descriptors, and more.

> **Note**: We don’t have to pull down the opencv\_contrib  repo if we don’t want to. OpenCV will compile and install just fine without it. But if you compile OpenCV without opencv\_contrib , be warned that you’ll be missing out on some pretty important features, which will become very obvious, very fast, especially if you’re used to working with the 2.4.X version of OpenCV.                    摘自[Install OpenCV 3.0 and Python 2.7+ on OSX][6]

怎么按照这个模块，目前还没找到比较好的简洁的方法。不过这篇文章不是要将这个，还是回到上面提到的问题中。为了使用OpenCV2.x版本，自然需要安装OpenCV2.x版本了，也就是安装完后，你的计算机上有两个版本的OpenCV，下面先讲讲怎么安装OpenCV2.x。

## 安装OpenCV2.x
OpenCV2.x的安装跟OpenCV3.0的安装一下，同样用Homebrew安装，网上流传的关于Homebrew是Mac OS缺失的管理包一点也不为过。执行下面命令几个完成Opencv2.x的安装：

```sh
brew install opencv
```

在安装OpenCV3.0的时候，用的命令是`brew install Opencv3`，在这里安装的时候，我停留了一下在想这样安装下来的OpenCV版本是不是1.x的版本的，按照完后面测试查看时发现按照的应该是OpenCV2.x的最后一个最新的版本。

执行上面命令进行安装后，看到有sucessful这样的字眼后，说明安装成功，不过要在Python中调用OpenCV的接口，还需要做下面要的一些工作。

## 在OpenCV2.x和OpenCV3.0间版本自由切换
上面安装了OpenCV2.x后，要让Python调用OpenCV2.x的接口，只需执行下面命令即可：

```sh
echo /usr/local/opt/opencv/lib/python2.7/site-packages >> /Users/willard/anaconda/lib/python2.7/site-packages/homebrew.pth # choose opencv2
```

这条命令跟安装OpenCV3.0时为了使Python也能调用OpenCV3.0所使用的命令极像。执行完上面命令后，会在`/Users/willard/anaconda/lib/python2.7/site-packages/`目录下生成`homebrew.pth`文件，用cat命令查看homebrew文件中的内容其实就是`/usr/local/opt/opencv/lib/python2.7/site-packages`，`echo`是打印输出命令，`>>`重定向。现在便可以在Python中调用OpenCV2.x了，我们可以对其进行验证：

```sh
➜  ~  python
Python 2.7.9 |Anaconda 2.2.0 (x86\_64)| (default, Dec 15 2014, 10:37:34)
[GCC 4.2.1 (Apple Inc. build 5577)] on darwin
Type "help", "copyright", "credits" or "license" for more information.
Anaconda is brought to you by Continuum Analytics.
Please check out: http://continuum.io/thanks and https://binstar.org
> > > import cv2
> > > cv2.__version__
'2.4.11'
```

可以看到，目前我使用的OpenCV版本是2.4.11版本的。好了，现在既然OpenCV2.x可以用了，那如果我们想用OpenCV3.0版本怎么办？这个就更简单了，直接把上面在`/Users/willard/anaconda/lib/python2.7/site-packages/`生成的`homebrew.pth`删掉就行，删掉后再在Pyton中调用OpenCV时，调用的就是OpenCV3.0的接口了。

从上面可以看出，`/Users/willard/anaconda/lib/python2.7/site-packages/`目录下`opencv3.pth`的作用会被`homebrew.pth`的作用进行覆盖，所以想要在OpenCV2.x与OpenCV3.0间切换，其实就是就简单的做一下`homebrew.pth`的删增就OK。

就这样，以上。

[1]:	http://yongyuan.name/blog/install-opencv3-and-anaconda-in-mac-os.html
[2]:	http://yongyuan.name/blog/practical-BoW-for-image-retrieval-with-python.html
[3]:	https://github.com/itseez/opencv_contrib
[4]:	https://github.com/itseez/opencv_contrib
[5]:	https://github.com/itseez/opencv_contrib
[6]:	https://www.pyimagesearch.com/2015/06/15/install-opencv-3-0-and-python-2-7-on-osx/
