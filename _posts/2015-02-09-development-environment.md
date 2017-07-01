---
layout: post
title: 环境配置：环境配置问题汇总
categories: [开发环境]
tags: 开发环境
---

安装scipy时出现：`numpy.distutils.system_info.NotFoundError: no lapack/blas resources found`，[具体解决方法](http://stackoverflow.com/questions/7496547/does-python-scipy-need-blas)按stackoverflow上得来。先通过`sudo apt-get install gfortran libopenblas-dev liblapack-dev`安装依赖库，然后直接pip安装scipy即可。

查看8080端口被哪个占用命令：`netstat -pnl | grep 8080`，具体可以参看这里[I get this: IOError: Port 8080 not bound on 'localhost'. What could it be?](http://stackoverflow.com/questions/767575/cherrypy-hello-world-error)

在centos上安装scipy安装包时，直接通过pip install如果报错的话，用`sudo yum install numpy scipy python-matplotlib ipython python-pandas sympy python-nose`尝试，具体可以参考这里：[Installing the SciPy Stack](http://www.scipy.org/install.html)