---
layout: post
title: C++漫谈：为C++实现的功能提供Python API接口-Pybind11
categories: [Cpp]
tags: Cpp
---

兴趣与业余时间开发的[CVTK](https://yongyuan.name/cvtk/#/)项目，除了继续完善和添加算法到[CVTK](https://yongyuan.name/cvtk/#/)外，还计划提供Python API，便于Python调用。在为[CVTK](https://yongyuan.name/cvtk/#/)添加Python API支持的过程中，调研了下C++/Python绑定库的情况。目前支持C++/Python绑定库，比较主流的有四大流行库，分别是：

- [Pybind11](https://pybind11.readthedocs.io/en/stable/)
- [Boost.Python](https://www.boost.org/doc/libs/1_70_0/libs/python/doc/html/index.html)
- [SWIG](http://www.swig.org/)
- [Cython](https://cython.org/)

关于Pybind11、Boost.Python、Cython、SWIG（[Faiss](https://github.com/facebookresearch/faiss)的Python接口，是用[SWIG桥接的](https://github.com/facebookresearch/faiss/blob/main/faiss/python/setup.py)）这4个库对Cpp的支持与对比情况，可以详阅[如何选择 Python与C++ 之间的胶水](https://zyxin.xyz/blog/2019-08/GluePythonCpp)。这里主要记录下自己在用Pybind11为[CVTK](https://yongyuan.name/cvtk/#/)桥接Python API的过程。如果工作中碰到类似需求，可以考虑用PyBind11或者上面提到的其他三个库。

## 效果

在[pypi.org](https://pypi.org/)上发布CVTK Python包，可以通过项目主页[cvtk-release](https://pypi.org/project/cvtk-release/)的说明进行安装，目前完成CVTK Cpp与Python之间的桥接，Cpp实现的功能会逐步提供对应的Python接口。

CVTK提供Python API的开发功能，会先发布在[cvtk-pypi](https://github.com/willard-yuan/cvtk-pypi)进行测试，如果测试没问题了，最终会同步到[CVTK](https://github.com/willard-yuan/cvtk)上。

![drawing](http://yongyuan.name/imgs/posts/cvtk-pybind11.jpg)

## Pybind11桥接Cpp与Python

假设在[CVTK](https://yongyuan.name/cvtk/#/)中实现了某一个功能，举个简单的例子，比如实现了一个相加的功能，那通过Pybind11为这个函数提供Python接口时，可以这样：

```cpp
#include <pybind11/pybind11.h>

#define STRINGIFY(x) #x
#define MACRO_STRINGIFY(x) STRINGIFY(x)

int add(int i, int j) {
    return i + j;
}

namespace py = pybind11;

PYBIND11_MODULE(cvtk, m) {
    m.doc() = R"pbdoc(
        Pybind11 example plugin
        -----------------------
        .. currentmodule:: cmake_example
        .. autosummary::
           :toctree: _generate
           add
           subtract
    )pbdoc";

    m.def("add", &add, R"pbdoc(
        Add two numbers
        Some other explanation about the add function.
    )pbdoc");

    m.def("subtract", [](int i, int j) { return i - j; }, R"pbdoc(
        Subtract two numbers
        Some other explanation about the subtract function.
    )pbdoc");

#ifdef VERSION_INFO
    m.attr("__version__") = MACRO_STRINGIFY(VERSION_INFO);
#else
    m.attr("__version__") = "dev";
#endif
}
```

上面`PYBIND11_MODULE`这个宏用来告诉Python import设置的包名称，`cvtk`是这个模块的名字，`m`是一个`py::module`类型的变量，代表module本身，`module::def()`也就是`m.def` 负责把Cpp实现的`add`方法暴露给Python。

## 设置setup与本地编译

Pybind11提供了cmake编译系统的模板[cmake_example](https://github.com/pybind/cmake_example)，使用起来特别的方便。在使用编译模板的时候，需要关注的地方：[setup.py](https://github.com/willard-yuan/cvtk-pypi/blob/main/setup.py)和[CMakeLists.txt](https://github.com/willard-yuan/cvtk-pypi/blob/main/CMakeLists.txt)。

本地编译，执行下面命令：

```sh
pip install ./cvtk-pypi
```
上述命令会对项目进行编译，并将cvtk包安装在本地，在Python中导入包名验证即可。

## 编译并发布到Pypi

发布到[pypi.org](https://pypi.org/)上，主要有两步，分别是：

- 生成发布包。也就是我们平时在安装Python第三方库时，常见的带`.whl`后缀的预编译包。
- 发布到pypi上。将生成的发布包，上传到pypi上，用户就可以通过`pip install xxx`安装发布的包了。

编译并发布到Pypi，PyPA上提供了一个非常好的教程[Packaging Python Projects](https://packaging.python.org/en/latest/tutorials/packaging-projects/#uploading-your-project-to-pypi)。实际操作下来，行云流水。

参考：[Packaging Python Projects](https://packaging.python.org/en/latest/tutorials/packaging-projects/#uploading-your-project-to-pypi);
