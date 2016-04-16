---
layout: post
title: 通过VPS加深对Linux命令的一些理解
categories: [Linux]
tags: Linux
---

## `ps aux`和`ps -ef`的区别
Linux下显示系统进程的命令ps，最常用的有`ps -ef`和`ps aux`(注意不是`ps aux`)，那么这两者到底有什么区别呢？

>没太大差别，讨论这个问题，要追溯到Unix系统中的两种风格，System Ｖ风格和BSD 风格，ps aux最初用到Unix Style中，而ps -ef被用在System V Style中，两者输出略有不同。现在的大部分Linux系统都是可以同时使用这两种方式的。

资料链接：[Linux下显示进程ps aux和ps -ef的区别](http://www.ipcpu.com/2009/09/linux-ps-aux-ef/)

## 执行`sudo /etc/init.d/* start`方式和`services * start`的区别
`services * start`可以开启服务，比如当前要开启[apache2](http://baike.baidu.com/view/1944398.htm?fr=aladdin)服务器，可以使用`services apache2 start`开启web服务。对于`sudo /etc/init.d/* start`，在查只资料前，错误的以为该命令是用来设置开机启动服务了。

>service 描述中讲到
>
>DESCRIPTION

>service  runs a System V init script in as predictable environment as possible, removing most environment
variables and with current working directory set to /.

>The SCRIPT parameter specifies a System V init script, located in /etc/init.d/SCRIPT.
>
>即service 命令就是调用/etc/init.d/下边的脚本来启动服务，等于直接使用/etc/init.d/* start.

资料链接：[请问执行/etc/init.d/* start方式和services * start 有什么区别](http://bbs.chinaunix.net/thread-4114952-1-1.html)

另外，自己又进一步的查看了init.d/和rc.d/的区别，原来rc.d/这个目录的放的应该就是开机就默认开启的服务。

>总结的说，/etc/init.d这个目录是所有服务的脚本，可以通过执行脚本并且加上参数，开启关闭或者重启对应的服务，rc.d/这个目录的放的应该就是开机就默认开启的服务，并且根据系统不同的运行及划分了不同的rc0.d/这样的目录，ubuntu下面的rc0.d/这样的目录都是直接放在/etc/下面的。

资料链接：[/etc/init.d和/etc/rc.d/init.d的关系](http://luochunfeng163.blog.163.com/blog/static/167009249201256112652880/)

## `lsof -i：port`与`netstat -an|grep:port`的区别
这两条命令是没有什么区别的，都是用来查看本机上哪个port打开了。下面是一个简单的验证过程，首先开启apache2 web服务，web服务在通信是用的是80端口，所以如果开启了apache2，则用`lsof -i：80`或`netstat -an|grep:：80`可以查看到相关信息，关闭apache2服务后，再去查看时应该是什么信息也没有，也就是80端口没开启。

```bash
root@default:/etc/init.d# service apache2 start
[ ok ] Starting web server: apache2.
root@default:/etc/init.d# ps -ef
UID        PID  PPID  C STIME TTY          TIME CMD
root         1     0  0 01:19 ?        00:00:00 init
root         2     1  0 01:19 ?        00:00:00 [kthreadd/46394]
root         3     2  0 01:19 ?        00:00:00 [khelper/46394]
root       102     1  0 01:19 ?        00:00:00 upstart-udev-bridge --daemon
root       113     1  0 01:19 ?        00:00:00 /sbin/udevd --daemon
root       151   113  0 01:19 ?        00:00:00 /sbin/udevd --daemon
root       152   113  0 01:19 ?        00:00:00 /sbin/udevd --daemon
root       222     1  0 01:19 ?        00:00:00 upstart-socket-bridge --daemon
root      1587     1  0 01:19 ?        00:00:00 /usr/sbin/sshd
root      1617     1  0 01:19 ?        00:00:00 /usr/sbin/rsyslogd -c5
root      1662     1  0 01:19 ?        00:00:00 /usr/sbin/saslauthd -a pam -c -m
root      1664  1662  0 01:19 ?        00:00:00 /usr/sbin/saslauthd -a pam -c -m
root      1886     1  0 01:19 ?        00:00:00 /usr/sbin/xinetd -pidfile /var/r
root      1963     1  0 01:19 ?        00:00:00 /usr/sbin/cron
root      1993     1  0 01:19 tty1     00:00:00 /sbin/getty 38400 console
root      1995     1  0 01:19 tty2     00:00:00 /sbin/getty 38400 tty2
root      2178  1587  0 03:40 ?        00:00:00 sshd: root@pts/0
root      2193  2178  0 03:42 pts/0    00:00:00 -bash
root      2463     1  0 05:07 ?        00:00:00 /usr/sbin/apache2 -k start
www-data  2466  2463  0 05:07 ?        00:00:00 /usr/sbin/apache2 -k start
root      2483  2193  0 05:08 pts/0    00:00:00 ps -ef
root@default:/etc/init.d#
```
可以看到apache2服务已经启动了。现在用`lsof -i：80`或`netstat -an|grep:：80`去查看端口是否开放：

```bash
root@default:/etc/init.d# lsof -i:80
COMMAND  PID     USER   FD   TYPE     DEVICE SIZE/OFF NODE NAME
apache2 2463     root    3u  IPv4 3753987071      0t0  TCP *:http (LISTEN)
apache2 2466 www-data    3u  IPv4 3753987071      0t0  TCP *:http (LISTEN)
root@default:/etc/init.d#
```
通过上面可以看到，80端口确实已经打开。执行`service apache2 stop`后80端口关闭：

```bash

root@default:/etc/init.d# service apache2 stop
[ ok ] Stopping web server: apache2 ... waiting .
root@default:/etc/init.d# lsof -i:80
root@default:/etc/init.d#
```
关闭后，可以发现用`lsof -i:80`去查看端口信息时，看不到任何信息。

关于web服务80端口的知识，就总结到这里。
