---
layout: post
title: 机器视觉：TensorFlow C++提取特征
categories: [计算机视觉]
tags: CV
---

> 深情似海，问相逢初度，是何年纪？依约而今还记取，不是前生夙世。放学花前，题诗石上，春水园亭里。逢君一笑，人间无此欢喜。  
无奈苍狗看云，红羊数劫，惘惘休提起。客气渐多真气少，汩没心灵何已。千古声名，百年担负，事事违初意。心头阁住，儿时那种情味。

在实际应用中，将TensorFlow模型推理C++工程化的好处，不仅提升执行效率，保证服务的高可用性，还便于嵌入各类应用框架中。本文主要记录TensorFlow推理过程C++工程化，包含两部分的内容，分别为：  

- TensorFlow C++提取特征。通过TensorFlow C++接口，我们可以搭建高效、稳定的特征抽取接口服务、类别预测服务等。
- TensorFlow 嵌入到QT中。将TensorFlow引入QT后，我们可以快捷地开发一些基于深度学习的桌面类的应用。

举个例子，如果要开发一个像[INstance Search](http://yongyuan.name/project/)图像检索桌面应用，其中最重要的一步，就是将提取特征过程进行C++化，为QT界面程序调用提供特征抽取接口。

TensorFlow 编译过程可以参考[Ubuntu18.04下C++编译tensorflow并在QT中使用](https://blog.csdn.net/qq_29462849/article/details/84986592)，或者参考有道笔记[TensorFlow c++ 编译](http://note.youdao.com/noteshare?id=fb00a57baa78e7232b0aa1245537b345)。注意，在MAC OS下，最好是将`libtensorflow_cc.so`和`libtensorflow_framework.so`往`/usr/local/lib`拷贝一份，避免出现编译成功但链接失败的错误。如果要在Xcode中使用TensorFlow，在`Header Search Paths`中添加：

```text
/xxx/tf/include
/xxx/tf/include/tensorflow/
/xxx/tf/include/third-party/
/xxx/tf/include/bazel-genfiles/
/xxx/tensorflow/contrib/makefile/gen/protobuf/include
/xxx/include/eigen3
/xxx/opencv/3.4.2/include
```

在`Library Search Paths`中添加：

```
/xxx/tf/lib
/xxx/opencv/3.4.2/lib
```

然后在XCode中把相关的动态添加库添加进来，就可以开心地在Xcode里面调用TensorFlow C++的各种API了。

### TF C++ 特征提取

