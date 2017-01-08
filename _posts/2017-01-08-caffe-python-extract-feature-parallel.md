---
layout: post
title: 机器视觉：Caffe Python接口多进程提取特征
categories: [机器视觉]
tags: 机器视觉
---

想象这样一个场景：服务器上配备了很多GPU显卡，而你又使用的是Caffe，不幸的是，你还选用了Python来写代码，不幸中的不幸是你还要在短时间内处理百万千万规模的图片。那么，问题来了，Caffe本身对多卡的支持就不是很好，而你还要用Python，而且即便你通过设置batch size的大小来加快处理速度，但你还是只把一张显卡用起来。有没有办法把所有的GPU都用起来，并行提取特征呢？

上面这个问题在实际中是一个经常会碰到并且绕不过的问题，小白菜在近期也遇到了此问题，并且上面那些设定的条件小白菜不幸都一一躺枪。虽然如此，问题还是要解决的。下面小白菜聊聊**如何使用python 的multiprocessing多进程并行库来把服务器上的多张GPU都用起来，进行特征的并行提取**。在正式给出具体的解决方案之前，还是有必要了解multiprocessing多进程并行库的。

## multiprocessing多进程并行库

multiprocessing对于进程的管理，是使用进程池pool进行管理的。pool允许用户指定进程数目，在线程池未满的时候，如果新的请求提交过来，则pool会创建新的进程来执行该请求，如果池中的进程数已经达到规定最大值，那么该请求就会等待，直到池中有进程结束，才会创建新的进程来执行它。pool对于进程的管理，有两种方式，分别是异步方式(也称非阻塞方式)和同步方式(也称阻塞方式)，对应的方法为apply_async()和apply()。

- `apply()`: 同步方式(也称阻塞方式)。阻塞，顾名思义，在执行该任务的时候，把所有的接口资源都堵住了，其他的任务必须等待这个任务执行完后，再释放资源后，才能执行其他的任务，所以非常的好理解。
- `pool.apply_async()`: 异步方式(也称非阻塞方式)。有了上面阻塞的解读，小白菜以为异步方式已经非常直白了。

进程池管理pool还有一些其他的方法，这里不再做详细的展开了，更多关于Python的multiprocessing的解读，可以参考[Multiprocessing.Pool](http://thief.one/2016/11/24/Multiprocessing-Pool/)和[正确使用 Multiprocessing 的姿势](https://jingsam.github.io/2015/12/31/multiprocessing.html)，写得直白易懂。

有了上面对Python的multiprocessing的认识，我们再回到使用python的multiprocessing多进程并行库来把服务器上的多张GPU都用起来这个问题上。根据对pool对进程池管理的方法，显然`pool.apply_async()`是我们需要的，确定好了这个后，小白菜再简单聊聊并行化设计的思路。

## 并行化方案

问题定义：假设需要处理的图片有800万，服务器上有8块GPU，如何使用python 的multiprocessing多进程并行库来把服务器上的多张GPU都用起来，进行特征的并行提取。

对于上述给出的问题定义，小白菜设计的并行化方案为：将800万分成8等分，启动8个进程，每个进程使用一块GPU，并且每一个进程载入一份预训练的模型，这样就可以把8块GPU都用起来了。此种方案，可以最大限度的使用GPU，有多少块GPU，就可以用多少GPU，下面是具体的编码。

## 具体编码

有了上面对multiprocessing和并行化方案后，在具体编码的时候，要做的事情其实非常简单，主要需要完成的就是两件事：

- 把图片数据按GPU的数目进行等量划分，即写一个`split_list()`函数
- 正常编写特征提取代码，写一个`gpu_task`函数

具体代码如下:


```python
#!/usr/bin/env python
# -*- coding: utf-8 -*-
# Author: github@willard-yuan


import multiprocessing
from multiprocessing import Process, freeze_support, Pool
import sys
import os
import caffe
import numpy as np
import scipy
import h5py


def split_list(alist, wanted_parts=1):
    length = len(alist)
    return [ alist[i*length // wanted_parts: (i+1)*length // wanted_parts] 
             for i in range(wanted_parts) ]

def gpu_task(prototxt, caffemodel, layer, path_images, out, gpu=0):
    num_images = len(path_images)

    h5f = h5py.File(out, 'w')

    # set gpu card
    caffe.set_device(gpu)
    caffe.set_mode_gpu()

    # init NN
    net = caffe.Net(prototxt, caffemodel, caffe.TEST)
    net.forward()

    features = []
    image_names = []

    for i, path in enumerate(path_images):
        print "%d(%d), %s"%((i+1), num_images, os.path.basename(path))
        if os.path.splitext(os.path.basename(path))[0][-6:] != 'single':
            img = ...
 
            # extract feature

            feat = ...
 
            features.append(feat)
            image_names.append(os.path.basename(path))      

    features = np.array(features)
    h5f['feats'] = features
    h5f['names'] = image_names
    h5f.close()    
    print "gpu %d task has finished..." % (gpu)

if __name__ == '__main__':

    multiprocessing.freeze_support()
    pool = multiprocessing.Pool()
    
    dir_images = '....'
    path_images = [os.path.join(dir_images, f) for f in sorted(os.listdir(dir_images)) if f.endswith('.jpg')]
    layer = '...'
    prototxt = 'VGG_ILSVRC_16.prototxt'
    caffemodel = 'VGG_ILSVRC_16_layers.caffemodel'
    out = '...'

    parts = 8 # 8个进程

    out_files = []
    for i in xrange(parts):
        out_files.append(os.path.join(out, str(i) + '.h5'))

    blocks = split_list(path_images, wanted_parts = parts)
  
    for i in xrange(0, parts):
        pool.apply_async(gpu_task, args = (prototxt, caffemodel, layer, blocks[i], out_files[i], i + (8 - parts),))
    
    pool.close()
    pool.join()
```

上面那些`...`的部分，是小白菜刻意省略的，具体在实际使用的时候，可以结合自己的需要来做更改。另外一个`pool.close()`和`pool.join()`的次序一定不能反，否则会出错。执行完close后不会有新的进程加入到pool,join函数等待所有子进程结束。

对于特征的保存，可以采用hdf5的格式进行存储，上面每一个进程提取的特征，保存在一个h5(HDF5格式)文件中，这样对于八个进程，可以得到8份小文件，每一份文件里存了图像文件名及其对应的特征。