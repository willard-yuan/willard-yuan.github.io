---
layout: post
title: 用shadowbox.js为图片添加阴影效果
categories: [前端设计]
tags: 前端设计
---

正如本小子在博客[ABOUT](http://yuanyong.org/blog/about/)里描述的，本小子对排版有永不止境的追求。本小子平时有事没事会打开自己的博客，看看博客排版哪里还需要改进的。前段时间发觉自己对JS突然有感觉了，通过读读文档，基本可以实现自己想要的功能。真正开始用JS添加页面效果还是从这篇文章开始的[通过audiojs为网页添加背景音乐](http://yuanyong.org/blog/add-background-music-by-audiojs.html)。

昨天打开别人的博文时，发觉为图片外框添加阴影效果挺美观的。于是本小子也开始捣鼓给自己的博客添加图片阴影效果。用firefox查看人家博客的CSS样式，发觉`img`中多了shadowbox这一项，然后自己直接复制过去，发觉没用。只能放狗一搜了，原来用了JS插件。查了一些资料，比较杂，真正对自己有用的是这货[shadowbox.js](http://www.shadowbox-js.com/index.html)。下载主页提供的文件包后，解压，发觉不止有`shadowbox.js`文件，还多了`shadowbox.css`样式文件，有点莫名其妙，之前我用`audio.js`时是没有css样式的。本小子没管那么多，直接把`shadowbox.css`放在css文件夹里，`shadowbox.js`放在js文件夹下。按照[Shadowbox.js](http://www.shadowbox-js.com/index.html)主页使用说明：
>The simplest way to set up Shadowbox is to include the JavaScript and CSS files in the <head> of your document (web page) and then call Shadowbox.init, like this:

```html
<link rel="stylesheet" type="text/css" href="shadowbox.css">
<script type="text/javascript" src="shadowbox.js"></script>
<script type="text/javascript">
Shadowbox.init();
</script>
```

在自己博客的`default.html`文件`<head>`标签之间采用上面的代码进行初始化，由于本小子的shadowbox不是放在根目录的，所以还要修改一下上面`href`和`src`的路径，具体如下：

```html
<link rel="stylesheet" type="text/css" href="/public/css/shadowbox.css">
<script type="text/javascript" src="/public/js/shadowbox.js"></script>
<script type="text/javascript">
Shadowbox.init();
</script>
```

修改完后，还要添加css样式。说到这，不得不提一下两个非常有用的网址：[Box-shadow, one of CSS3′s best new features](http://www.css3.info/preview/box-shadow/)和[BOX SHADOW](http://www.cssmatic.com/box-shadow)。前者对于理解shadowbox的参数设置非常有帮助，后者则是一个在线shadowbox阴影效果生成器，可视化，非常的方便。

本小子在`main.css`的`img`添加了如下的阴影效果代码：

```css
-webkit-box-shadow: 1px 4px 16px 8px #5CA2BE;
-moz-box-shadow: 1px 4px 16px 8px #5CA2BE;
box-shadow: 1px 4px 16px 8px #5CA2BE;
```

添加完后push到github上面，发觉阴影效果有了，但图片上面的字与下面图片的间距挨得太近了，放狗一搜，发觉`margin:20px auto;`似乎有用，然后在firefox里测试了一下，果然有用，将它添加进样式里，就可以看见现在博文里图片的阴影效果了，over。

