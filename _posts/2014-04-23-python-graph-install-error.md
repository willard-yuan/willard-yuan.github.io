---
layout: post
title: 环境配置：Python graph安装出错
categories: [Python]
tags: Python
---

今天安装Python graph时不论在实验室的电脑上还是在自己的电脑上，都报出下面错误：

```sh
D:\mltools\python-graph-core-1.8.2>python setup.py install
Traceback (most recent call last):
  File "setup.py", line 7, in <module>
    from setuptools import setup, find_packages
  File "C:\Python27\lib\site-packages\setuptools\__init__.py", line 11, in <modu
le>
    from setuptools.extension import Extension
  File "C:\Python27\lib\site-packages\setuptools\extension.py", line 5, in <modu
le>
    from setuptools.dist import _get_unpatched
  File "C:\Python27\lib\site-packages\setuptools\dist.py", line 12, in <module>
    from setuptools.compat import numeric_types, basestring
  File "C:\Python27\lib\site-packages\setuptools\compat.py", line 19, in <module
>
    from SimpleHTTPServer import SimpleHTTPRequestHandler
  File "C:\Python27\lib\SimpleHTTPServer.py", line 27, in <module>
    class SimpleHTTPRequestHandler(BaseHTTPServer.BaseHTTPRequestHandler):
  File "C:\Python27\lib\SimpleHTTPServer.py", line 208, in SimpleHTTPRequestHand
ler
    mimetypes.init() # try to read system mime.types
  File "C:\Python27\lib\mimetypes.py", line 358, in init
    db.read_windows_registry()
  File "C:\Python27\lib\mimetypes.py", line 258, in read_windows_registry
    for subkeyname in enum_types(hkcr):
  File "C:\Python27\lib\mimetypes.py", line 249, in enum_types
    ctype = ctype.encode(default_encoding) # omit in 3.x!
UnicodeDecodeError: 'ascii' codec can't decode byte 0xb0 in position 1: ordinal
not in range(128)
```

查了一下资料（答案链接[1](http://blog.csdn.net/hugleecool/article/details/17996993)和[2](http://my.oschina.net/u/993130/blog/199127)），原因如下:  

> 原因与注册表有关，可能与某些国产软件对注册表的改写的gbk格式导致python无法进行第三方库的安装操作。

按答案链接的解决方案，果然可以了，thinks.


