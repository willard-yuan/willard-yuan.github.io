---
layout: post
title: C++漫谈：从std::move到移动构造函数
categories: [Cpp]
tags: Cpp
---

半年之前，写到的一个代码（示例）：

```cpp
vector<string> vc;
vc.push_back(string_value);
```

因为在搜素场景，耗时毫秒必争。cr的时候，review的同学建议改成：

```cpp
vector<float> vc;
vc.push_back(move(string_value));
```

这样修改后的好处：

- C++ 标准库使用比如vector::push_back等这类函数时，会对参数的对象进行复制，连数据也会复制.这就会造成对象内存的额外创建，本来原意是想把参数push_back进去就行了，通过std::move，可以避免不必要的拷贝操作；
- std::move是将对象的状态或者所有权从一个对象转移到另一个对象，只是转移，没有内存的搬迁或者内存拷贝所以可以提高利用效率，改善性能；
- 对指针类型的标准库对象并不需要这么做；


在看move函数的原理之前，先看下面一个例子：

```cpp
string str1("hello");
string &&str2 = move(str1);
string &&str3 = move(str1);
cout << "str1: " << str1 << endl;
cout << "str2: " << str2 << endl;
cout << "str3: " << str3 << endl;

string str4(str2);
cout << "str1: " << str1 << endl;
string str5(move(str1));
cout << "str1: " << str1 << endl;

打印结果：
str1: hello
str2: hello
str3: hello
str1: hello
str1: 
Program ended with exit code: 9
```

如果对打印结果感到有点迷惑，再回头看std::move的原理：**std::move并不能移动任何东西，它唯一的功能是将一个左值强制转化为右值引用，继而可以通过右值引用使用该值，以用于移动语义。从实现上讲，std::move基本等同于一个类型转换：static_cast(lvalue)**。


具体的函数原型：

```cpp
// 可能的实现， C++14 起
// 返回类型这么写是为了避免转发引用，即保持左值引用不变
templateconstexpr remove_reference_t&&
move(T&& t)  noexcept
{
  return static_cast&&>(t);
}
```


只是将左值强制转化为右值引用，所以前4个结果都打印hello，就不足为怪了。对于第5个打印的结果，move(str1)返回的右值作为参数，就实现了真正的"move"？这里面，真正实现“move”操作的，以上面的例子为例，是string数据类型的移动构造函数。



为了更形象说明这个问题，看个例子：

```cpp
#include <iostream>
#include <cstring>
#include <cstdlib>
#include <vector>
using namespace std;

class Str{
    public:
        char *str;
        Str(char value[])
        {
            cout<<"普通构造函数..."<<endl;
            str = NULL;
            int len = strlen(value);
            str = (char *)malloc(len + 1);
            memset(str,0,len + 1);
            strcpy(str,value);
        }
        Str(const Str &s)
        {
            cout<<"拷贝构造函数..."<<endl;
            str = NULL;
            int len = strlen(s.str);
            str = (char *)malloc(len + 1);
            memset(str,0,len + 1);
            strcpy(str,s.str);
        }
        Str(Str &&s)
        {
            cout<<"移动构造函数..."<<endl;
            str = NULL;
            str = s.str;
            s.str = NULL;
        }
        ~Str()
        {
            cout<<"析构函数"<<endl;
            if(str != NULL)
            {
                free(str);
                str = NULL;
            }
        }
};
int main()
{
    char value[] = "hello world";
    Str s(value);
    vector<Str> vs;
    //vs.push_back(move(s));
    vs.push_back(s);
    cout<<vs[0].str<<endl;
    if(s.str != NULL)
        cout << s.str << endl;
    return 0;
}
```

重点关注上面Str(Str &&s)移动构造函数，在移动构造函数中，原始指针赋值给了类指针变量，只涉及指针操作，不需要拷贝，所以速度快）；同时将原始指针指向空指针。所以在最上面的例子中，最后一个结果，打印出来的空（经过移动构造函数后，原始指针指向空指针）。


> 移动构造函数的参数和拷贝构造函数不同，拷贝构造函数的参数是一个左值引用，但是移动构造函数的初值是一个右值引用。这意味着，移动构造函数的参数是一个右值或者将亡值的引用。也就是说，只用用一个右值，或者将亡值初始化另一个对象的时候，才会调用移动构造函数。而那个move语句，就是将一个左值变成一个将亡值。


参考：[C++移动构造函数以及move语句简单介绍 ](https://www.cnblogs.com/qingergege/p/7607089.html)