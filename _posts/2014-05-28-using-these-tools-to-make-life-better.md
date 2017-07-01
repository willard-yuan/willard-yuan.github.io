---
layout: post
title: 让生活更美好的OS工具
categories: [资源集合]
tags: 资源
---

本着以使生活更美好的原则，记录一些本小子觉得比较好使的高效工具。

### Goagent

在天朝surf on the internet,这货必备，鉴于配置太过于熟悉了，就不啰嗦了，省1k字。

### wget

不论在win下还是在linux中，此货堪称神器，虽然使用频率不是很高，当一旦在使得着的地方，这货一条命令可以省去不少无谓的折腾。更重要的是，这货轻量。

之前用过这货： 

> Dear Matthijs,  
Recently I have read your paper 'Event retrieval in large video collections with circulant temporal encoding' in CVPR. I'm really interested in it, but I meet some problems when getting the EVVE videos themselves for some of them related to the copyright. I'm a graduate student  of University of Chinese academy of sciences in XI'AN. Can you help me to get the EVVE videos themselves from Youtube?  
I'm really looking forward your reply. Thanks.  
Best Regards,  
Yong Yuan

老外真热心,好感动：

>Hi Yong Yuan,  
You can get the videos from http://pascal.inrialpes.fr/data2/evve/videos/ with eg.  
wget -r http://pascal.inrialpes.fr/data2/evve/videos -I /data2/evve/videos  
Best,  
Matthijs

所以，在win下第一次用wget这货是从这个时候才开始的。今天看见[孟梦](http://www.stat.ucla.edu/~mengmeng/index.html)妹子主页的模板，觉得很academic，而且这一段时间有两个师兄想换主页模板，于是想把妹子的模板借来一用。问[tony](http://peqiu.com/)有木有爬站的好工具，tony说wget。蓦然发觉自己差点把wget这货给忘了，于是接着tony的指点和传过来的wget，运行下面命令：

```sh
wget -r -p -k -np http://www.stat.ucla.edu/~mengmeng/
```
坐等下载完，妹子的模板就被本小子“无耻地”耙过来了，囧。关于wget用法的一些说明，可以参阅有关资料，[楼梯](http://hi.baidu.com/xjtdy888/item/9ec3bbf57672f32d743c4c92)。

先到这里，碎觉。

### 2014/06/08 更新

### Ubuntu 14.04安装wget

在ubuntu下安装wget只需运行下列命令即可：

```sh
sudo apt-get install wget
```
同时，如果要下载单个文件，可以使用下列命令：

```sh
http://waysaboutstuff.com/files/Practical_Computer_Vision_with_SimpleCV.pdf
```