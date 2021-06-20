---
layout: post
title: Scalar Quantization标量量化与在ANN中的应用
categories: [向量检索]
tags: ANN
---

> 本篇是对之前写过的几篇涉及到向量索引博文的系统整理和补充，分别为：
>
- [Asymmetry Problem in Computer Vision](https://yongyuan.name/blog/asymmetry-problem-in-computer-vision.html)
- [再叙ANN Search](http://yongyuan.name/blog/ann-search.html)
- [十亿规模的深度描述子如何有效索引](http://yongyuan.name/blog/index-billion-deep-descriptors.html)
- [基于内容的图像检索技术](http://yongyuan.name/blog/cbir-technique-summary.html)


在工作中遇到这样一个场景：通过多模态学习到的64维video embedding，在搜索精排的时候，需要实时取到前K（K>=300）个结果对应的video embedding，由于模型比较大，这个video embedding，不支持实时计算，而是在视频上传的时候，就被计算好。工程架构对存储和读取性能是有要求的，即不能直接将这64维embedding直接写到kiwi（redis改造后的数据库）里面。

这个问题，可以简化为：有没有一种量化方法，将一个d维float型向量，encode为一个d维int8型的向量，这个d维int8型的向量经过decode后，与原始向量的误差尽可能小？这样一来，存储空间降低为原来的1/4倍，并且读取int8的性能比float型会快很多。答案是肯定的，这也是本篇博文要介绍总结的Scalar Quantization。

Scalar Quantization，即标量量化。关于Scalar Quantization，网上资料比较多（[梯子](https://www.google.com.hk/search?q=Scalar+Quantization&newwindow=1&safe=strict&biw=1389&bih=766&sxsrf=ALeKk01QFkem3Lrzgoe3vrfd5uyeVr2RPQ%3A1624178770171&ei=UgDPYOjkCMWXr7wP98CqkA0&oq=Scalar+Quantization&gs_lcp=Cgdnd3Mtd2l6EAMyBwgjEOoCECcyBwgjEOoCECcyBwgjEOoCECcyBwgjEOoCECcyBwgjEOoCECcyBwgjEOoCECcyBwgjEOoCECcyBwgjEOoCECcyBwgjEOoCECcyBwgjEOoCECdQ06k-WOSrPmDwrD5oAXACeACAAckBiAHJAZIBAzItMZgBAKABAaABAqoBB2d3cy13aXqwAQrAAQE&sclient=gws-wiz&ved=0ahUKEwjo1ZW16aXxAhXFy4sBHXegCtIQ4dUDCBI&uact=5)），但小白菜在查过很多资料后，发觉能把Scalar Quantization向量量化过程讲清楚，并且还能剖析faiss中实现的Scalar Quantization，几乎没有。

## Scalar Quantization原理



