---
layout: post
title: Django配置MySQL
categories: [Django]
tags: Django
---

最近想和Tony用Django开发某个app，在MySQL这部分本小子碰到了些安装方面的问题。虽然此前在用wp时也接触到了MySQL，不过这次算是一次近距离的接触。这里记录下本小子在安装方面碰到的一些问题和发现的几个很有用的知识，算是对初次近距离接触MySQL的一个记录吧。

要在django里使用MySQL(Pyhon标准库自带SQLite)，必须得安装MySQL和MySQL-Python这两个软件包，MySQL是实实在在的数据库，而MySQL-Python则是MySQL Python接口（这样理解有没有错？）。刚开始时，我以为就像OpenCV Python接口一样，只要安装了MySQL Python便可以使用MySQL了，结果运行某个app时，出现下面错误：
![]({{ site.url }}/public/images/posts/MySQL-error01.png)
提示无法连接到MySQL服务器，然后问了一下Tony，Tony说还得安装MySQL。好吧，原来不能像OpenCV Python接口一样类比。去六维下了MySQL 5.6绿化版，启动MySQL时需要进入在MySQL的bin目录下，按网上资料在命令窗运行下面命令：

```sh
net start mysql
```
出现"服务名无效,请键入net helpmsg 2185 以获得更多帮助"错误，又只得放狗了，发现一篇[《关于命令行启动mysql时服务名无效的解决方法》](http://www.cnblogs.com/fanrenke/archive/2013/04/14/3020668.html)的博文，按照博文的操作，终于开启了MySQL服务。进入app所在目录，运行：

```sh
python manage.py runserver
```
![]({{ site.url }}/public/images/posts/2014-05-07 21_18_47-.png)
提示缺少32位动态链接库，本小子用的是win64位系统，而且安装的MySQL也是64位了，怎么会出现这样的错误，重装了两遍依然出现相同错误。不经意瞧了一下[MySQL-Python](http://www.codegood.com/archives/129)下方的说明：
>The choice of 32bit and 64bit depends on the version of python you have installed in your computer and not in the operating system or the server you want to access. So if you have the 32 bit python 2.7 installed on your 64 bit Windows, you will download and install the 32 bit version. - See more at: http://www.codegood.com/archives/129#sthash.HTET8CPb.dpuf。

神了，原来**Python是没有系统平台位数区分的**，也就是你64位系统也可以使用32位Python，结合上面给出的缺少32位动态链接库提示，大概猜出了问题可能就出在这个地方。调出Python shell,运行下面命令查看自己安装的Python用的是多少位：

```python
import struct
struct.calcsize("P")
```
运行后给出:

```text
4
```
**根据资料说明，4表明所用Python版为32位的，如果是其他数字，则是64位的。原来本小子安装的Python版是32位的，本小子还一直以为是64位的**。
找到根源后，问题就很容易解决了，下个MySQL-Python 32位的版本，然后重新开启MySQL服务，在开启django服务，OK。
