---
layout: post
title: 相关性与消费倾向性建模思考
categories: [排序学习]
tags: LTR
---

> 

## 背景

在搜索排序上，影响排序的因子有很多，比如相关性、消费倾向性、权威质量、时效性等。由于搜索是一个极其复杂高耦合性的系统，在本文中，只尝试探讨相关性、消费倾向性两个因子（欢迎有兴趣的朋友一起探讨）。

消费倾向性是指在两个item相关性差不多的情况下，用户对两个item是有倾向偏好的。在对消费倾向性建模的时候，存在的前提条件是相关性，即消费倾向性建模的目标，不是纯粹的去预估各种消费预估值（点击、转化、播放等）。那么问题来了，消费倾向性在建模的时候，在将相关性纳入进来的时候，怎样才能将它们俩融合在一起呢？在尝试回答这个问题前，先回顾业界与学术上对相关性问题的研究，包括：

- 相关性学习
- 排序学习

## 相关性学习

相关性（Relevance）学习不等于排序学习（LTR, Learning To Rank），相关性只是搜索排序学习中的最主要因素，但是在研究LTR的公开数据集上，用的数据集大部分都是表征相关性的数据集，比如[MSLR-WEB10K](https://paperswithcode.com/dataset/mslr-web10k)（其他常见LTR数据集见[Learning-To-Rank数据集](https://paperswithcode.com/task/learning-to-rank)），相关性档位从0 (不相关) 到 4 (最相关)，反映了query与doc之间，人工标注过程中可以区分出来的相关性。

关于LTR，有一些介绍比较详细的博文，[LTR(Learning to Rank)概述](https://www.xiemingzhao.com/posts/IntroductionofLTR.html)、[排序学习调研](http://xtf615.com/2018/12/25/learning-to-rank/)以及[Elasticsearch Learning to Rank](https://elasticsearch-learning-to-rank.readthedocs.io/en/latest/)。