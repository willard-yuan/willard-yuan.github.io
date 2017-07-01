---
layout: post
title: 编码训练：Django开发简易博客(三)
categories: [Django]
tags: Django
---

要去掉TemplateDoesNotExist错误，得做三件事，第一件创建下面目录：

1. appblog/appblog/templates
2. appblog/appblog/templates/blog

下一步，你需要配置Django让Django能找到你的templates。打开settings.py文件找到TEMPLATE_DIRS元组。

```python
TEMPLATE_DIRS = (
    "D:/python_web/appblog/appblog/templates",
    # Put strings here, like "/home/html/django_templates" or "C:/www/django/templates".
    # Always use forward slashes, even on Windows.
    # Don't forget to use absolute paths, not relative paths.
)
```

完成上面后，你还需要创建三个模板。第一个是base.html，它是其它模板要继承的模板。创建templates/base.html并且输入下面的代码在里面：

```html
{% raw %}
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>{% block title %}{% endblock %}</title>
</head>
<body>
    <div class="content">
        {% block content %}
        {% endblock %}
    </div>
</body>
</html>
{% endraw %}
```

在templates下创建名为blog的文件夹，进入templates/blog/,创建首页index.html,并输入下面代码：

```html
{% raw %}
{% extends 'base.html' %}

{% block title %}Blog Archive{% endblock %}

{% block content %}
    <h1> My Blog Archive</h1>
    {% for post in posts %}
    <div class="post">
        <h2>
        <a href="{{post.get_absolute_url}}">
        {{post.title}}
        </a>
        </h2>
        <p>{{post.description}}</p>
        <p>
            Posted on
            <time datetime="{{post.created|date:'c'}}">
                {{post.created|date}}
            </time>
        </p>
    </div>
    {% endfor %}
{% endblock %}
{% endraw %}
```

出了在templates/blog创建index.html外，还需要创建post.html,在post.html中填充如下代码：

```html
{% raw %}
{% extends 'base.html' %}

{% block title %}{{post.title}}{% endblock %}

{% block content %}
<article>
    <header>
        <h1>{{post.title}}</h1>
        <p>
            Posted on
            <time datetime="{{post.created|date:'c'}}">
                {{post.created|date}}
            </time>
        </p>
    </header>
    <p class="description">
        {{post.description}}
    </p>
    {{post.content|safe}}
</article>
{% endblock %}
{% endraw %}
```

上面有一些不是html元素：

- {% raw %}{% tag %}{% endraw %} 是一个模板标签
- {{variable}} 是模板变量
- {{variable|filter}} 是被特定的模板过滤器过滤的模板变量

切换回浏览器，刷新，可以查看到如下效果：

好了，到目前为止，回顾一下我们已经做了的事情：

1. 编辑urls.py，添加一些把特定的urls映射到view函数的urlpattern
2. 写一些view函数来对应相应的URLS
3. 为模板创建目录
4. 配置django去寻找模板
5. 创建base.html模板
6. 为每一个view函数创建一个模板
7. 简单的学习一下django模板语言

上面创建的blog太单调了，需要添加css样式使之好看。

## 添加css样式

添加一点样式，就会让网页的可阅读性大幅提高。这一小部分，我们就给base.html添加一些样式。

在appblog/appblog目录下新建一个static目录，进入static目录，创建一个名为style.css的样式表：

```css
body {
    background-color: #fdfdfd;
    color: #2e2e2e;
    margin: 0;
    padding: 0;
    font-size: 14px;
    line-height: 28px;
    font-family: 'Helvetica Neue',Helvetica, Arial, sans-serif;
}
div.content {
    border: 1px solid #fbfbfb;
    background-color: #fff;
    max-width: 640px;
    width: 96%;
    padding: 2%;
    margin:28px auto;
}
```

在base.html的<head>标签间，添加下面代码：

```html
{% raw %}
<link rel="stylesheet" type="text/css" href="{{STATIC_URL}}style.css">
{% endraw %}
```

像配置templates位置一样，需要做一些配置让django知道你的static文件在哪，并且用什么URL来引用它们。打开settings.py,修改STATIC_URL为：

```python
STATIC_URL = '/static/'
```
同时修改STATICFILES_DIRS为：

```python
STATICFILES_DIRS = (
    'D:/python_web/appblog/appblog/static/',
    # Put strings here, like "/home/html/static" or "C:/www/django/static".
    # Always use forward slashes, even on Windows.
    # Don't forget to use absolute paths, not relative paths.
)
```

注意：和模板目录一样这里是本小子的static的绝对目录，使用时要改成自己本机存放static文件的绝对路径。刷新浏览器：
![2014-04-13 22_07_16-Blog Archive]({{ site.url }}/public/images/posts/2014-04-13 22_07_16-Blog Archive.png)

在这个教程教程中，我们完成了下面几件事：

- 用django-admin.py创建了一个project
- 用django-admin.py创建了一个app
- 为app设计model
- 关于数据库和其它的项目配置
- 连接应用和系统自带管理app，并且自己写了一个自定义的admin类
- 为app写urlpatterns view函数模板，配置关于templates相关的
- 配置css相关，提高网站的阅读性

Reference:  
[1]. [Get started with Django](http://www.creativebloq.com/netmag/get-started-django-7132932)  
[2]. [用django搭建一个简易blog系统](http://www.cnblogs.com/Happy-Tuesday/p/3353548.html)