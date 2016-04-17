---
layout: post
title: 面试整理：最小的k个数
categories: [Cpp]
tags: Cpp
---

这两天看《剑指offer》一书第30题碰到的一道题目：输入n个整数，找出其中最小的n个整数，例如输入4，5，1，6，2，7，3，8这八个数，则其中最小的4个数是1，2，3，4。这道题目之前在面试阿里实习的时候被面试官问道过，当时除了想到罗普大众的排序方法外，没想到其他的好方法。后来面试完自己下面查了一下资料，了解了通过维持一个大小为k的数据容器的方法，还去了解了一下最大堆和最小堆的原理。不过没有具体地去编码，这次练下手，顺带学习一下对set和multiset的认识。

这道题目公认的解法如上面提到的，通过维持一个大小为k的数据容器，在刚开始的时候，先从这n个数里面挑出前k个数放入到数据容器里，假定该容器自带有排序的功能，那么对于剩下的(n-k)个数，我们可以分别将这(n-k)个数与容器中的最大数挨个的进行比较，如果比容器中的最大数要小，则进来，相应的为了始终维持容器中数目为k个，容器中原来最大的就要从容器中移出来。类比一个很简单的例子，比如有一个小黑屋，小黑屋只能容纳k个人，要使这个小黑屋里的人的升高比外面的都是最矮的，那就把黑屋里升高最高的那个作为标杆，比标杆还矮，进来，标杆移除去，重新找标杆，依次循环即可。

上面每次都需要找到k个整数中的最大数，并且在比对的数小于最大数添加进来之前要移除最大数，所以可以采用最大堆。同时还可以用红黑树来实现上述容器，在STL中set,map,multiset,multimap都是基于红黑树(RB-tree)实现的(顺便补充：hashmap,hashset,hashmultiset,hashmultimap是基于hash table)。所以可以采用STL中的multiset来作为该数据容器。

关于set和multiset的区别及用法，[STL之五：set/multiset用法详解][2]这篇文章总结得很不错。下面这张图很清楚的给出了set和multiset的区别：
![][image-1]
> set、multiset都是集合类，差别在与set中不允许有重复元素，multiset中允许有重复元素。
了解了这些，便可以按照按照书上的写出如下解法：

```c++
//
//  main.cpp
//  getLeastNumbers
//
//  Created by willard on 15/7/4.
//  Copyright (c) 2015年 wilard. All rights reserved.
//

#include <iostream>
#include <set>
#include <vector>
using namespace std;

typedef multiset<int, greater<int> > itSet;
typedef multiset<int, greater<int> >::iterator setIterator;

void getLeastNumbers(const vector<int> &data, itSet &leastNumbers, int k){
    leastNumbers.clear();
    if(k < 1 || data.size() < k) return;
    for(vector<int>::const_iterator iter = data.begin(); iter != data.end(); iter++){
        if(leastNumbers.size() < k){
            leastNumbers.insert(*iter);
        }else{
            setIterator iterGreatest = leastNumbers.begin();
            if(*iter < *iterGreatest){
                leastNumbers.erase(iterGreatest);
                leastNumbers.insert(*iter);
            }
        }
    }
}

int main(int argc, const char * argv[]) {
    // insert code here...
    std::cout << "Hello, World!\n";

    int A[] = {2, 1, 4, 2, 5, 1, 6, 9, 3, 4};
    vector<int> dataset(A, A+10);
    itSet leastNumbersSet;
    int k = 5;

    getLeastNumbers(dataset, leastNumbersSet, k);

    for(setIterator i = leastNumbersSet.begin(); i != leastNumbersSet.end(); ++i)
        cout<< *i << " ";
    cout << endl;

    return 0;
}
```

上面在定义multiset是采用的是`greater`，也就是容器的数据是从大到小排列的，默认是less从小到大排列的。所以在数据容器中寻找最大迭代对象时用的是`leastNumbersSet.begin()`。其余部分的都极好理解，就酱紫。

[2]:	http://blog.csdn.net/longshengguoji/article/details/8546286

[image-1]:	http://img.my.csdn.net/uploads/201301/27/1359267085_6365.png
