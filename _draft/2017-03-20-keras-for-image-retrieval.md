---
layout: post
title: 图像检索：Keras for image retrieval
categories: [Image Retrieval]
tags: CBIR
---

在小白菜还在读书的时候，简单的用Keras写了一个针对相似图像检索[flask-keras-cnn-image-retrieval](https://github.com/willard-yuan/flask-keras-cnn-image-retrieval)，没想到后面有十几个小伙伴star了。后来随着Keras版本的不断更新，陆续有几个小伙伴发邮件或者在github上询问编译错误方面的问题，于是借周末的时候，针对旧有的代码做了大幅的更新。此次更新，一方面为初学者提供CBIR方面的实战项目，另一方面从小白菜自身学习的角度来看，此次更新也让小白菜发现了Keras一些比较有意思的东西（主要从图像检索的角度来看的）。下面小白菜是结合自己的理解针对Keras用来做图像检索方面的一些总结整理。

## Keras application

在[flask-keras-cnn-image-retrieval](https://github.com/willard-yuan/flask-keras-cnn-image-retrieval)更新之前的版本中，VGG16模型的初始化是在[extract_CNN_VGG_Keras旧版](
https://github.com/willard-yuan/flask-keras-cnn-image-retrieval/blob/6fe5ce2492cfaade50d5ba6ce0aefdfafb649ab5/extract_CNN_VGG_Keras.py)中进行的，而更新之后的[extract_cnn_vgg16_keras](https://github.com/willard-yuan/flask-keras-cnn-image-retrieval/blob/master/extract_cnn_vgg16_keras.py)则大量借用内置的application，使得特征提取的代码更加简洁。小白菜一方面收益于这种高度模块化带来便利的同时，另一方面也不得不细读[vgg16.py](https://github.com/fchollet/keras/blob/master/keras/applications/vgg16.py)，这里面需要注意的一些细节和可用于图像检索的点可以总结为如下几个小节。

### 

