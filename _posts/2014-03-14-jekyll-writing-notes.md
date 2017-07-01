---
layout: post
title: 写作技艺：Jekyll写作技巧小札
categories: [Jekyll]
tags: Jekyll
---

今天本小子又发现新大陆了，[jekyllrb](http://jekyllrb.com/),对应的中文文档为[jekyllcn](http://jekyllcn.com/),感谢这帮帅小伙助力开源，世界因开源精神更美好。本小子通读了翻译的文档，发觉关于Jekyll的很多知识点本小子都没注意到，所以对那份文档做些读后笔记，方便需用之时查询。

## 代码高亮

本小子之前在博文里贴整段代码时采用的都是三个点加语言类型，今天读文档时，发觉还可以采用Liquid 标记：
{% highlight text %}
{% raw %}{% highlight python %}{% endraw %}
def process_image(imagename,resultname,params="--edge-thresh 10
                  --peak-thresh 5"):
    """ process an image and save the results in a file"""

    if imagename[-3:] != 'pgm':
        #create a pgm file
        im = Image.open(imagename).convert('L')
        im.save('tmp.pgm')
        imagename = 'tmp.pgm'

    cmmd = str("sift "+imagename+" --output="+resultname+
                " "+params)
    os.system(cmmd)
    print 'processed', imagename, 'to', resultname
{% raw %}{% endhighlight %}{% endraw %}
{% endhighlight %}
输出的结果为：
{% highlight python %}
def process_image(imagename,resultname,params="--edge-thresh 10
                  --peak-thresh 5"):
    """ process an image and save the results in a file"""

    if imagename[-3:] != 'pgm':
        #create a pgm file
        im = Image.open(imagename).convert('L')
        im.save('tmp.pgm')
        imagename = 'tmp.pgm'

    cmmd = str("sift "+imagename+" --output="+resultname+
                " "+params)
    os.system(cmmd)
    print 'processed', imagename, 'to', resultname
{% endhighlight %}

## 代码显示行数

要想在代码前面显示代码的行数，可以添加关键字`linenos`,这样完整的高亮开始标记将会是:
{% highlight text %}
{% raw %}{% highlight python linenos %}{% endraw %}
{% endhighlight %}

## 代码片段包含类Liquid语法

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

这是在[Django开发简易博客三](http://yuanyong.org/blog/use-django-bulding-a-blog-three.html)中遇到的一个问题，由于上面代码中含类Liquid语法，写完push上去后，github一直发邮件报错，查阅资料后发觉是上面代码片段中包含有类Liquid语法。可以通过加rawtag解决这个问题。

此外，像[Django开发简易博客三](http://yuanyong.org/blog/use-django-bulding-a-blog-three.html)中{% raw %}{{STATIC_URL}}{% endraw %}也要用raw来进行屏蔽。

## 预定义的全局变量

`permalink`：如果你需要让你的博客中的URL地址不同于默认值 `/year/month/day/title.html` 这样，那么当你设置这个变量后，就会使用最终的URL地址。本小子`HOME`和文章的头部已经有时间戳了，所以再`url`里显得有点多余，而且本小子比较喜欢简洁的`url`,所以本小子的博客采用的是：`permalink: /:title.html`。
