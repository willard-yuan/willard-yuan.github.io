---
layout: post
title: 机器学习：KD-Tree常见教材的一个示例说明
categories: [Hive]
tags: Hive
---

KD-Tree是一种对空间进行分割的方法，使得在搜索阶段可以缩小空间搜索的范围，因而它是一种典型的近似最近邻搜索方法(ANN search)。在前一篇[图像检索：基于内容的图像检索技术](http://yongyuan.name/blog/cbir-technique-summary.html)文章里，曾稍微介绍过（面向图像检索的）基于树的搜索方法和哈希搜索方法的优劣势。这些天，入手了一本之前看过了电子版的[统计学习方法]()纸质版一书，得以在地铁上打发无聊的时光。前几日，老汤的妹子也在刷此书，问到了书中在讲解KD-Tree时举的一个例子，这个例子具体如下：

> 给定一个二维空间的数据集

关于KD-Tree介绍的资料网上也非常的多，这里不再赘述。

## KD-Tree

### hive的hive.exec.parallel

hive的hive.exec.parallel：该参数控制同一个SQL中不同job是否可以同时运行，字面意思比较显而易见，默认为false。关于该参数的说明可以阅读[hive的hive.exec.parallel参数说明](hive的hive.exec.parallel参数说明)。

### mapred.reduce.tasks

mapred.reduce.tasks：这个参数如果指定了，hive就不会用它的estimation函数来自动计算reduce的个数，而是用这个参数来启动reducer，默认是-1。更详细的介绍说明参阅[Hive中reduce个数设定](http://oopsoutofmemory.github.io/hive/2014/11/19/hive-zhong-reduce-ge-shu-she-ding/)。

### collect_set

工作中遇到的一个数据表需求，对于某订单，可能被好几条策略命中，其中要解决的一点是需要将这几条命中的策略合并在一起，最终发现collect_set这个函数刚好能完成此功能。collect_set返回一个消除了重复元素的对象集合, 其返回值类型是array。具体可以参考[Hive collect_set函数](http://my.oschina.net/jackieyeah/blog/679476)。

### concat_ws

从数据库里取N个字段，然后组合到一起用“,”分割显示。

```mysql
mysql> SELECT CONCAT_WS(",","First name","Second name","Last Name");
       -> 'First name,Second name,Last Name'
mysql> SELECT CONCAT_WS(",","First name",NULL,"Last Name");
       -> 'First name,Last Name'
```

### str_to_map

将string按设定的分割符进行分割并映射成键值对的形式。

```mysql
select str_to_map('a:1,b:22', ',', ':')
from tmp.tmp_test;
```

上面得到的结果为`{"a":"1","b":"2"}`。当然，我们还可以通过上式获得某个键的值，比如`select str_to_map('a:1,b:22', ',', ':')\[‘a’\]...`。

## SQL相关

### left join

SQL中left join：左联接，返回包括左表中的所有记录和右表中联结字段相等的记录，更多关于left join、right join以及inner join的区别可以阅读[sql之left join、right join、inner join的区别](http://www.cnblogs.com/pcjim/articles/799302.html)。

### union all

SQL union和union all的区别：union操作符选取不同的值，而union all允许重复的值，具体可以阅读[SQL UNION 和 UNION ALL 操作符](http://www.w3school.com.cn/sql/sql_union.asp)。