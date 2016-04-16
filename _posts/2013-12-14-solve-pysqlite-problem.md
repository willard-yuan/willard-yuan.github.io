---
layout: post
title: 初涉Pysqlite遇到的问题
categories: [Python]
tags: Python
---

近日在翻译[《Programming Computer Vision with Python》](http://programmingcomputervision.com/)第7章图像搜索时，代码中用到了pysqlite模块，因为自己一直也是做图像搜索这一块的，所以用把Demo按书上交代的一步一步的实现。在pysqlite这一步折腾了大半天也没把pysqlite安装好，气馁之时又仔细阅读了Google搜来的文档，发觉自Python2.5版本后，pysqlite已经成为了Python的标准库了，所以，就不在需要另外安装了，直接import就可以了。

stackoverflow上已有人回答了关于这方面的问题：

>The module is called sqlite3. pysqlite2 was the module's name before it became part of the Python standard library.

>You probably want to use this in your code:</br>
	import sqlite3</br>
And the standard documentation is here: http://docs.python.org/library/sqlite3.html

>edit: And just to cover all the bases:</br>
The sqlite3 module also has a dbapi2 sub-member, but you don't need to use it directly. The sqlite3 module exposes all the dbapi2 members directly.

上面给出的答案就是说，Pysqlite2是它在未成为Python标准库前的名字，成为Python标准库后名字就改成了sqlite3了，Pysqlite了，直接“import sqlite3”就可以了。另外Sqlite3包含dbapi2的子成员，所以就不必：

```python
from pysqlite2 import dbapi2 as sqlite
```

Sqlite3将dbapi2成员直接exposes(翻译不好>_<)出来了，所以在import sqlite3之后的话，就可以直接调用里面的方法了，不过在调用的时候需要注意的是，模块对象是sqlite3,比如查看sqlite版本信息：

```python
sqlite3.version
```

当然你也可以再导入sqlite3模块时对要导入的模块取一个简单的名字，比如：

```python
import sqlite3 as sqlite
```python

相应地，在调用方法时，就可以是sqlite+调用的方法了，比如上面查看sqlite3的版本信息，则可以写为：

```python
sqlite.version
```

关于sqlite3还有很多方面的知识需要了解学习，这里算是初涉sqlite吧，下篇会总结一点Python轻量级HTTP框架[CherryPy](http://www.cherrypy.org/)方面的知识。
