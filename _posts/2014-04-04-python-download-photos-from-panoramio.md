---
layout: post
title: Python根据经纬度获取地理位置照片
categories: [Python]
tags: Python
---

从3月中旬文章投出去，转眼便到了四月。在实验室里的日子，时间总是流逝得毫无察觉。每天上班、吃饭、睡觉，偶尔抬头看看天空，才知道一个星期又过去了。这一段时间，只要一有空余时间，便在调试代码，完善[《Python计算机视觉编程》](http://yuanyong.org/pcvwithpython/)主页的建设，所以写作的时间也转移到那边去了。今天在调试那本书第二章的代码时，发觉书中有一个很好玩的东东，这货通过调用Google Panoramio API根据经纬度可以获取地理位置照片。本小子觉得还挺有意思的，比如你可以设置经纬度下载不同地方的照片。另外，比如你想做个图像检索的数据库，也利用该脚本可以下载同一地区不同方位的照片。

下面是摘自[WIKI](http://zh.wikipedia.org/wiki/Panoramio)关于Panoramio的介绍：
>Panoramio是一个分享基于地理位置的摄影分享的网站。上传并标注了地理位置的照片，会从每月的月底开始展示在Google地球和Google地图上。Panoramio的宗旨是让Google地球的用户凭借观看其他用户的摄影对特定的区域了解更多。目前，网站已支持多种语言。
>
>用户上传的照片，都可以通过网站内置的功能实现地理定位，从而能在收录后展示与Google地球和Google地图相应的地理位置中。
Panoramio要求用户使用标签（元数据的一种形式）来组织相片，这样搜索者可以通过某个特定的关键词，例如地名或题材，来找到相应的作品。Panoramio也是较早采用标签云的网站。目前，上传的摄影作品以约每20天增加100万的数字增长。[9]用户还可以创建或加入群组，并将自己的作品也添加进群组内。

本小子也给自己开了一个[Panoramio](https://ssl.panoramio.com/user/8239013)玩玩，以后估计会把自己游玩时拍的照片传上去。好了，下面来看看怎样调用Panoramio API下载上面的图片，直接上代码了：

```python
# -*- coding: utf-8 -*-
import json
import os
import urllib
import urlparse

#change the longitude and latitude here
#here is the longitude and latitude for Oriental Pearl
minx = '-77.037564'
maxx = '-77.035564'
miny = '38.896662'
maxy = '38.898662'

#number of photos
numfrom = '0'
numto = '20'
url = 'http://www.panoramio.com/map/get_panoramas.php?order=popularity&set=public&from=' + numfrom + '&to=' + numto + '&minx=' + minx + '&miny=' + miny + '&maxx=' + maxx + '&maxy=' + maxy + '&size=medium'

#this is the url configured for downloading whitehouse photos. Uncomment this, run and see.
#url = 'http://www.panoramio.com/map/get_panoramas.php?order=popularity&set=public&from=0&to=20&minx=-77.037564&miny=38.896662&maxx=-77.035564&maxy=38.898662&size=medium'

c = urllib.urlopen(url)

j = json.loads(c.read())
imurls = []
for im in j['photos']:
    imurls.append(im['photo_file_url'])

for url in imurls:
    image = urllib.URLopener()
    image.retrieve(url, os.path.basename(urlparse.urlparse(url).path))
    print 'downloading:', url
```

上面代码中，坐标(x,y)为地理位置的经纬度，`minx`、`maxy`、`miny`、`maxy`构成矩形区域，也就是地理坐标范围。`numto`是设定的下载照片数，这里下载20张照片。在[Python Vlfeat接口及Pydot模块安装总结](http://yuanyong.org/blog/pyhton-vlfeat-pydot-tips.html)中可视化相连图像时出现的图片即是从Panoramio上下载的白宫照片。

