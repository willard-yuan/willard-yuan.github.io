---
layout: post
title: 环境配置：Ubuntu14.04安裝postgresql
categories: [Linux]
tags: Linux
---

在Ubuntu14.04下要用到postgresql,所以查了一下安装的资料:[How To Install and Use PostgreSQL on Ubuntu 14.04](https://www.digitalocean.com/community/tutorials/how-to-install-and-use-postgresql-on-ubuntu-14-04).安装教程安装完后,运行应用,发觉报下面错误:

```sh
Error: You need to install postgresql-server-dev-X.Y for building a server-side extension or libpq-dev for building a client-side application.
```

根据给的错误谷歌了一下，发觉下面这个答案很好:

```text
Looks like you are on Linux.

Try installing libpq-dev for Debian/Ubuntu, or postgresql-devel for RHEL systems.
```
按照找个安装后，再运行应用，可行.