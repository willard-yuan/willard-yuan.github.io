---
layout: post
title: 环境配置：Mac下安装OpenCV3.0和Anaconda
categories: [Python]
tags: OpenCV
---

入手Mac几天了，想在Mac OS下玩玩OpenCV和keras，间歇捣鼓了两天，终于搞定zsh、OpenCV3.0以及Anaconda。OpenCV3.0刚发布不久，这方面的资料也不是很多，能够查到的一篇配置OpenCV3.0和Python2.7.x的博客[Install OpenCV 3.0 and Python 2.7+ on OSX](https://www.pyimagesearch.com/2015/06/15/install-opencv-3-0-and-python-2-7-on-osx/)，讲得很细致，我读完一遍后觉得配置得有些繁琐，并且没有Anaconda，所以自己花时间琢磨了两天，记录一下配置过程，方便自己和小伙伴们查阅。

## 为什么一定要用Anaconda

Anaconda是一个Python第三方模块合集，里面包含了很多常用的模块，并且它里面还自带了Python，所以安装好它后面可以省很多安装模块的麻烦。以前我在没有接触到Anaconda前用的都是Python(x,y)，但发觉那个包更新太慢，而且好像没有Linux和Mac的，所以弃用Python(x,y)改用Anaconda。

## Anaconda安装
Anaconda安装非常的简单，下载好对应的Mac版本，点击安装就可以了，关于Anaconda的安装过程中需要注意的可以查阅Anaconda的Mac安装说明[Mac Install](http://docs.continuum.io/anaconda/install.html)，有一点需要特别注意的是：
![](http://docs.continuum.io/_images/pathoption.png)
从上图可以看到Anaconda是默认将Anaconda环境变量添加到你的`bash_profile`中的，为了使得在shell中可以使用Anaconda的Python（一般Anaconda中的Python2.7.x是比较新的），这个不要去掉勾就行了，也就是一路默认就行，不过你要清楚有这么一个添加环境变量的过程在里面。

安装好Anaconda后，打开bash shell，输入`python`看输出的版本信息，我输出的版本信息如下：

```sh
ython 2.7.9 |Anaconda 2.2.0 (x86_64)| (default, Dec 15 2014, 10:37:34)
[GCC 4.2.1 (Apple Inc. build 5577)] on darwin
Type "help", "copyright", "credits" or "license" for more information.
Anaconda is brought to you by Continuum Analytics.
Please check out: http://continuum.io/thanks and https://binstar.org
```

可以看到使用的是Anaconda中自带的Python，而且版本号是2.7.9。Anaconda安装好后，我们可以看看`bash_profile`中Anaconda在里面添加的环境变量：

```sh
# added by Anaconda 2.2.0 installer
export PATH="/Users/wilard/anaconda/bin:$PATH"
```

我们可以把上面稍微修改一下，改成下面的内容：

```sh
 # added by Anaconda 2.2.0 installer
export PATH="$HOME/anaconda/bin:/usr/bin:/bin:/usr/sbin:/sbin:/usr/local/bin    :$PATH"
```

修改完后，运行`source ~/.bash_profile`刷新一下即可。

如果你用的shell是zsh，比如我现在用的就是zsh，你只要把上面那段`.bash_profile`中Anaconda的环境变量复制到`.zshrc`中即可，如果`.zshrc`文件不存在，建立一个就是了，这样如果你将shell由bash shell切换到zsh shell时，用的Pythony也是Anacanda的了。

## 安装OpenCV3.0
OpenCV3.0采用Homebrew安装非常的简单，直接执行下面命令：

```sh
brew install opencv3.0
```

如果没有OpenCV3.0的话，它会提示你执行一个什么包含`tap`字眼的命令，你就按照它给的提示执行来就行，下载按照比较慢，这时你可以去喝杯茶。安装好后，在最后它会提示你如果想要Python也能调用OpenCV接口的话，需要执行下面命令：If you need Python to find bindings for this keg-only formula, run:

```sh
echo /usr/local/opt/opencv3/lib/python2.7/site-packages >> /usr/local/lib/python2.7/site-packages/opencv3.pth
```

`echo`打印输出，`>>`重定向，执行完这句，可以在`/usr/local/lib/python2.7/site-packages/`目录下得到一个文件`opencv3.pth`。但是我们来看看它所放置的目录，这个目录是系统自带的Python目录，而我们使用的Anaconda里的Python，所以你需要将其重定向输出的路径改到Anaconda中Python目录下，比如我的：

```python
echo /usr/local/opt/opencv3/lib/python2.7/site-packages >> /Users/willard/anaconda/lib/python2.7/site-packages/opencv3.pth
```

执行完上面命令，打开shell，验证一下OpenCV的版本是不是3.0:

```sh
➜  ~  python
Python 2.7.9 |Anaconda 2.2.0 (x86_64)| (default, Dec 15 2014, 10:37:34)
[GCC 4.2.1 (Apple Inc. build 5577)] on darwin
Type "help", "copyright", "credits" or "license" for more information.
Anaconda is brought to you by Continuum Analytics.
Please check out: http://continuum.io/thanks and https://binstar.org
>>> import cv2
>>> cv2.__version__
'3.0.0'
```

可以看到确实是OpenCV3.0版本，你还可以参照[Install OpenCV 3.0 and Python 2.7+ on OSX](https://www.pyimagesearch.com/2015/06/15/install-opencv-3-0-and-python-2-7-on-osx/)最后给出的一个提取AKAZE特征的例子进行测试。

另外，如果你不想用Anaconda的Python，你可以通过Homebrew安装最新的2.7.x版本：

```sh
brew install python
```

安装完后，记得注释掉`.bash_profile`和`.zshrc`中Anaconda的环境变量，自此，便可以在各个不同的Python版本间自由穿梭了。

关于OpenCV3.0在Xcode中的调用我可能会在后面博文中给出，就酱紫。
