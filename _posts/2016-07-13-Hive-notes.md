---
layout: post
title: Hive与SQL零碎知识汇总
categories: [Hive]
tags: Hive
---

## Hive相关

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