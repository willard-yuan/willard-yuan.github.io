---
layout: post
title: 环境配置：Ubuntu开发环境配置
categories: [资源集合]
tags: 资源整理
---

### 安装tree

`tree`命令用来以列表的形式展示目录层次。Ubuntu下安装tree可以通过下面命令：

```sh
sudo apt-get install tree
```

关于tree命令的使用，可以参阅[在线文档](http://www.computerhope.com/unix/tree.htm)，最常见的命令可能如下：

```sh
willard@willard-PC~/python/web $ tree weblog -L 2
weblog
├── bin
│   ├── activate
│   ├── activate.csh
│   ├── activate.fish
│   ├── activate_this.py
│   ├── easy_install
│   ├── easy_install-2.7
│   ├── pip
│   ├── pip2
│   ├── pip2.7
│   ├── python
│   ├── python2 -> python
│   └── python2.7 -> python
├── include
│   └── python2.7 -> /usr/include/python2.7
├── lib
│   └── python2.7
└── local
    ├── bin -> /home/willard/python/web/weblog/bin
    ├── include -> /home/willard/python/web/weblog/include
    └── lib -> /home/willard/python/web/weblog/lib
```

上面L表示遍历层数，“2”表示树有两层。此外，这里也有关于tree的一些说明，[楼梯](http://liunian.info/ubuntu%E4%B9%8Btree%E5%91%BD%E4%BB%A4.html)

### 安装pip和virtualenv

`pip`是python的包管理工具，有建议说Python的包都用pip进行管理，`virtualenv`是 Python 多版本管理的利器，不同版本的开发调试全靠它，可以通过下面命令安装pip和virtualenv。

```sh
## 安装pip
sudo apt-get install python-pip
## 安装virtualenv
sudo apt-get install virtualenv
```

### 安装git

`git`是目前最主流的版本控制管理工具，可以通过下面命令安装：

```sh
sudo apt-get install git
```

关于git的使用，在[Ubuntu下git使用教程](http://yuanyong.org/blog/the-trick-of-using-git.html)中有详细介绍。

### 安装SimpleCV

[SimpleCV](https://github.com/sightmachine/SimpleCV)是一个计算机视觉库，目前在github上很活跃。根据文档说明，可以通过下面命令安装该库：

```sh
sudo apt-get install ipython python-opencv python-scipy python-numpy python-pygame python-setuptools git
git clone https://github.com/sightmachine/SimpleCV.git
cd SimpleCV/
sudo pip install -r requirements.txt
sudo python setup.py install
```

上面第一条命令安装Python第三方模块，包括ipython,opencv,scipy,numpy,pygame,setuptools和git,第二条命令从远程仓库克隆rep,然后安装依赖关系，打开看了一下`requirements.txt`要安装的依赖关系：

```text
numpy
scipy
PIL
ipython
svgwrite
pygame==1.9.1release
```

在运行第三条命令的时候，出现下面错误：

```text
willard@willard-PC~/python/cv/SimpleCV $ sudo pip install -r requirements.txt
Requirement already satisfied (use --upgrade to upgrade): numpy in /usr/lib/python2.7/dist-packages (from -r requirements.txt (line 1))
Requirement already satisfied (use --upgrade to upgrade): scipy in /usr/lib/python2.7/dist-packages (from -r requirements.txt (line 2))
Downloading/unpacking PIL (from -r requirements.txt (line 3))
  Could not find any downloads that satisfy the requirement PIL (from -r requirements.txt (line 3))
  Some externally hosted files were ignored (use --allow-external PIL to allow).
Cleaning up...
No distributions at all found for PIL (from -r requirements.txt (line 3))
Storing debug log for failure in /home/willard/.pip/pip.log
```

暂时还不知道是什么原因，先到这里，睡觉了。

### 2014/04/08 更新

没想到昨天在SimpleCV Rep开了个issue很快得到了回答，本小子将问题反馈过去，@sksavant给出的回答是：

>Use 'pip install -r requirements.txt --allow-all-external --allow-unverified PIL'

本小子试了一下，发觉还是不行，然后按照给出的错误提示，运行`sudo pip install -r requirements.txt --allow-unverified PIL`，安装成功。

Reference:

1:[在Ubuntu下配置舒服的Python开发环境](http://xiaocong.github.io/blog/2013/06/18/customize-python-dev-environment-on-ubuntu/)