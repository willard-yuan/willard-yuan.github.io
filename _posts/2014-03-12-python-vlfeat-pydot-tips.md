---
layout: post
title: 环境配置：Python Vlfeat接口及Pydot模块安装总结
categories: [Machine Learning]
tags: 机器学习
---

最近在调试[《Programming Computer Vision with Python》](http://yuanyong.org/zh-pcvwithpy/)第三章中的sift描述符及相连图像进行可视化的代码时，折腾耗费了不少时间，现在对整个调试过程中遇到的一些问题及解决方案做下记录总结。

其实此前在翻译阶段调试[Clustering Pixels Using K-Means](http://yuanyong.org/blog/clustering-pixels-using-kmeans.html)和[K-Means Using Python](http://yuanyong.org/blog/kmeans-using-python.html)折腾过一段时间的Python sift代码，不过调试了很久，一直都没成功，放了一段时间，今天终于搞好了。虽然解决的方案不算完美，不过看到跑出来的结果，本小子中午兴奋得一中午都处于亢奋状态。sift调好了，后面很多代码就都可以跑出结果了。

##Vlfeat接口之sift

回归正题，先记录一下sift的调试过程。sift能调试成功，很大程度上得益于本书作者的一篇博文[《Another Python Interface for SIFT》](http://www.janeriksolem.net/2011/06/another-python-interface-for-sift.html)。本小子用的是他的更新版本，也就是vlfeat版，老版本的实现在他的另一篇博文[《SIFT Python Implementation》](http://www.janeriksolem.net/2009/02/sift-python-implementation.html)中。两者差异主要体现在代码的前段部分。
[sift.py](http://www.maths.lth.se/matematiklth/personal/solem/downloads/sift.py)前段部分如下：

{% highlight python %}
def process_image(imagename, resultname):
    """process an image and save the results in a .key ascii file"""

    #check if linux or windows
    if os.name == "posix":
        cmmd = "./sift <"+imagename+">"+resultname
    else:
        cmmd = "siftWin32 <"+imagename+">"+resultname

    os.system(cmmd)
    print 'processed', imagename
{% endhighlight %}

[vlfeat.py](http://www.maths.lth.se/matematiklth/personal/solem/downloads/vlfeat.py)的前段部分如下：

```python
def process_image(imagename,resultname,params="--edge-thresh 10
                  --peak-thresh 5"):
	""" process an image and save the results in a file"""

	if imagename[-3:] != 'pgm':
		#create a pgm file
		im = Image.open(imagename).convert('L')
		im.save('tmp.pgm')
		imagename = 'tmp.pgm'

	cmmd = str("sift "+imagename+" --output="+resultname+
				" "+params)
	os.system(cmmd)
	print 'processed', imagename, 'to', resultname
```

两者调用的都是lowe大人的sift，都用到了`os.system()`调用外部可执行文件。此前在调试的时候，也知道要将sift所在的目录添加到环境变量中，可是添加完后在命令窗口输入`sift`弹出的是这样一个窗口(围脖床图肿么了，挂了？上传老半天都传不上去！)：

![2014-03-12-sift-install]({{ site.url }}/images/posts/2014-03-12-sift-install.png)

而准确的应该是这样的：

![2014-03-12-sift]({{ site.url }}/images/posts/2014-03-12-sift.png)

明显是环境变量没添加好，可是本小子添加确实添加好了啊。捣鼓了半天，还是不知道环境变量添加出现了什么问题。只能试试采用绝对路径了。询问好基友Tony，没想到这货跟我想到一块儿去了，真是中国好基友。于是本小子上面的路径改成绝对路径`cmmd = str("D:\mltools\vlfeatwin32\sift.exe "+imagename+" --output="+resultname+" "+params)`。改后运行示例代码，帅，跑通了。虽然采用绝对路径的方案使代码看起来并不美观，不过好歹让代码跑通了。后面将查阅一些关于python调用外部可执行文件配置环境变量方面的资料，把这货搞明白。上一张利用sift特征进行图像匹配的实验效果图：

![2014-03-12-ch02_sift_match_sf_view12]({{ site.url }}/images/posts/2014-03-12-ch02_sift_match_sf_view12.png)

图像的sift描述子效果如下:

![2014-03-12-ch02_fig2-4_sift_true]({{ site.url }}/images/posts/2014-03-12-ch02_fig2-4_sift_true.png)
关于sift的说明就记录到这里吧。

## Pydot模块

再说说在调试相连图像进行可视化时遇到的问题。本小子之前安装过Pydot模块，然后在程序中导入Pydot模块后运行代码，跑到一半蹦出来个`GraphViz's executables not found`的错误，崩溃。放狗一搜，原来要对相连图像进行可视化，要用到[GraphViz](http://www.graphviz.org/)。讲到这，不得不顺带提一下[AT&T](http://www.research.att.com/software_tools?fbid=WTw8egB6QOJ),牛x的实验室啊，GraphViz就是这个实验室开发出来的。下载完GraphViz后安装，添加进环境变量后运行，我靠，又蹦出来个错误`Couldn't import dot_parser, loading of dot files will be possible.`，崩溃。泪崩啊，继续放狗，发觉Pydot依赖于这两个包：[GraphViz](http://www.graphviz.org/)和[pyparsing](http://pyparsing.wikispaces.com/),可是从官网下载下来安装后，再安装Pydot模块`python setup.py install`还是提示上面那个错误。本小子不甘心就这么放弃，找啊找，在CSDN找到了这篇文章[《Python包的安装和使用》](http://blog.csnd.net.tjhd1989/article/details/8954062)。似乎Pydot对高版本的支持还有些问题，下载博文里的安装包，安装Pydot时会有提醒:

![2014-03-12-sift-install-poblem]({{ site.url }}/images/posts/2014-03-12-sift-install-poblem.png)

本小子忽略了它，运行代码，这货终于可以一路跑到底了，本小子乐翻了，感谢tjhd1989博主。上张相连图像可视化的效果图，晒晒折腾出来的成果。

![2014-03-12-whitehouse]({{ site.url }}/images/posts/2014-03-12-whitehouse.png)

Over，继续调试后面的代码。