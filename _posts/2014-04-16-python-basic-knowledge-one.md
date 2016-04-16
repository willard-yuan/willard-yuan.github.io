---
layout: post
title: Python基础知识小札一
categories: [Python]
tags: Python
---

这是收录本小子学习Python中学习到的基础知识小札系列，主要方便本小子查阅以及温习。

## strip()

按照[Python Programming](http://www.tutorialspoint.com/python/string_strip.htm)的解释，就是剥去字符串开头或结尾某些特定的字符，默认剥去空格符。

```sh
>>> a='  hello  '
>>> a.strip()
    'hello'
```

## reload()

对于自定义的模块，在修改后需用reload()重新加载。

## items()和iteritems()

items()和iteritems()方法都普遍用于for循环的迭代中，不同的是items()返回的是列表对象，而iteritems()返回的是迭代器对象。两者的用法差不多，但iteritems()的性能更快。在python3中，items()进行了优化，也只返回迭代器对象，所以取消iteritems方法。
