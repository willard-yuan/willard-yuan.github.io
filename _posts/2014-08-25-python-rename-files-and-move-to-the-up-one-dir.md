---
layout: post
title: python重命名101 ObjectCategories下图像并移到上一级目录
categories: [Python]
tags: Python
---

今天在做一个图像检索系统的Demo演示时需要用到一个比较大的数据库，查看了一下手头的几个数据库，决定选用[**Caltech 101**](http://www.vision.caltech.edu/Image_Datasets/Caltech101/)。**Caltech 101**有102类，在`101_ObjectCategories文件夹下有102个文件夹，而每一个文件夹下的图像文件名都是以`image_0xxx.jpg`这种方式命名的，如果一个个的把它们搬出来的话，不仅重名而且还费时费力。因为对python比较熟悉，知道这事用python来完成肯定不怎么难，费了10来分钟，写了个脚本，圆满的完成了任务。写完再搜**Caltech 101**链接的时候，发现已有人对这个问题做了处理，详见[这里](http://blog.csdn.net/chuminnan2010/article/details/21188231)。大致瞄了几眼，感觉跟自己下面用python写的相比，写的好复杂。

`101_ObjectCategories`的目录结构如下:

```sh
willard@willard-PC~/Pictures/101_ObjectCategories $ tree -L 2
.
├── anchor
│   ├── image_0001.jpg
│   ├── image_0002.jpg
│   └── image_0003.jpg
├── ant
│   ├── image_0001.jpg
│   ├── image_0002.jpg
│   └── image_0003.jpg
└── ......
    ├── image_0001.jpg
    ├── image_0002.jpg
    └── ......

```sh

要把上面的图像放在一起,并加上所属的类别名,即w为下面这种形式:

```sh
willard@willard-PC~/Pictures/101_ObjectCategories $ tree -L 1
.
├── anchor_image_0001.jpg
├── anchor_image_0002.jpg
├── anchor_image_0003.jpg
├── ant_image_0001.jpg
├── ant_image_0002.jpg
├── ant_image_0003.jpg
├── binocular_image_0001.jpg
├── binocular_image_0002.jpg
└── ......
```

脚本如下:

```python
import os
from re import sub
import fnmatch

# walk through the folder
f = open("./101_ObjectCategories/101_ObjectCategories.txt", "w")
for root, dirs, files in os.walk('101_ObjectCategories'):
    for str_each_folder in dirs:
        # we get the directory path
        str_the_path = '/'.join([root, str_each_folder])

        files_number = len(fnmatch.filter(os.listdir(str_the_path), '*.jpg'))
        # list all the files using directory path
        for str_each_file in os.listdir(str_the_path):
            # look for the files we want
            if str_each_file.endswith('.jpg'):
                # now add the new one
                str_new_name = str_each_folder + '_' + str_each_file
                # full path for both files
                str_old_name = '/'.join([str_the_path, str_each_file])
                str_new_name = '/'.join([root, str_new_name])

                # now rename using the two above strings
                # and the full path to the files
                os.rename(str_old_name, str_new_name)

        # we can print the folder name so we know
        # that all files in the folder are done
        print '%s, %d images' % (str_each_folder, files_number)
        f.writelines('%s, %d images\n' % (str_each_folder, files_number))

f.close
```

在完成重命名后将图像搬移到上一级，并将该文件夹名称及其有多少幅图像保存在`101_ObjectCategories.txt`中。顺便吐槽一下,Windows下tree命令真烂。
