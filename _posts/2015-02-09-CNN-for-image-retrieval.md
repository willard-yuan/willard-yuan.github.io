---
layout: post
title: CNN for image retrieval
categories: [image retrieval]
---

## 背景

对于CBIR的背景以及应用，直接上两张图上来，分别对于下面的图1和图2:
![background]({{ site.url }}/images/posts/2015-02-09/background.png)
图1
图1的背景是自己用matlab在cifar10上生成的背景图，前景图是来自[How many public photos are uploaded to Flickr every day, month, year?](https://www.flickr.com/photos/franckmichel/6855169886/)对flick每月到每年上传图片的统计，可以看到随着互联网和移动设备的普及，我们正进入了一个全民造图的时代。针对这些海量的图片，要自动的对它们进行分类、识别、检索等，是一件充满挑战的事情，而这方面的应用在我们的生活中，最常见的莫过于图片搜索引擎。下图是在四个搜索图片搜索引擎下上传一张“熊猫”图片搜索的结果。
![background1]({{ site.url }}/images/posts/2015-02-09/background1.png)
其中三个个图片搜索引擎搜索出来的图片前面都是“熊猫”这一类，表现最差的是搜狗，找不到匹配的图片，在识别这一块，搜狗还没推出这一功能，百度识别出来的是“北京犬”，360识别出来的是“抗菌肽”，识别与360，百度的结果稍微好一些，因为“北京犬”在毛色以及在形状上有可能会和“熊猫”相似，识别最好的是谷歌，搜索引擎这一块，谷歌无疑是世界遥遥的领先者。另外百度前一段时间推出的百度识图是个不错的流量入口，通过搜索出来的相似图片与对应的店铺联系起来，从而创造商业价值。

## 卷积神经网络CNN

待续

![Caltech1-70]({{ site.url }}/images/posts/2015-02-09/Caltech1-70.png)

![Caltech1-70-example]({{ site.url }}/images/posts/2015-02-09/Caltech1-70-example.png)

![Caltech71-101]({{ site.url }}/images/posts/2015-02-09/Caltech71-101.png)

![Caltech71-140-example]({{ site.url }}/images/posts/2015-02-09/Caltech71-140-example.png)

![Caltech141-210]({{ site.url }}/images/posts/2015-02-09/Caltech141-210.png)

![Caltech141-210-example]({{ site.url }}/images/posts/2015-02-09/Caltech141-210-example.png)

![Caltech141-210-example1]({{ site.url }}/images/posts/2015-02-09/Caltech141-210-example1.png)

![random]({{ site.url }}/images/posts/2015-02-09/random.png)
![river]({{ site.url }}/images/posts/2015-02-09/river.png)
![lion]({{ site.url }}/images/posts/2015-02-09/lion.png)
![tiger]({{ site.url }}/images/posts/2015-02-09/tiger.png)

安装scipy时出现：`numpy.distutils.system_info.NotFoundError: no lapack/blas resources found`，[具体解决方法](http://stackoverflow.com/questions/7496547/does-python-scipy-need-blas)按stackoverflow上得来。先通过`sudo apt-get install gfortran libopenblas-dev liblapack-dev`安装依赖库，然后直接pip安装scipy即可。

查看8080端口被哪个占用命令：`netstat -pnl | grep 8080`，具体可以参看这里[I get this: IOError: Port 8080 not bound on 'localhost'. What could it be?](http://stackoverflow.com/questions/767575/cherrypy-hello-world-error)

在centos上安装scipy安装包时，直接通过pip install如果报错的话，用`sudo yum install numpy scipy python-matplotlib ipython python-pandas sympy python-nose`尝试，具体可以参考这里：[Installing the SciPy Stack](http://www.scipy.org/install.html)


