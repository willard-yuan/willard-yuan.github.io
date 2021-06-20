---
layout: post
title: Scalar Quantization标量量化与向量压缩
categories: [向量检索]
tags: ANN
---

在工作中遇到这样一个场景：通过多模态学习到的64维video embedding，在搜索精排的时候，需要实时取到前K（K>=300）个结果对应的video embedding，由于模型比较大，这个video embedding，不支持实时计算，而是在视频上传的时候，就被计算好。工程架构对存储和读取性能是有要求的，即不能直接将这64维embedding直接写到kiwi（redis改造后的数据库）里面。

这个问题，可以简化为：有没有一种量化方法，将一个d维float型向量，encode为一个d维int8型的向量，这个d维int8型的向量经过decode后，与原始向量的误差尽可能小？这样一来，存储空间降低为原来的1/4倍，并且读取int8的性能比float型会快很多。答案是肯定的，这也是本篇博文要介绍总结的Scalar Quantization。

Scalar Quantization，即标量量化。关于Scalar Quantization，网上资料比较多（[梯子](https://www.google.com.hk/search?q=Scalar+Quantization&newwindow=1&safe=strict&biw=1389&bih=766&sxsrf=ALeKk01QFkem3Lrzgoe3vrfd5uyeVr2RPQ%3A1624178770171&ei=UgDPYOjkCMWXr7wP98CqkA0&oq=Scalar+Quantization&gs_lcp=Cgdnd3Mtd2l6EAMyBwgjEOoCECcyBwgjEOoCECcyBwgjEOoCECcyBwgjEOoCECcyBwgjEOoCECcyBwgjEOoCECcyBwgjEOoCECcyBwgjEOoCECcyBwgjEOoCECcyBwgjEOoCECdQ06k-WOSrPmDwrD5oAXACeACAAckBiAHJAZIBAzItMZgBAKABAaABAqoBB2d3cy13aXqwAQrAAQE&sclient=gws-wiz&ved=0ahUKEwjo1ZW16aXxAhXFy4sBHXegCtIQ4dUDCBI&uact=5)），但小白菜在查过很多资料后，发觉能把Scalar Quantization向量量化过程讲清楚，并且还能剖析faiss中实现的Scalar Quantization，几乎没有。

## Scalar Quantization

Scalar Quantization标量量化，分为两个过程：

- training过程，主要是训练encode过程，需要的一些参数，这些的参数，主要是每1维对应的最大值、最小值；
- encode过程，将float向量量化为int8向量（int8是其中一种数据压缩形式，还有4比特之类的，这里主要以8比特说明原理）；
- decode过程，将int8向量解码为float向量；

为了更好的说明Scalar Quantization的原理，小白菜画了Scalar Quantization标量量化原理框图，如下图所示：

![drawing](http://yongyuan.name/imgs/posts/scalar-quantization-encode-decode1.jpg)

整个Scalar Quantization其实是很容易理解的，下面对训练、编码和解码做些说明。

### Scalar Quantization训练

Scalar Quantization训练过程，如上图最左边所示，从样本中随机采样出N个样本后，训练过程主要是得到N个样本中每1维的最大值、最小值。得到最大值、最小值后，将它们保存下来即可。实际在训练的时候，N能大的时候，尽量大点。

### Scalar Quantization编码

Scalar Quantization在编码的时候，对于一个d维的待编码的float型向量x = {x_1, x_2, ...., x_d}，编码过程主要包含如下步骤：

- 对每1维，求value_i = (x_i - min_i)/(max_i - min_i)；
- 对每1维，如果value_i < 0, 则value_i重置为value_i=0；如果value_i > 1, 则value_i重置为value_i=1。这里主要是对边界情况做下异常处理，理论情况下，是不会出现value_i < 0或者value_i > 1的；
- 对每1维，对应的编码 code_i = int(255*value_i)。为什么是255？可以思考下；

整个过程，如上图中的中间图所示。这样就完成了float型向量x = {x_1, x_2, ...., x_d}的编码，将向量的每1维，都变成了一个用int8表示的整型数据，也就是对应的Scalar Quantization的编码。

### Scalar Quantization解码

Scalar Quantization解码过程，是解码的逆过程。解码过程步骤如下：

- 对每1维，x_i = min_i + (code_i + 0.5)*(max_i-min_i)/255，通过该式子，即可完成对第i维的解码。留个问题：为啥code_i需要加上0.5？

解码的过程，如上图最右边图所示。可以看到，整个训练、编码、解码过程，都是很容易理解的。下面再看看Scalar Quantization的实现。

## Scalar Quantization实现

Scalar Quantization的训练、编码、解码实现，可以参考小白菜的实现[scalar_quantization](https://github.com/willard-yuan/cvtk/tree/master/scalar_quantization)。训练过程，就是计算各维最大值、最小值，自己实现的话，具体可以看[L68-L97](https://github.com/willard-yuan/cvtk/blob/master/scalar_quantization/train/src/sq_train.cpp#L68)。使用faiss的话，如下：

```cpp
faiss::IndexScalarQuantizer SQuantizer(d, faiss::ScalarQuantizer::QT_8bit, faiss::METRIC_L2);
SQuantizer.train(num_db, xb);
// SQuantizer.add(num_db, xb);    
faiss::write_index(&SQuantizer, model_path.c_str());
```

在`sq_train.cpp`里面，对比了自己实现的训练过程结果和faiss训练出来的结果，训练出来的参数结果，两者是一致的。

faiss encode的实现，如[L328](https://github.com/facebookresearch/faiss/blob/master/faiss/impl/ScalarQuantizer.cpp#L328)所示：

```cpp
void encode_vector(const float* x, uint8_t* code) const final {
    for (size_t i = 0; i < d; i++) {
        float xi = 0;
        if (vdiff != 0) {
            xi = (x[i] - vmin) / vdiff;
            if (xi < 0) {
                xi = 0;
            }
            if (xi > 1.0) {
                xi = 1.0;
            }
        }
        Codec::encode_component(xi, code, i);
    }
}
```

其中vdiff = max - min。faiss decode的实现，如[L344](https://github.com/facebookresearch/faiss/blob/master/faiss/impl/ScalarQuantizer.cpp#L344)所示：

```cpp
void decode_vector(const uint8_t* code, float* x) const final {
    for (size_t i = 0; i < d; i++) {
        float xi = Codec::decode_component(code, i);
        x[i] = vmin + xi * vdiff;
    }
}
```

针对小白菜Scalar Quantization，小白菜实现的编解码过程，同时提供了faiss实现的接口调用，也提供了自己实现的接口调用，具体可以阅读[int8_quan.cc](https://github.com/willard-yuan/cvtk/blob/master/scalar_quantization/scalar_quantization/int8_quan.cc)。

另外，关于Faiss实现的decode接口，由于采用了多线程方式，在实际使用的时候，当请求解码的数据量不够大的时候，多线程的方式，性能反而下降，具体可以看这里提到的Issue [Scale quantization decodes does not fast](https://github.com/facebookresearch/faiss/issues/1530)。