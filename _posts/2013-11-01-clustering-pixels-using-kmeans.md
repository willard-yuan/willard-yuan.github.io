---
layout: post
title: 机器视觉：用K-Means进行图像分割
categories: [Computer Vision]
tags: 机器学习
---

在K-Means Using Python中，给出了一个用K-Means聚类的tutorial，这次将K-Means用在具体图像像素聚类中，需要说明的是除了在很简单的图像上，单纯在像素值上应用K-Means给出的结果是毫无意义的。要产生有意义的结果，需要更多复杂的类模型或空间一致性而不是平均像素色彩。这里，我们仅仅在RGB三通道像素值上运用K-Means，关于图像分割问题会在后面的学习过程中将给出一些笔记与示例。

这里，我们对两幅简单的图像利用K-Means进行像素聚类。下面代码先载入图像，然后用一个 100×100 的窗口在图像中滑动，在RGB三通道上，分别求窗口所在位置中窗口包含像素值的平均值作为特征，对这些特征利用K-Means进行聚类，然后对向量量化，关于向量量化的解释及理解，可以参与[1,2]，下面是完整的对一幅简单的图像利用K-Means进行像素聚类的完整code:

```python
"""Function: Illustrate Clustering Pixels Using K-Means
Date: 2013-11-01"""
from scipy.cluster.vq import *
from scipy.misc import imresize
from pylab import *
import Image
steps = 100 # image is divided in steps*steps region
infile = 'D:\NutStore\Project\Translation\PCV\pcv_data\data\empire.jpg'
im = array(Image.open(infile))
dx = im.shape[0] / steps
dy = im.shape[1] / steps
# compute color features for each region
features = []
for x in range(steps):
    for y in range(steps):
        R = mean(im[x * dx:(x + 1) * dx, y * dy:(y + 1) * dy, 0])
        G = mean(im[x * dx:(x + 1) * dx, y * dy:(y + 1) * dy, 1])
        B = mean(im[x * dx:(x + 1) * dx, y * dy:(y + 1) * dy, 2])
        features.append([R, G, B])
features = array(features, 'f') # make into array
# cluster
centroids, variance = kmeans(features, 3)
code, distance = vq(features, centroids)
# create image with cluster labels
codeim = code.reshape(steps, steps)
codeim = imresize(codeim, im.shape[:2], 'nearest')
figure()
ax1 = subplot(121)
ax1.set_title('Image')
axis('off')
imshow(im)
ax2 = subplot(122)
ax2.set_title('Image after clustering')
axis('off')
imshow(codeim)
show()
```

上面两层for循环实现的就是窗口滑动时，窗口中三通道像素的平均值，并将求得的三个通道上的平均值作为feature，后面的过程就是K-Means Using Python中详解的内容，这里不再赘述。下面是像素聚类结果：

![](http://ose5hybez.bkt.clouddn.com/2013/1101/images_kmeans.jpg)

再次需要强调的是利用像素聚类的方法只能对一些简单的图像进行分割，对于复杂点的图像，我们可以采用图割的方法，后面会对这方面进行一些分析。

参考：  
[1] http://www.data-compression.com/vq.shtml  
[2] http://blog.csdn.net/zouxy09/article/details/9153255