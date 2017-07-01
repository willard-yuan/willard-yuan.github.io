---
layout: post
title: 前端浅谈：通过audiojs为网页添加背景音乐
categories: [前端设计]
tags: 前端
---

前一段时间捣鼓了一个好玩的网页，在网页调整得差不多了后，结合网页自身的内容，便想着要是能够在打开网页时自动播放背景音乐话，效果应该很perfect，然后又开始了没完的折腾。谷歌搜了老长时间，终于找到一个很不错的js插件[audiojs](http://kolber.github.io/audiojs/),看了一下主页上给的文档说明及使用示例，把它用到自己的小项目[love](https://github.com/willard-yuan/love)里，应该无压力。于是找了一首自己很喜欢的《卡农》背景音乐，下面是整个移植过程的详细说明。

按照主页给出的demo，audiojs有[三种模式](http://kolber.github.io/audiojs/demos/test3.html),第二种正是本小子需要的模式，然后查google浏览器查看了一下对应demo网页的代码，其中在#head中，下面代码是要加入自己项目中`index.html``<head></head>`的：

```html
<script src="../audiojs/audio.js"></script>
<script>
  audiojs.events.ready(function() {
   audiojs.createAll();
   });
</script>
```

这里需要注意的是`audio.js`是放在`audiojs`文件夹下的，为了实现文件按类别放在同一个文件夹下，本小子将`audio.js`移到了自己的小项目里js文件夹下，所以上面的路径要做相应的调整。

由于本小子需要的是自动播放模式，所有`<audio></audio>`标签对中的参数为`autoplay`，即：

```html
<audio src="http://kolber.github.io/audiojs/demos/mp3/juicy.mp3"
       autoplay></audio>
```

将`<audio></audio>`标签对放在`<body></body>`标签对之间，这里本小子放在`<body></body>`标签对最靠前位置，然后把mp3文件夹下的音乐替换成自己喜欢的《卡农》就好了。

添加完背景音乐，再打开自己捣鼓的小项目网页，perfect,又完成了一件小艺术品！