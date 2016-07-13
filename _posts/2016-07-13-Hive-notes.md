---
layout: post
title: Hive零碎知识汇总
categories: [Hive]
tags: Hive
---

1. hive的hive.exec.parallel：该参数控制同一个SQL中不同job是否可以同时运行，字面意思比较显而易见，默认为false。关于该参数的说明可以阅读[hive的hive.exec.parallel参数说明](hive的hive.exec.parallel参数说明)。
2. mapred.reduce.tasks：这个参数如果指定了，hive就不会用它的estimation函数来自动计算reduce的个数，而是用这个参数来启动reducer，默认是-1。更详细的介绍说明参阅[Hive中reduce个数设定](http://oopsoutofmemory.github.io/hive/2014/11/19/hive-zhong-reduce-ge-shu-she-ding/)。
3. SQL中left join：左联接，返回包括左表中的所有记录和右表中联结字段相等的记录，更多关于left join、right join以及inner join的区别可以阅读[sql之left join、right join、inner join的区别](http://www.cnblogs.com/pcjim/articles/799302.html)。
4. SQL union和union all的区别：union操作符选取不同的值，而union all允许重复的值，具体可以阅读[SQL UNION 和 UNION ALL 操作符](http://www.w3school.com.cn/sql/sql_union.asp)。