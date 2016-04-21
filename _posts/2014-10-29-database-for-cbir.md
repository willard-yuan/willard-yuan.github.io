---
layout: post
title: 图像检索：常用图像库整理
categories: [Image Retrieval]
tags: 图像检索
---

>此篇博文里的大部分内容来源于我在知乎上对[**做图像检索，图像库从哪儿能下载到？**](https://www.zhihu.com/question/25039851)问题的回答。

这个问题对于每个刚做图像检索的人都会碰到，我刚开始CBIR的时候也是谷歌图像库漫天搜，后来随着论文读得多了，接触到的图像库也渐渐多了。回到正题，目前做CBIR用得比较多且流行的有下面几个:

- [**MNIST手写数字图像库**](http://yann.lecun.com/exdb/mnist/), Yann LeCun, Corinna Cortes and Chris Burges，这个库有共70,000张图片，每张图片的大小是28*28，共包含10类从数字0到9的手写字符图像，在图像检索里一般是直接使用它的灰度像素作为特征，特征维度为784维。

- [**CIFAR-10 and CIFAR-100 datasets**](http://www.cs.toronto.edu/~kriz/cifar.html)，这个数据库包含10类图像，每类6k，图像分辨率是32*32。另外还有一个CIFAR-100。如果嫌CIFAR-100小，还有一个更大的Tiny Images Dataset，上面CIFAR-10和CIFAR-100都是从这个库里筛选出来的，这个库有80M图片。

- [**Caltech101**](http://www.vision.caltech.edu/Image_Datasets/Caltech101/)和[**Caltech256**](http://www.vision.caltech.edu/Image_Datasets/Caltech256/)，从后面的数据可以看出它们分别有多少类了。虽然这两个库用于做图像分类用得很多，不过也非常适合做CBIR，前面给的两个数据库由于图像大小尺寸较小，在检索可视化的时候显示的效果不是很好。所以我比较推荐用Caltech256和Caltech101，Caltech256有接近30k的图片，用这个发发论文完全是没什么问题的。如果要做几百万的实际应用，那得另寻数据库。

- [**INRIA Holidays**](http://lear.inrialpes.fr/people/jegou/data.php#holidays)，也是一个在做CBIR时用的很多的数据库，图像检索的论文里很多都会用这个数据库。该数据集是Herve Jegou研究所经常度假时拍的图片（风景为主），一共1491张图，500张query（一张图一个group）和对应着991张相关图像，已提取了128维的SIFT点4455091个，visual dictionaries来自Flickr60K，[链接](http://lear.inrialpes.fr/~jegou/data.php)。

![](http://i300.photobucket.com/albums/nn17/willard-yuan/blog/INRIA-Holidays_zpsef2lrwoe.jpg)

- [**Oxford Buildings Dataset**](http://www.robots.ox.ac.uk/~vgg/data/oxbuildings/)，5k Dataset images，有5062张图片，是牛津大学VGG小组公布的，在基于词汇树做检索的论文里面，这个数据库出现的频率极高，[下载链接](https://link.zhihu.com/?target=http%3A//www.robots.ox.ac.uk/%7Evgg/data/oxbuildings/)。

![](http://i300.photobucket.com/albums/nn17/willard-yuan/blog/Oxford%20Buildings_zpslow1f56k.jpg)

- [**Oxford Paris**](http://www.robots.ox.ac.uk/~vgg/data/parisbuildings/)，The Paris Dataset，oxford的VGG组从Flickr搜集了6412张巴黎旅游图片，包括Eiffel Tower等。

![](http://i300.photobucket.com/albums/nn17/willard-yuan/blog/Oxford-Paris_zpsbo8rjzux.jpg)

- [**201Books and CTurin180**](http://pacific.tilab.com/www/datasets/)，The CTurin180 and 201Books Data Sets，2011.5，Telecom Italia提供于Compact Descriptors for Visual Search，该数据集包括：Nokia E7拍摄的201本书的封面图片（多视角拍摄，各6张），共1.3GB； Turin市180个建筑的视频图像，拍摄的camera有Galaxy S、iPhone 3、Canon A410、Canon S5 IS，共2.7GB。

![](http://i300.photobucket.com/albums/nn17/willard-yuan/blog/201Books-CTurin180_zpszobkezdb.jpg)

- **Stanford Mobile Visual Search**，Stanford Mobile Visual Search Dataset，2011.2，stanford提供，包括8种场景，如CD封面、油画等，每组相关图片都是采自不同相机（手机），所有场景共500张图，[链接](https://purl.stanford.edu/rb470rw0983)；随后又发布了一个[patch数据集](https://link.zhihu.com/?target=http%3A//blackhole1.stanford.edu/ivms/Datasets.htm)，Compact Descriptors for Visual Search Patches Dataset，校对了相同patch。

![](http://i300.photobucket.com/albums/nn17/willard-yuan/blog/Stanford-Mobile_zpscktap7us.jpg)

- **UKBench，UKBench database**，2006.7，Henrik Stewénius在他CVPR06文章中提供的数据集，图像都为640*480，每个group有4张图，文件接近2GB，提供visual words，[链接](http://www.vis.uky.edu/~stewe/ukbench/)。

![](http://i300.photobucket.com/albums/nn17/willard-yuan/blog/UKBench.jpg_zpsxavgwhhl.png)

- **MIR-FLICKR**，MIR-FLICKR-1M，2010，1M张Flickr上的图片，也提供25K子集下载，[链接](http://press.liacs.nl/mirflickr/mirflickr1m/)。

![](http://i300.photobucket.com/albums/nn17/willard-yuan/blog/MIR-FLICKR_zpsqqmqwqdt.jpg)

此外，还有COREL，NUS-WIDE等。一般做图像检索验证算法，前面给出的四个数据库应该是足够了的。

- [**ImageCLEFmed医学图像数据库**](http://ir.ohsu.edu/image/)，见[Online Multiple Kernel Similarity Learning for Visual Search](http://omks.stevenhoi.org/)。这个Project page里，有5个图像库，分别是Indoor、Caltech256、Corel (5000)、ImageCLEF (Med)、Oxford Buildings，在主页上不仅可以下到图像库，而且作者还提供了已经提取好的特征。

- **哈希检索常用数据库**，如下图：

![hashing-database-for-CBIR]({{ site.url }}/images/posts/hashing-database-for-CBIR.png)

（上表有Foolishwolf整理，[Hashing函数paper所用的数据集统计](http://blog.csdn.net/foolishwolf_x/article/details/38678969)）





