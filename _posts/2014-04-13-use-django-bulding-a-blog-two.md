---
layout: post
title: 编码训练：Django开发简易博客(二)
categories: [Django]
tags: Django
---

## admin连结并激活

Django本身就带有一个应用叫Admin,它是一个很好用的工具，下面我们将其激活，并再次对数据库和model进行同步，将admin和blog app连结起来。

回到appblog目录下，打开settings.py,把INSTALLED_APPS元组改为下面形式：

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
    'django.contrib.admin',
    # Uncomment the next line to enable admin documentation:
    # 'django.contrib.admindocs',
)
```

重新启动Django服务器，刷新浏览器，看看是否出错，经常检查是否有错误产生是一个很好的习惯。接来下，打开urls.py文件，同样修改成下面形式：

```python
from django.conf.urls import patterns, include, url

# Uncomment the next two lines to enable the admin:
from django.contrib import admin
admin.autodiscover()

urlpatterns = patterns('',
    url(r'^admin/',include(admin.site.urls)),
    # Examples:
    # url(r'^$', 'appblog.views.home', name='home'),
    # url(r'^appblog/', include('appblog.foo.urls')),

    # Uncomment the admin/doc line below to enable admin documentation:
    # url(r'^admin/doc/', include('django.contrib.admindocs.urls')),

    # Uncomment the next line to enable the admin:
    # url(r'^admin/', include(admin.site.urls)),
)

```

再测试一次，检查命令行终端和浏览器，看有没有错误产生。如果没有错误产生，再同步一次数据库。现在可以再运行一次syncdb命令，你会发现这个命令创建了新的表。

```sh
python manage.py syncdb
python manage.py runserver
```

切换到浏览器，在地址栏输入[127.0.0.1:8000/admin](http://127.0.0.1:8000/admin/),会得到类似下面页面：
![2014-04-13 21_16_07-Log in _ Django site admin]({{ site.url }}/public/images/posts/2014-04-13 21_16_07-Log in _ Django site admin.png)

用原来创建的管理员账号登陆，在管理面板中，会发现没有blog应用，下面这些就可以做这些了。

## 连接你的blog
在blog目录下，创建一个admin.py文件，并往里面添加下面代码：

```python
from django.contrib import admin
from blog.models import Post

admin.site.register(Post)
```

这是添加应用到admin最简单的方法。重启服务器刷新一下admin的页面，你将会看到像下面的页面:
![](http://images.cnitblog.com/blog/502877/201310/05215111-f96e5b35e26b47fcafb8801ab71c4132.jpg)
现在blog应用已经在你admin中了，可以创建一个blog post。为了添加blog应用到admin,刚才做的是最基本的，为了让admin对用户更加友好点，添加一个用户自定义的类PostAdmin。修改admin.py为：

```python
from django.contrib import admin
from blog.models import Post

class PostAdmin(admin.ModelAdmin):
    list_display = ['title','description']
    list_filter = ['published','created']
    search_fields = ['title','description','content']
    date_hierarchy = 'created'
    save_on_top = True
    prepopulated_fields = {"slug":("title",)}

admin.site.register(Post,PostAdmin)
```

回到浏览器，刷新页面,将会看到你的blog应用会好多了。

![](http://images.cnitblog.com/blog/502877/201310/05225357-dfa617e43eab4e91b9d754e108a37c8b.jpg)

## 为blog app写URLS, views and templates
现在该写一些urls，让它包含一些url模式。Django用URLconfs中的urlpatterns来将HTTP请求映射到特定的views函数，view函数返回响应给用户。后面要做的三件事如下：

1. 在appblog/urls.py中写urlpatterns
2. 在blog/views.py中写view函数
3. 为views创建templates

下面对上面的三步分别进行。

## 写urlpatterns

打开appblog/urls.py,修改如下：

```python
from django.conf.urls import patterns, include, url

# Uncomment the next two lines to enable the admin:
from django.contrib import admin
admin.autodiscover()

urlpatterns = patterns('',
    url(r'^admin/',include(admin.site.urls)),
    url(r'^$', 'blog.views.index'),
    url(r'^(?P<slug>[\w\-]+)/$','blog.views.post'),
    # Examples:
    # url(r'^$', 'netmag.views.home', name='home'),
    # url(r'^netmag/', include('netmag.foo.urls')),

    # Uncomment the admin/doc line below to enable admin documentation:
    # url(r'^admin/doc/', include('django.contrib.admindocs.urls')),

    # Uncomment the next line to enable the admin:
    # url(r'^admin/', include(admin.site.urls)),
)
```

`^(?P<slug>[\w\-]+)/$`为正则表达式。注意`^admin/`在正则表达式`^(?P<slug>[\w\-]+)/$`前，这是因为在正则表达式的世界里，后者同样匹配前者匹配的。重新启动Django服务器，刷新浏览器，你可以看到下面的结果：

![2014-04-13 21_35_53-ViewDoesNotExist]({{ site.url }}/public/images/posts/2014-04-13 21_35_53-ViewDoesNotExist.png)

收到这个错误提示，是因为映射到的view函数不存在，现在完善这一点。

## 写视图函数

打开blog/views.py,修改为下面形式：

```python
from django.shortcuts import render,get_object_or_404
from blog.models import Post

def index(request):
    posts = Post.objects.filter(published=True)
    return render(request,'blog/index.html',{'posts': posts})

def post(request, slug):
    post = get_object_or_404(Post,slug=slug)
    return render(request,'blog/post.html',{'post': post})
```

刷新页面，仍然会有一个错误，这次提示TemplateDoesNotExist错误

![2014-04-13 21_39_57-TemplateDoesNotExist]({{ site.url }}/public/images/posts/2014-04-13 21_39_57-TemplateDoesNotExist.png)

在下一节我们做三件事来去掉TemplateDoesNotExist错误,详见后面分解。
