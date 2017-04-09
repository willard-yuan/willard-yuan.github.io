---
layout: post
title: 编码训练：Django-markdown使用实例
categories: [Django]
tags: Django
---

最近在开发虫虫读书的时候,想为它添加markdown语法支持.在github上搜了一下,发觉[django_markdown](https://github.com/klen/django_markdown)差不多是django的主流选择.今晚在看[Building a Blog with Django 1.7 in 16 mins](http://www.youtube.com/watch?v=7rgph8en0Jc)恰好里面也用到了django-markdown,于是结合文档说明与视频,初步实现了后台编辑文本时的markdown语法支持.

下面是后台添加django-markdown后的效果图:

![2014-10-03-django-web-guide-development-notes-one-1]({{ site.url }}/images/posts/django-markdown.png)

## 安装

用`pip`,安装第三方库是一件极easy的事.现在我一般都喜欢先用virtualenv做一个沙箱,然后在沙箱里安装各种库.激活沙箱后,运行下面命令即可安装django-markdown:

```sh
pip install django-markdown
```

安装好后,可以`pip freeze > requirements.txt`将安装的依赖包保存在`requirements.txt`里面,方便部署和迁移.

## 配置

安装好后,接下来就是在`setting.py`和`urls.py`里进行一些必要的配置了:

- 将'django_markdown'添加进INSTALLED_APPS中:

```python
INSTALLED_APPS += ( 'django_markdown', )
```

- 将django_markdown的urls添加到根urls里面:

```python
url('^markdown/', include( 'django_markdown.urls')),
```

## 使用django-markdown

1. 定制表单

```python
from django_markdown.widgets import MarkdownWidget
class MyCustomForm(forms.Form):
    content = forms.CharField(widget=MarkdownWidget())
```
在前端,如果要使在发表评论时能用markdown,就可以采用上面的语法.目前我还只是在后台使用markdown.

2. 定制admins

```python
from django_markdown.admin import MarkdownModelAdmin
admin.site.register(MyModel, MarkdownModelAdmin)
```
定制后台就更简单了,按上面的就可以搞定,在我的`admin.py`;里是这样写的:

```python
# coding:utf8
from django.contrib import admin
from books_app.models import *
from django_markdown.admin import MarkdownModelAdmin


class BookAdmin(admin.ModelAdmin):
    list_display = ('id', 'isbn', 'title', 'author', 'translator', 'publisher', 'type',)
    list_filter = ('type', 'publisher',)
    search_fields = ('id', 'title', 'isbn',)
    list_per_page = 20


#admin.site.register(Book)
admin.site.register(Book, MarkdownModelAdmin)
```
`Book`是我定义的一个模型,添加完上面后,在后台我定制的admin里的摘要和作者介绍这两部分的撰写就可以支持markdown语法了,也就是你可看到的上面的那个效果图.

3. Flatpages
这个目前还不需要,需要的时候再看.

4. 模板的tags

```html
{% raw %}
<textarea name="test" id="new"></textarea>
{% markdown_editor "#new" %}
{% markdown_media %}
{% endraw %}
```
结合1中的定制表单,可以实现前台评论markdown语法支持.先写到这里,等做到前台评论功能实现后,再对评论表单markdown语法支持坐个总结.
