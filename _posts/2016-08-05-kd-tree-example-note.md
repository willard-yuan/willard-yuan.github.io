---
layout: post
title: 机器视觉：使用Dlib库做图像识别
categories: [机器学习]
tags: Dlib
---

接上次集中关注Dlib并写了[机器视觉：使用Dlib库做物体检测](http://yongyuan.name/blog/object-detection-using-dlib.html)，已经过去1年多了。虽然期间时间间隔漫长，但是俺还是一直在持续关注着这个开源库，前一段时间看到Dlib的[新版本19.1](http://dlib.net/)已经集成了深度学习框架，并且自己正好纯属兴趣的想做一下身份证识别方面的东西，所以又在这个库上投入了比较多的时间以及精力。目前基本把Dlib深度学习里的例子过了一遍，下面把自己在使用过程碰到的一些问题以及解决方法做个小总结。

## 图片数据类型

俺比较喜欢用OpenCV去做图像处理，但是Dlib自身并不是使用的OpenCV来存储图片数据的，所以如果想要使用OpenCV读取图片的话，需要在读取图片为`cv::Mat`后将图片数据转化为Dlib的图片数据存储类型，在`dnn_imagenet_train_ex.cpp`中，通过`load_image()`方法来载入图片，并将其保存为`matrix<rgb_pixel>`类型。所以如果通过OpenCV读取图片后，可以通过下面方法将其转化为`matrix<rgb_pixel>`类型：

```cpp
cv::Mat frame = cv::imread("123.jpg");
    
matrix<dlib::rgb_pixel> img;
assign_image(img,cv_image<rgb_pixel>(frame));
```
调用`assign_image()`方法，不仅可以完成类型转化，而且，按照文档里说的，不用对传入的数据进行拷贝，所以虽然在进行数据类型转换，但是耗费的时间比较低。