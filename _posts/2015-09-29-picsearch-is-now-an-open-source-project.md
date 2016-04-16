---
layout: post
title: PicSearch is now an open source project
categories: [Image Retrieval]
tags: 图像检索
---

## Brief introduction

**PicSearch** is an image search engine based on Convolutional Neural Network (CNN) feature. It's a very simple demo and it just showes the performance of CNN for image retrieval. The demo site can access to [**demo**](http://search.yongyuan.name/).

<object width="800" height="600">
<param name="movie" value="http://player.youku.com/player.php/sid/XMTM0NzYyMzE4OA==/v.swf"></param>
<param name="allowFullScreen" value="true" />
<param name="allowScriptAccess" value="always"/>
<param name="wmode" value="transparent"></param>
<param name="bgColor" value="#ffffff"></param>
<embed src="http://player.youku.com/player.php/sid/XMTM0NzYyMzE4OA==/v.swf" allowFullScreen="true" quality="high" width="480" height="400" align="middle" allowScriptAccess="always" type="application/x-shockwave-flash"></embed>
</object>

## Download the code and dataset

The PicSearch is running on Caltech256 image dataset, which contains 29780 images with 256 categories. Before running the project, you must download the following code and dataset:

1. PicSearch [code](https://github.com/willard-yuan/CNN-Web-Demo-for-Image-Retrieval).
2. The features extract by CNN on Caltech256 [256feat2048Norml.mat](http://pan.baidu.com/s/14YAeE).
3. The [thumbnails](http://pan.baidu.com/s/1kT4atkb) of Caltech256. The thumbnails are just for showing the search result, you can replace it by the original image dataset.

**Note**: to test it on other dataset, you must extract the features first. You can use [CNN-for-Image-Retrieval](https://github.com/willard-yuan/CNN-for-Image-Retrieval) to extract features on other dataset.

## How to run the code

The code is written by Python, and the web server is cherrypy, so It's very easy to understand the code and to run the code. The structure of **PicSearch** is as follows:

```sh
├── 256feat2048Norml.mat
├── bootstrap
├── favicon.ico
├── searchEnginePython.py
├── service-server.conf
├── service.conf
├── style.css
└── thumbnails
```

To run the code successfully, You are suggested to following the below steps:

- set the setting in `service.conf`:

```sh
[global]
server.socket_host = "127.0.0.1"
server.socket_port = 8080
server.thread_pool = 10
tools.sessions.on = True

[/]
tools.staticdir.root = "I:\PicSearch"

[/]
tools.staticdir.on = True
tools.staticdir.dir = ''
```

Changes the path of `tools.staticdir.root` to your path.

- run the server:

```sh
python searchEnginePython.py
```

Then open your browse and put the site: [127.0.0.1](http://127.0.0.1/).

That's all. Enjoy yourself! If you have problem, you can open an issue on [CNN-Web-Demo-for-Image-Retrieval](https://github.com/willard-yuan/CNN-Web-Demo-for-Image-Retrieval/issues/new).
