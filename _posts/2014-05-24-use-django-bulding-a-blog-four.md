---
layout: post
title: Django开发简易博客(四)
categories: [Django]
tags: Django
---

这次重新做一个比较强大点的blog系统，前面三节就当是练手。这次的博客系统主要参考[Django Web 开发实战](http://django-web-app-book.wanqingwong.com/djblog/03.1.html)。

virtualenv用来建立一个虚拟的python环境，一个专属于项目的python环境。可以从官网下载后，解压进入目录，运行下面命令（注：所有以后的操作都是在win下进行的）：

```sh
python setup.py install
```
virtualenv安装后，将其添加到环境变量中，即将`;C:\Python27\Scripts`添加到PATH里。打开命令窗，进入要创建项目所在的目录，运行下面命令：

```
virtualenv weblog
cd weblog
cd Scripts
active
pip install django==1.6.5
pip install ipython
```
ipython是一个比python自带的shell要更强大的交互工具，这里安装它主要方便与于django进行交互。进入weblog,可以查看到有些目录：

```sh
cd weblog
dir
2014/05/24  22:03    <DIR>          .
2014/05/24  22:03    <DIR>          ..
2014/04/17  01:14    <DIR>          Include
2014/05/24  21:44    <DIR>          Lib
2014/05/24  22:03    <DIR>          Scripts
2014/05/24  22:03    <DIR>          share
               0 个文件              0 字节
               6 个目录 30,818,910,208 可用字节
```
接着运行下面命令创建project及app：

```sh
python C:\Python27\Scripts\django-admin.py startproject djblog
cd djblog
python C:\Python27\Scripts\django-admin.py startapp blog
```
进入djblog，打开setting.py，添加下面代码：

```python
import os
BASE_DIR = os.path.dirname(os.path.dirname(__file__))
```
继续修改，找到DATABASES，将其修改为下面的样子：

```python
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3', # Add 'postgresql_psycopg2', 'mysql', 'sqlite3' or 'oracle'.
        'NAME': os.path.join(BASE_DIR, 'db.sqlite3'),                      # Or path to database file if using sqlite3.
        'USER': '',                      # Not used with sqlite3.
        'PASSWORD': '',                  # Not used with sqlite3.
        'HOST': '',                      # Set to empty string for localhost. Not used with sqlite3.
        'PORT': '',                      # Set to empty string for default. Not used with sqlite3.
    }
}
```
修改完成后，对数据库进行初始化：

```sh
python manage.py syncdb
```
初次同步需要设置登录后台管理的账号、邮箱、密码，设置完后，会在djblog所在的目录生成一个名为db.sqlite3的数据库。回到setting.py，对言语、时区、静态目录位置、模板文件存放路径进行设置。

```python
# 设置语言
LANGUAGE_CODE = 'zh-cn'
# 时区
TIME_ZONE = 'Asia/Shanghai'
STATIC_URL = '/static/'
# 静态文件目录
STATICFILES_DIRS = (
    os.path.join(BASE_DIR, "static"),
)

# 模版文件目录
TEMPLATE_DIRS = (
    os.path.join(BASE_DIR, "templates"),
)
```
注意，只要文件中出现了中文，需要加上`# -*- coding: utf-8 -*-`避免编码错误。完成上面设置后，回到项目djblog所在目录，建立上面对应的静态目录及模板目录：

```python
mkdir templates static
```
运行上面命令后，会建立templates、static两个目录，再setting.py的INSTALLED_APPS中添加创建了的应用，即blog:

```python
INSTALLED_APPS = (
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.sites',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    # Uncomment the next line to enable the admin:
    # 'django.contrib.admin',
    # Uncomment the next line to enable admin documentation:
    # 'django.contrib.admindocs',
    'blog',
)
```
进入Scripts所在目录，运行下面命令安装south：

```sh
pip install south
```
然后将south添加到setting.py的INSTALLED_APPS中，即：

```python
INSTALLED_APPS = (
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.sites',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    # Uncomment the next line to enable the admin:
    # 'django.contrib.admin',
    # Uncomment the next line to enable admin documentation:
    # 'django.contrib.admindocs',
    'blog',
    'south',
)
```
south可以用于实时更新数据库，也就是启动服务器后，在修改模型时，可以即时同步生效而不用重启服务器。同步数据库：

```sh
python manage.py syncdb
```
可以看到，新建了一个`table south_migrationhistory`数据表，这个表用于记录South操作的。

## 编写数据模型：post

编写`post`模型，使单篇博客包含`标题`、`内容`、`作者`、`发布日期`四类信息。进入blog所在目录，打开`models.py`,添加下面代码：

```python
# -*- coding: utf-8 -*-
from django.db import models

# Create your models here.
from django.contrib.auth.models import User

class Post(models.Model):
    title = models.CharField(u"标题", max_length=128)
    author = models.ForeignKey(User)
    content = models.TextField(u"内容")
    pub_data = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-id"]

    def __unicode__(self):
        return self.title

    @models.permalink
    def get_absolute_url(self):
        return ('post', (), {'pk': self.pk})
```
保存后，在终端输入`python manage.py sql blog`命令后，在终端会出现下面运行结果：

```sh
BEGIN;
CREATE TABLE "blog_post" (
    "id" integer NOT NULL PRIMARY KEY,
    "title" varchar(128) NOT NULL,
    "author_id" integer NOT NULL REFERENCES "auth_user" ("id"),
    "content" text NOT NULL,
    "pub_data" datetime NOT NULL
)
;
COMMIT;
```
