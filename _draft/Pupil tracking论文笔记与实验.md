## Pupil tracking论文笔记与实验总结

从加入到一个做眼控的团队后更是将每晚的时间和精力投入在这方面了。期间陆陆续续读了一些关于Pupil tracking类的文章，做了一些pupil tracking的实验，下面是自己对其中一些有意思的论文和自己做的实验笔记，也算是对近期工作做的一个总结。

Accurate eye centre localisation by means of gradients

这篇文章是对eye做的tracking，总体的思路是这样的：先用一个boosted cascade人脸检测器（Viola and Jones, 2004）进行人脸检测，在检测到人脸的基础上，通过检测到的人脸区域提取眼睛的大致区域（基于先验知识，这个稍后说明），后面在提取的眼睛区域中再进行眼睛中心定位，全文重点都落在这里。我们先把这个放一下，那个还没说的“先验知识”上。

首先说一下人眼中心定位的两种方式，一种是“远距离”方式，这种远距离指的是人眼跟摄像头的距离比较远，一般是将摄像头固定在计算机屏幕上或者调用笔记本内置的摄像头（如图1所示）；另一种是将摄像头通过眼睛框固定在离眼睛不远的地方（如图2所示）。相比于第一种方式，第二种方式不论是对pupil tracking还是iris recognition，更易于处理以及获得更高的精度，而且一般摄像头采用的多是红外相机。

![](https://www.cl.cam.ac.uk/research/rainbow/projects/eyetab/images/teaser.jpg)
图1

![](http://www.cl.cam.ac.uk/~ls426/images/my_tracker_200px.jpg)
图2

针对“远距离”的人眼中心定位，基本都会使用检测人脸或者检测眼眶的方法去提取眼睛区域，比如上图1显示的定位方式是先用训练的haar模板检测眼眶(如图1中的小图所示)，然后将其对半便得到左右区域。