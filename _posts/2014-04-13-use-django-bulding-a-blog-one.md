---
layout: post
title: Django开发简易博客(一)
categories: [Django]
tags: Django
---

看了好长一段时间的Python和Djanggo框架，毫无水涨船高之势。借着周末的时间，开始实战练习。计划通过搭建一个完整的博客系统，将学的离散的Python、Django、HTML、CSS、Bootstrap知识串起来。好了，回归正题，开始开发之旅吧。

## 安装Django
从[Django主页](https://www.djangoproject.com/download/)下载最新版本，解压，从命令窗口进入到Django所在的目录，安装Django

```sh
python setup.py install
```
执行上面命令后，可以在IDLE中测试Django是否成功

```sh
>>> import django
>>> django.VERSION
(1, 5, 5, 'final', 0)
```
上面显示安装的Django版本为1.5。安装好后即可进行后面的步骤

## 创建项目
在命令窗中进入所要放置的项目目录，比如本小子要在D盘Python_web下创建项目

```sh
cd python_web
python C:\Python27\Scripts\django-admin.py startproject appblog
cd appblog
python manage.py runserver
```
注：上面`python C:\Python27\Scripts\django-admin.py startproject appblog`中有资料显示不需要指明django-admin的路径，在本小子的机子上报错，可能是环境变量没配好。
开启Django服务器后，在浏览器中输入[127.0.0.1:8000](http://127.0.0.1:8000/)便可看到下面的页面
![](http://images.cnitblog.com/blog/502877/201310/02215534-89f4062b01ca40e5bad5314f0e375782.jpg)
说明Django服务器正常工作。现在来看一下创建项目后目录文件夹都有哪些东西
>     appblog ---manage.py
>
>             ---appblog
>                 ---_init_.py
>                 ---_init_.pyc
>                 ---settings.py
>                 ---settings.pyc
>                 ---urls.py
>                 ---urls.pyc
>                 ---wsgi.py
>                 ---wsgi.pyc

```text
manage.py ：一种命令行工具，可让你以多种方式与该 Django 项目进行交互。可以输入python manage.py help看看。
 __init__.py ：让 Python 把该目录当成一个开发包 (即一组模块)所需的文件。 这是一个空文件，一般你不需要修改它。
settings.py ：该 Django 项目的设置或配置。配置你的django project。
urls.py：django项目的URL设置。URLS映射到views函数。
```
上面是Django开发一个web站点都会具有的目录结构，下面将在该project下创建blog应用。在命令行下输入：

```sh
python C:\Python27\Scripts\django-admin.py startapp blog
```
更新：Django1.8.0 aipha为：

```sh
python C:\Python27\Scripts\django-admin-script.py startapp blog
```
执行上面命令后，会在appblog下生成blog应用目录，整个项目下完整的目录为：
> appblog ---manage.py
>
>            ---appblog
>            ---_init_.py
>            ---_init_.pyc
>            ---settings.py
>            ---settings.pyc
>            ---urls.py
>            ---urls.pyc
>            ---wsgi.py
>            ---wsgi.pyc
>            ---blog
>                 ---models.py
>                 ---tests.py
>                 ---views.py
>                 ---__init__.py

blog下生成的即为Django的MTV模型，对应的三个文件分别为：

```text
models.py: 用来定义你blog model 的文件
views.py: 用来定义view函数
tests.py: 对你的开发来说，是很好的东西，今天的教程不涉及
```
在创建的项目settings.py中，有一个元组叫INSTALLED_APPS，该元组用来告诉django都有什么app在创建的项目里。由于我们创建的blog app在该项目中，所以我们需要将其添加到INSTALLED_APPS元组中，即将'blog'字符串添加进去：

```python
INSTALLED_APPS = (
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.sites',
    'django.contrib.messages',
    'django.contrib.staticfiles',
	'blog',
    # Uncomment the next line to enable the admin:
    # 'django.contrib.admin',
    # Uncomment the next line to enable admin documentation:
    # 'django.contrib.admindocs',
)
```
注：将你的本地应用添加放到元组的最后是一个好习惯。


## 写blog app的模型
在使用Django开发web应用是，可以不用谢SQL，只需写models。models是用来生成数据库表的，它有很多ORM API从数据库中提取或插入数据。进入blog目录，打开models.py，其中的内容为：

```python
from django.db import models

# Create your models here.
```
修改为：

```python
from django.db import models

# Create your models here.
from django.core.urlresolvers import reverse

class Post(models.Model):
    title = models.CharField(max_length=255)
    slug = models.SlugField(unique=True,max_length=255)
    description = models.CharField(max_length=255)
    content = models.TextField()
    published = models.BooleanField(default=True)
    created  = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created']

    def __unicode__(self):
        return u'%s' % self.title

    def get_absolute_url(self):
        return reverse('blog.views.post', args=[self.slug])
```
上面完成了为blog model赋予了不同的属性。__unicode__被用来显示类对象，该方法返回一个unicode对象，这里不进一步展开。

第二个方法是get_absolute_url(),当我们要链接特定的post地址时，用来返回url。内部类Mata用来设置model类按何种方式排序，这里，Post对象用创建的时间进行排序，“-”表示降序排序对象。

## 创建数据库
数据库是很多web应用的基础，Django也不例外。这部分演示如何配置django数据库，然后用django管理命令同步数据库和models。

打开settings.py文件，在DATABASES字典中，用于Python自带sqlite3,所以我们直接用sqlite3，并将即将生成的数据库文件保存在项目目录下。

```python
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3', # Add 'postgresql_psycopg2', 'mysql', 'sqlite3' or 'oracle'.
        'NAME': 'appblog.db',                      # Or path to database file if using sqlite3.
        # The following settings are not used with sqlite3:
        'USER': '',
        'PASSWORD': '',
        'HOST': '',                      # Empty for localhost through domain sockets or '127.0.0.1' for localhost through TCP.
        'PORT': '',                      # Set to empty string for default.
    }
}
```
上面配置中数据库采用的是sqlite3,并且告诉数据调用的是appblog.db。对于要上线的项目，一般选择的数据库是mysql。

配置好数据库设置后，回到命令行。由于这是你第一次同步数据库和model，所以你会问及到是否要创建管理员账号，它会在你后面用到。

```sh
python manage.py validate
python manage.py syncdb
```
上面第一条命令检查配置过程时候有错，第二条进行同步。通过过程中会出现：

```text
You just installed Django's auth system, which means you don't have any superuse
rs defined.
Would you like to create one now? (yes/no):
```
“yes”后输入管理账户名，接着会让你填写Email address，这个可以直接回车跳过不填，紧接着是输入密码。这时，会在项目的根目录下生成一个名为appblog.db的数据库，你的blog posts就存储在这里，不要删它。

在命令行中运行：

```sh
python manage.py runserver
```
切换到浏览器，刷新，没什么改变，在下一节，通过添加admin来完善这一部分。

附：

md DOS创建文件夹，怎么创建？

重启系统环境

SET PATH=C:\
ECHO %PATH%

添加notepad++到系统环境变量

E:\ProgramFiles\360Cloud\Notepad++
