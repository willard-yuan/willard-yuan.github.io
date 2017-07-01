---
layout: post
title: 机器视觉：用OpenCV提取图像SIFT、SURF描述子
categories: [Machine Learning]
tags: OpenCV, SIFT
---

## SIFT描述子

今天群里有童鞋问说在导入OpenCV模块提取Sif描述子出错，本小子便在shell里弄了个简单的Sift特征提取演示小程序，很简单。发觉用OpenCV里Sift模块提取Sift描述子要比在[图像局部描述符](http://yuanyong.org/pcvwithpython/chapter2.html)中用VLfeat容易多了。

自备楼梯：Rachel-Zhang一文[SIFT特征提取分析](http://blog.csdn.net/abcjennifer/article/details/7639681)

```python
# -*- coding: utf-8 -*-
import cv2
from pylab import *

img = cv2.imread('F:/dropbox/Dropbox/translation/pcv-notebook/data/alcatraz1.jpg')
img_RGB= cv2.cvtColor(img,cv2.COLOR_BGR2RGB)
# img_Gray= cv2.cvtColor(img,cv2.COLOR_BGR2GRAY)

siftDetector=cv2.SIFT()
kp = siftDetector.detect(img_RGB,None)
kp,des = siftDetector.compute(img_RGB,kp)
# 关键点列表
print type(kp),len(kp)
# des是一个大小为关键点数目*128的数组
print type(des),des.shape
im=cv2.drawKeypoints(img_RGB,kp,flags=cv2.DRAW_MATCHES_FLAGS_DRAW_RICH_KEYPOINTS)

#用pylab的imshow()显示
figure()
gray()
subplot(111)
axis('off')
imshow(im)

#用Opencv管理窗口显示
#cv2.imshow('Sift detect',im);
#cv2.waitKey(0)
#cv2.destroyAllWindows()

show()
```

上面验证了kp和des的大小，正如OpenCV [Introduction to SIFT](http://docs.opencv.org/trunk/doc/py_tutorials/py_feature2d/py_sift_intro/py_sift_intro.html)所说的：

> Here kp will be a list of keypoints and des is a numpy array of shape Number_of_keypoints*128.

运行上面代码，对Sift描述子进行可视化
![]({{ site.url }}/public/images/posts/opencv-sift.png)

## SURF描述子

具体原理松子茶一文[SURF特征提取分析](http://blog.csdn.net/abcjennifer/article/details/7639681)讲得还比较清晰，就不重复造轮子了。

```python
# -*- coding: utf-8 -*-
import cv2
from pylab import *

img = cv2.imread('F:/dropbox/Dropbox/translation/pcv-notebook/data/alcatraz1.jpg')

#OpenCV读取的图像默认通道为BRG
img_RGB= cv2.cvtColor(img,cv2.COLOR_BGR2RGB)

surfObj=cv2.SURF()
surfObj.hessianThreshold = 20000

#上面等价于
#surfObj=cv2.SURF(20000)

kp = surfObj.detect(img_RGB,None)
print "kp is a %s, the length of kp is %s"%(type(kp),len(kp))
kp,des = surfObj.compute(img_RGB,kp)

#可以将上面检测和计算合并在一起完成
#kp, des = surf.detectAndCompute(img_RGB,None)

img2 = cv2.drawKeypoints(img_RGB,kp,None,(255,0,255),4)

imshow(img2)
show()
```

运行上面代码，对SURF描述子进行可视化
![]({{ site.url }}/public/images/posts/opencv-surf.png)

## 查看OpenCV版本
要查看OpenCV版本号，可以在Python Shell里输入下面命令：

```python
from cv2 import __version__
__version__
```

Reference:  
[1]. [Introduction to SIFT (Scale-Invariant Feature Transform)](http://docs.opencv.org/trunk/doc/py_tutorials/py_feature2d/py_sift_intro/py_sift_intro.html)  
[2]. [Introduction to SURF](http://docs.opencv.org/trunk/doc/py_tutorials/py_feature2d/py_surf_intro/py_surf_intro.html)



