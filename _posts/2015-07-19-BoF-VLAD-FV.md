---
layout: post
title: 图像检索(CBIR)三剑客之BoF、VLAD、FV
categories: [image Retrieval]
---

开始整理这两三年自己在image retrieval的一些资料，方便来年的毕业设计。下面是一份图像检索实验的清单，包含的都是自己实验的结果，随时保持在github上的[image-retrieval](https://github.com/willard-yuan/image-retrieval/blob/master/README.md)同步更新。

### 基于SIFT局部特征的图像检索

基于SIFT局部特征的BOF模型非常适合于做Object retrieval, 下面是自己在[oxford building](http://www.robots.ox.ac.uk/~vgg/data/oxbuildings/)数据库(5063张图片)上进行的一些实验。表格中单词数目为聚类时设定的聚类数目，以及是否采用SIFT或者rootSIFT，rootSIFT怎么计算的可以阅读[Object retrieval with large vocabularies and fast spatial matching](http://www.robots.ox.ac.uk/~vgg/publications/papers/philbin07.pdf)这篇文章，空间校正即在重排的时候，对错配的SIFT点对进行剔除，剔除的方法可以采用RANSAC或者类RANSAC方法，详细介绍可以阅读[SIFT(ASIFT) Matching with RANSAC](http://yongyuan.name/blog/SIFT(ASIFT)-Matching-with-RANSAC.html)，检索精度采用平均检索精度（mean Average Precision, mAP），其计算过程可以阅读[信息检索评价指标](http://yongyuan.name/blog/evaluation-of-information-retrieval.html)这篇文章。下面需要注意的是**查询时间**单次查询的结果，并没有进行多次查询进行平均，此外查询时间是查询和计算mAP时间的总和。

- 单词数目为100k统计的各项指标。单词数目设置为100k，采用rootSIFT，依次对不同重排深度统计其mAP，其中查询时间只是作为一个参考，注意当重排深度为1时，其结果与不重排的mAP是一样的。

<center>
| 单词数目 | SIFT or rootSIFT | 空间校正与否 | 重排数目 | 检索精度mAP | 查询时间(55张)(s) |
| ---------|:----------------:| :-----------:|:--------:|:-----------:|:-----------------:|
|   100k   |    rootSIFT      |      否      |     -    |    62.46%   |       5.429707    |
|   100k   |    rootSIFT      |      是      |    20    |    66.42%   |      20.853832    |
|   100k   |    rootSIFT      |      是      |    30    |    68.25%   |      21.673585    |
|   100k   |    rootSIFT      |      是      |    40    |    69.27%   |      23.300404    |
|   100k   |    rootSIFT      |      是      |    50    |    69.83%   |      23.719468    |
|   100k   |    rootSIFT      |      是      |    100   |    72.48%   |      24.180888    |
|   100k   |    rootSIFT      |      是      |    200   |    75.56%   |      31.165427    |
|   100k   |    rootSIFT      |      是      |    500   |    78.85%   |      46.064313    |
|   100k   |    rootSIFT      |      是      |    1000  |    79.93%   |      70.192928    |
|   100k   |    rootSIFT      |      是      |    2000  |    80.75%   |     110.999173    |
|   100k   |    rootSIFT      |      是      |    3000  |    80.92%   |     145.799017    |
|   100k   |    rootSIFT      |      是      |    4000  |    80.97%   |     176.786657    |
|   100k   |    rootSIFT      |      是      |    5063  |    80.96%   |     207.201570    |
</center>

从上表可以看出，对结果进行重排后，其mAP会得到明显的提高，但并不是说重排深度越深越好，可以看到从重排深度为1000开始，在随着重排深度的增加，其提升得已经非常小了，不仅如此，其耗费的查询时间越来越长。


- 单词数目为500k时统计的各项指标。同样进行如上说明的指标统计，这里单词数目加大为500k。

<center>
| 单词数目 | SIFT or rootSIFT | 空间校正与否 | 重排数目 | 检索精度mAP | 查询时间(55张)(s) |
| ---------|:----------------:| :-----------:|:--------:|:-----------:|:-----------------:|
|   500k   |    rootSIFT      |      否      |     -    |    74.82%   |       5.345534    |
|   500k   |    rootSIFT      |      是      |    20    |    77.77%   |      21.646773    |
|   500k   |    rootSIFT      |      是      |    30    |    79.06%   |      21.615220    |
|   500k   |    rootSIFT      |      是      |    40    |    79.86%   |      23.453462    |
|   500k   |    rootSIFT      |      是      |    50    |    80.54%   |      23.588034    |
|   500k   |    rootSIFT      |      是      |    100   |    82.18%   |      24.942057    |
|   500k   |    rootSIFT      |      是      |    200   |    83.35%   |      30.585792    |
|   500k   |    rootSIFT      |      是      |    500   |    84.89%   |      41.023239    |
|   500k   |    rootSIFT      |      是      |    1000  |    85.52%   |      54.836481    |
|   500k   |    rootSIFT      |      是      |    2000  |    85.73%   |      67.173112    |
|   500k   |    rootSIFT      |      是      |    3000  |    85.77%   |      80.634803    |
|   500k   |    rootSIFT      |      是      |    5063  |    85.76%   |     103.606303    |
</center>

- 单词数目为1M时统计的各项指标。这里我把单词数目设为了1M(已经非常大了)，在聚类阶段，其时间相比于前面的，所用时间更长，在服务器上跑大概用了二十几个小时。

<center>
| 单词数目 | SIFT or rootSIFT | 空间校正与否 | 重排数目 | 检索精度mAP | 查询时间(55张)(s) |
| ---------|:----------------:| :-----------:|:--------:|:-----------:|:-----------------:|
|    1M    |    rootSIFT      |      否      |     -    |    77.64%   |       5.513093    |
|    1M    |    rootSIFT      |      是      |    20    |    80.00%   |      18.864077    |
|    1M    |    rootSIFT      |      是      |    30    |    80.81%   |      18.948402    |
|    1M    |    rootSIFT      |      是      |    40    |    81.44%   |      21.543470    |
|    1M    |    rootSIFT      |      是      |    50    |    82.02%   |      23.290658    |
|    1M    |    rootSIFT      |      是      |    100   |    83.32%   |      25.396074    |
|    1M    |    rootSIFT      |      是      |    200   |    84.47%   |      31.414361    |
|    1M    |    rootSIFT      |      是      |    500   |    85.25%   |      39.314887    |
|    1M    |    rootSIFT      |      是      |    1000  |    85.51%   |      46.913126    |
|    1M    |    rootSIFT      |      是      |    2000  |    85.55%   |      58.102913    |
|    1M    |    rootSIFT      |      是      |    3000  |    85.55%   |      68.756579    |
|    1M    |    rootSIFT      |      是      |    4000  |    85.55%   |      77.051332    |
|    1M    |    rootSIFT      |      是      |    5063  |    85.55%   |      85.428169    |
</center>

可以看到，其进行全部重排的时候的精度，相比于500k的，并没有得到提升，为了更清楚的看到在不同单词数目其对精度的影响，我把三种统计下的结果画成了曲线，如下图示：
![](http://i300.photobucket.com/albums/nn17/willard-yuan/blog/mAP_zps0898loov.jpg)

从上图可以看到，在一定范围内，在相同的重排深度下，单词数目越大，其mAP会越高，注意是在**一定范围内**，当超过了某个范围，其mAP并不会得到明显的提高了，比如500k和1M，从重排深度为500开始，其精度几乎一样了，这告诉我们，并不是说单词数目设得越大越好，我们应该通过实验测试选择出一个合理的单词数目，这样可以避免过量的计算以及存储空间的消耗。同样，在选择重排深度时，也并不是越大越好，我们应该选择那些在平滑转角过渡的重排深度比较合理，这里，比较好的方案是单词数目选择500k，重排深度设置为500。

同样，我也把100k，500k，1M下单词下查询时间做了一张图，需要注意的是，纵轴的时间是对55张查询图像总时间的平均：
![](http://i300.photobucket.com/albums/nn17/willard-yuan/blog/searchTime_zpsndzm24mt.jpg)

上图显示统计的查询时间很怪异，因为随着单词数目的增加，其查询时间应该会越来越长的，但是这里得出的确实越来越短，这里可能的原因是服务器很多人在用，并不满足单一条件在变化的环境，所以所以这里的时间只是作为一个对查询时间的参考，并不能反映理论上的时间变化趋势。

#### MSER

MSER得到椭圆区域后，再结合SIFT，可以剔除掉很多没用的点，VLFeat中的MESR例子见[这里](http://www.vlfeat.org/overview/mser.html)。此外MSER还可以用于文本区域筛选中，具体可以看这个[Robust Text Detection in Natural Scenes and Web Images](http://prir.ustb.edu.cn/TexStar/scene-text-detection/)。概念与作用相关词：漫水填充法、显著性。

#### 基于SIFT特征点匹配

[SIFT on GPU (SiftGPU)](http://ccwu.me/), works for nVidia, ATI and Intel cards.

#### Fisher Vector

<center>
| 单词数目 |     128 to 64    | 检索精度mAP |
| ---------|:----------------:|:-----------:|
|   256    |       是         |    42.70%   |
|   512    |       是         |    52.27%   |
|   1024   |       是         |    56.26%   |
|   2048   |       是         |    58.68%   |
|   4096   |       是         |    62.37%   |
|   8192   |       是         |    65.43%   |
|  10000   |       是         |    66.88%   |
|  20000   |       是         |    69.61%   |
</center>

- Fisher Vector 512个单词，128降维到64，oxford building上mAP为52.27%；L2归一化中如果不采用max的方式，mAP为43.43%。
- Fisher Vector 1024个单词，128降维到64，oxford building上mAP为56.26%；L2归一化中如果不采用max的方式，mAP为47.06%。
