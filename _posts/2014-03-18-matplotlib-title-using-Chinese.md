---
layout: post
title: Python title()中文标题支持
categories: [Python]
tags: Python
---

晚上调试[《Programming Computer Vision with Python》](http://yuanyong.org/pcvwithpython/)中的代码时，对于图显示的标题，一直都是用英文标识的。Matplotlib这货默认不支持中文，上星期在`title()`中用中文标识时，蹦出一黑黑的屏和一堆错误，当时本小子正忙着折腾别的，由于标题部分不长，不影响美观，就直接用英文把问题给绕开了。

绕过去的弯，总是要换还的。晚上看着图上英文标识的一长串英文，几乎每个英文标题都快超出了subplot的宽度。对于一个排版重度患者，看着真心捉急。于是，放狗一搜，竟然很快就找到答案了，也不知道上次肿么了，搜半天找到的全是要修改matplotlibrc配置文件。对于一个要分享给别人测试实验的代码，要别人在他的PC上修改配置文件，总不是一件明智的选择，况且这本书里的一些配置已经很麻烦了。

根据搜到的答案，完全可以不用修改配置文件，而直接在python脚本的开头加上下面的代码：

```python
from matplotlib.font_manager import FontProperties
font = FontProperties(fname=r"c:\windows\fonts\SimSun.ttc", size=14)
```
上面从`matplotlib.font_manager`字体管理模块代入`FontProperties`,然后设置字体属性，`FontProperties()`设置的是Windows系统自带的宋体。关于Windows字体列表，可以查阅WIKI [Windows字体列表](http://zh.wikipedia.org/wiki/Microsoft_Windows%E5%AD%97%E9%AB%94%E5%88%97%E8%A1%A8)，`size`设置的是字体的大小。对于上面Matplotlib绘图中文显示，举个今晚调试好了的例子，本例也可以参见[《Python计算机视觉编程》](http://yuanyong.org/pcvwithpython/)的第一章[图像处理基础](http://yuanyong.org/pcvwithpython/chapter1.html):

```python
# -*- coding: utf-8 -*-
from PIL import Image
from pylab import *

# 添加中文字体支持
from matplotlib.font_manager import FontProperties
font = FontProperties(fname=r"c:\windows\fonts\SimSun.ttc", size=14)
figure()

pil_im = Image.open('../data/empire.jpg')
gray()
subplot(121)
title(u'原图',fontproperties=font)
axis('off')
imshow(pil_im)

pil_im = Image.open('../data/empire.jpg').convert('L')
subplot(122)
title(u'灰度图',fontproperties=font)
axis('off')
imshow(pil_im)

show()
```
上面代码`title()`中，字体属性`fontproperties=font`,即开头已经设置好了的字体属性，需要注意的是中文标识前有个字母**u**,这个不能少，否则会出错。秀一下上面代码运行的结果：

![2014-03-18-ch01_P002-003_PIL]({{ site.url }}/public/images/posts/2014-03-18-ch01_P002-003_PIL.png)

时间不早了，睡觉。

Reference：

[1]. [python中matplotlib绘图中文显示问题](http://blog.chinaunix.net/uid-26611383-id-3521248.html)
