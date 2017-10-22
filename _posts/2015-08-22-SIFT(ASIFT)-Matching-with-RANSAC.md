---
layout: post
title: 机器视觉：SIFT Matching with RANSAC
categories: [Image Retrieval]
tags: SIFT
---

> 十来天没上来写东西了，在实践试错的过程中，有太多东西没来得及总结，忙着填BoW的坑，忙着投简历(工作碗里来)。尽管这样，还是抽了点空把这十来天自己在完善[Bag of Words cpp实现(stable version 0.01)](http://yongyuan.name/blog/bag-of-words-cpp-implement.html)重排过程中做的一些东西总结一下，希望也能对后来者有些许帮助，好了进入正题。

一般在词袋模型中，为了提高检索的精度，你可以通过很多的trick来提高其精度(mAP)，其中一个广泛使用的技巧就是对返回的图像进行重排，重排有很多种方法，比如对多特征在分数层(决策层)进行融合也是一种重排方式，不过这里要做的是通过剔除查询图像与候选图像错配点对的方式进行重排，剔除错配点一般采用的是RANSAC算法，关于RANSAC原理可以阅读[RANSAC算法做直线拟合](http://yongyuan.name/blog/fitting-line-with-ransac.html)这篇文章，或者采用类RANSAC算法。作为初级阶段的实践，这里从两幅图像的匹配逐步深入。

**代码下载**：下面贴图的结果的代码都可以[sift(asift)-match-with-ransac-cpp](https://github.com/willard-yuan/opencv-practical-code/tree/master/sift(asift)-match-with-ransac-cpp)下载。

## 1NN匹配

“1NN匹配”（勿wiki，自创的一个词汇），讲起来比较顺口，而且从字面也应该可以猜测出点意思来，所以就这么写在这里了。所谓的“1NN”匹配，即是对于图像im1中的某个SIFT特征点point1，通过在im2图像上所有SIFT关键点查找到与point1最近的SIFT关键点，重复这个过程，即可得到图像im1中所有的特征点在im2中的匹配点(最近邻，1NN)。这种匹配方法，会出现很多的错配点，下面是采用1NN匹配的结果：
![1NN匹配](http://ose5hybez.bkt.clouddn.com/2015/0822/1NN_zpszjqtqy6i.JPG)
从上图可以看到，1NN匹配的方法出现了很多的错配点，而这些错配点对无论是对图像检索中的重排，还是图像拼接等，都是不希望看到的，所以得进一步对其中的错配点对进行剔除，下面采用“1NN/2NN<0.8”的方法进行错配点对剔除。

## 1NN/2NN<0.8

"1NN/2NN<0.8"，不要诧异你未见过这样一种说法，没错，自己瞎创的一种表述。对上面1NN方法理解了，这个水到渠成。所谓“1NN/2NN<0.8”，即对于图像im1中的某个SIFT特征点point1，通过在im2图像上所有SIFT关键点查找到与point1最近的SIFT关键点point21(记该关键点point21到point1的距离为dis1)和次近的关键点point22(记该关键点point22到point1的距离为dis2)，如果dis1/dis2<0.8，则我们将其视为正确匹配的点对，否则则为错配的点对予以剔除。这种寻找匹配的方法，由Lowe在其Distinctive image features from scale-invariant keypoints中有说明，当然，0.8这个阈值是可以调整的，不过一般都采用0.8。下面是采用该方法进行匹配后的结果：
![](http://ose5hybez.bkt.clouddn.com/2015/0822/1NN2NN_zpsajn0qktz.JPG)
可以看到，经过该方法匹配后，相比与“1NN”匹配方法，相比于“1NN”，这种方法进行匹配时有了很大的改善，不过正配点相比与1NN有部分损失。下面再探讨用RANSAC方法对这两种情况进行错配点剔除。

## 1NN+RANSAC

回到前面的“1NN”匹配的点对，我们再采用RANSAC方法对其进行错配点剔除，RANSAC方法的原理前面已有相关文章[RANSAC算法做直线拟合](http://yongyuan.name/blog/fitting-line-with-ransac.html)，这里不再重复，相关的代码请看`utils.cpp`中`findInliers`函数，调用的是OpenCV中的`cv::findFundamentalMat`函数计算其变换矩阵，下面是“1NN”经过RANSAC剔除错配点对的结果：
![1NN+RANSAC](http://ose5hybez.bkt.clouddn.com/2015/0822/1NNRANSAC_zpsnngsyxmb.JPG)
可以看到，经过RANSAC后，“1NN”中的很多错配点对差不多剔除得比较好了，不过还有错配的点对没有剔除掉，图中用红色矩形框标出了未剔除的错配点对。我们在来看看对“1NN/2NN<0.8”进行RANSAC后会是怎样的结果呢？

## 1NN/2NN<0.8+RANSAC

在看匹配结果前，我们可以先做一个大概的预测，因为“1NN/2NN<0.8”得到的很多点就是正确匹配的点对，所以将其放入RANSAC中后，能够得到很好的拟合模型，所以其剔除错配点对效果也应该更好。为了验证这一预测，我们看一下“1NN/2NN<0.8+RANSAC”具体的效果，如下图所示：
![1NN/2NN<0.8+RANSAC](http://ose5hybez.bkt.clouddn.com/2015/0822/1NN2NNRANSAC_zpsuwe317az.JPG)
可以看到，已经完全没有错配点了，从这一点来说，其效果是非常好的。不过，从正配点对数目来看，“1NN+RANSAC”的结果更密集，也就是说“1NN+RANSAC”包含了更多的正配点对，“1NN/2NN<0.8+RANSAC”正配点对要稍微少些。在大多数情况下，我们会选择完全剔除了错配点对的模型。

由于VLFeat的SIFT实现要比OpenCV里的实现要好，所以又采用VLFeat的[covdet](http://www.vlfeat.org/overview/covdet.html)对SIFT的匹配做了一些实现，并为covdet提供了c++接口，下面是做完几何校正后的一些匹配结果：

![](http://ose5hybez.bkt.clouddn.com/github/covdet/brand.png)

![drawing](http://ose5hybez.bkt.clouddn.com/github/covdet/wine.png)

## 总结

上面分别介绍了两种匹配方法，分别是“1NN”和“1NN/2NN<0.8”匹配方法，以及对它们采用RANSAC剔除错配点对的方法。有时候，如果要求经过RANSAC匹配后保留更多的正配点对，这时候，我们可以采用Affine-SIFT，简称ASIFT，具体可以阅读[ASIFT: An Algorithm for Fully Affine Invariant Comparison](http://www.ipol.im/pub/art/2011/my-asift/)这篇文章，作者提供了ASIFT的C++代码和匹配算法，可以在[ASIFT]((http://www.ipol.im/pub/art/2011/my-asift/))下载得到，我大概跑了一下里面的demo，相比与SIFT，ASIFT可以提取到很多的关键点，对旋转等变换具有更好的不变性，不过缺点也很明显，速度实在太慢，很难做到实时，所以要使用的话，一般应用在对实时性不做要求的场合。我那个代码里有OpenCV的实现，你也可以试一下其效果，该OpenCV代码实现来源于[OPENCV ASIFT C++ IMPLEMENTATION](http://www.mattsheckells.com/opencv-asift-c-implementation/)，OpenCV自带其Python实现，使用比较方便，就是速度太慢，所以自己在图像检索在写的项目中，也不打算用它了。
