---
layout: post
title: 2015年nice西安z站笔试题回忆及答案
categories: [面试]
---

>炮灰之下，且笔试且总结

9月10号晚nice在西电宣讲，随后进行了笔试，时间1个小时，下面是当晚回来后做的笔试回忆及总结。

1). 32位unix系统的时间戳在那一年用完？

答：在2038年用完，具体可以参阅[UNIX时间](https://zh.wikipedia.org/wiki/UNIX%E6%97%B6%E9%97%B4)，这个计算有点复杂。

2). 算术表达式中，对于括号配对，采用哪种数据结构比较合理，并解释一下原因。

答：采用栈结构比较合理，在顺序遍历括号的时候，每遇到一个左括号，将其压入栈空间中，在遇到右括号的时候，弹出栈顶元素，即为与该右括号配对的括号。

3). http属于OSI网络模型中的哪一层？SSL属于OSI网络模型中的哪一层？

答：http属于OSI网络模型中的应用层，可以阅读[TCP/IP协议族](https://zh.wikipedia.org/wiki/TCP/IP%E5%8D%8F%E8%AE%AE%E6%97%8F)、[HTTP协议详解](http://blog.csdn.net/gueter/article/details/1524447)、[TCP/IP详解学习笔记（13）-- TCP连接的建立与终止](http://www.cnblogs.com/newwy/p/3234536.html)、[TCP/IP 相关知识点与面试题集](http://www.cnblogs.com/obama/p/3292335.html)这几个相关知识。SSL有认为属于OSI模型传输层和应用层之间的，比如[ssl工作在OSI的哪一层 ](http://blog.chinaunix.net/uid-14488638-id-2802670.html)，也有认为是属于传输层的：

>In the OSI model it's less defined because encryption is in Layer 6 and session control is in Layer 5. HTTPS (layer 7) uses SSL and SSL (Layers 5/6) uses TCP (Layer 4). SSL negotiation actually starts in Layer 5 and the encrypted tunneling kicks in after the SSL handshake is successful, so I would call SSL an OSI Layer 5 protocol.

>According to the AIO, 6th edition (p. 531), SSL and TLS work at the transport layer of the OSI model. 

>According to CISSP for Dummies (p. 259), "SSL operates at the Transport Layer (Layer 4) of the OSI model..."

上面讨论的内容可以阅读[SSL is on a Transport Layer or Application Layer](http://www.techexams.net/forums/isc-sscp-cissp/101590-ssl-transport-layer-application-layer.html)。

4). 代码正误判断题，有a,b,c三个代码片段，a,b两个很简单，我觉得是没有错误的，c片段中有一个函数，是用char指针为字符串分配空间的，如下：
```c++
char* p = (char*)malloc(100);
```
我一般都很少这么用，习惯的用法都是`char* p = (char*)malloc(100*sizeof(char))`，然后认为这里错了，回来查了一下，这样分配是可以的，char类型占一个字节，所以两者的结果一样，都是为其分配100个字节的空间，所以估计是c代码片段里面其他地方有问题。

5). 代码补充填空题，对两个有序链表进行合并。
```c++
struct listNode{
    int value;
    listNode* next;
};

listNode* merge(listNode* L1, listNode* L2){
    if(L1 == NULL || L2 == NULL)
        return ____? _____:______
}
......(后面还很多）
```
看到第一个填空就有点懵，我明白只要其中有一个链表是空的，则放回另外一个链表头结点即可，这里突然把这两个合到一起写，弄了个`__?__:__`这样的判断，没整明白该怎么填。一般我都习惯把它们拆开来写，即：

```c++
listNode* merge(listNode* L1, listNode* L2){
    if(L1 == NULL)
      return L2;
    else if(L2 == NULL)
      return L1;
}
```
在《剑指offer》中，两个有序链表的合并，采用的是如下递归的方式完成的，即：

```c++
listNode* merge(listNode* pHead1, listNode* pHead2){
    if(pHead1 == NULL)
        return pHead2;
    else if (pHead2 == NULL)
        return pHead1;
    listNode* pMergedHead = NULL;
    if(pHead1->value < pHead2->value){
        pMergedHead = pHead1;
        pMergedHead->next = merge(pHead1->next, pHead2);
    }else{
        pMergedHead = pHead2;
        pMergedHead->next = merge(pHead1, pHead2->next);
    }
    return pMergedHead;
}
```
上面采用这种递归的方式代码比较简洁，很容易理解，递归方式的一个比较大的缺点是有可能导致重复的计算，比如斐波那契书的计算，采用递归的方式，会导致很多有些值在重复计算。所以考虑速度方面的优化时，可以把它改成循环的方式。

6). 给出一段代码，让你给出输出的结果，并且会出现什么问题，为什么？

```c++
void test(){
    long i;
    long a[16];
    for (i = 0; i <= 17, ++1){
      a[i] = 0;
      fprint("%d", a[i]);
    }
}
```
上面代码只是个大概，具体记得不是很清楚了，这里考察的是数据的越界访问，关于数据的越界访问，从我自己分别在Windows VS里面和OS X Xcode里面写过的程序来看，VS里面数据越界访问通常会在运行的时候，到越界那里后会直接报错了，而在Xcode里面一般给出的都是随机数，这两个平台下的编译器不同，VS里面用的是intel的编译器，而Xcode或者说OS X下，默认是Clang编译器。所以我在数组越界访问的时候，具体会出现什么结果，这个还应该看你有那个的什么编译器。
7). 链表反转题，对一个链表进行翻转，语言任意，数据结构自己定义。

C++参考答案：

```c++
struct listNode{
    int value;
    listNode* Next;
}

listNode* reverseList(listNode* pHead){
    listNode* reverseHead = NULL;  //用于保存反转后的链表头结点
    listNode* pNode = pHead;  //当前结点
    listNode* preNode = NULL;  //前一个结点
    while(pNode != NULL){
        listNode* pNext = pNode->Next;  //下一个结点
        while(pNext == NULL)
            reverseHead = pNode;
        pNext->Next = preNode;
        preNode = pNode;
        pNode = pNext;
    }
    return  reverseHead;
}
```
此外还考察了http中post和get的作用，测试岗位还有用linux命令对数组进行排序的。

从上面的7道题可以看出，出题者非常的注重基础，其中又非常的注重考查链表方面的知识，这些链表的题目都可以在《剑指offer》上找得到原题或者是身影，对于基本的，比如从尾到头打印链表、链表中的倒数第k个节点、反转链表、合并有序链表、查找两链表的公共节点这几个，个人觉得后面一定还会再出现。不过，整个题里面，完全没见到二叉树的身影，蜻蜓点水的点到了栈结构。

笔试的人实在太多了，1000多来人参加笔试，招聘的人数大概70来左右吧。这几天凡是来西安宣讲的，场场爆满，去得稍微晚了点，进都进不去了。我承认我是去试水的，但笔试下来确实发现了很多的问题，其中最主要的一个是，敲得太少，对这样笔试没有进行过专门的练习。

```c++
//  V先生有一天工作得很晚，回家的时候要穿过一条长度为l的笔直街道，这条街道上有n个路灯。假设这条街起点为0，终点为l，第i个路灯的坐标
//  为ai。路灯发光能力以正数d来衡量，其中d表示路灯能够照亮的街道上的点与路灯的最远距离，所有路灯发光能力相同。为了让V先生看清回家的
//  路，路灯必须照亮整天街道，又为了节省电力希望找到最小的d是多少？
//
//  输入：
//  输入两行数据，第一行是两个整数：路灯数目n(1<=n<=1000)，街道长度(1<=l<=pow(10, 9))。第二行有n个整数ai(0<=ai<=l)，表示路灯
//  坐标，多个路灯可以在同一个地方，也可以安放在终止点位置。
//
//  样例输入：
//  7 15
//  15 5 3 7 9 14 0
//  结果：2.5

#include <iostream>
#include <vector>

using namespace std;

int main(int argc, const char * argv[]) {
    
    int numBulb, distance;
    cin >> numBulb >> distance;
    
    vector<int> looc(numBulb);
    
    for(int i = 0; i < numBulb; i++){
        int tmp;
        cin >> tmp;
        looc[i] = tmp;
    }
    
    sort(looc.begin(), looc.end(), less<int>());
    int maxDis = 0;
    for(int i = 0; i < numBulb; i++){
        int tmp = looc[i+1]-looc[i];
        if(tmp > maxDis)
            maxDis = tmp;
    }
    
    cout << maxDis/2.0 << endl;
    
    return 0;
}
```
```c++
//  小V今年有n门课，每门都课都有考试。为了拿到奖学金，小V必须让自己的平均年成绩至少为avg，每门课的最终成绩由平时成绩和考试成绩组成，满分为r，现在
//  他知道每门课的平时成绩为ai，如果想要让自己这门课的成绩多拿一分的话，小V必须花bi小时复习，不花时间意味着这门课的考试成绩只能拿0分，平时成绩加
//  考试成绩超过r这么课最终成绩也只能按r计算。
//  为了拿到奖学金，请问小V至少需要花多少时间复习功课？
//  输入：
//  输入两行数据，第一行是两个整数：路灯数目n(1<=n<=1000)，街道长度(1<=l<=pow(10, 9))。第二行有n个整数ai(0<=ai<=l)，表示路灯
//  坐标，多个路灯可以在同一个地方，也可以安放在终止点位置。
//
//  样例输入：
//  5 5 4
//  5 2
//  4 7
//  3 1
//  3 2
//  2 5
//  结果：4
//  Hint
//  花两个小时复习第三门考试拿两分，两个小时复习第四门考试拿一分，这样总平均成绩为(5+4+5+4+2)/4 = 4

#include <iostream>
#include <vector>
#include <algorithm>
#include <numeric>

using namespace std;

int main(int argc, const char * argv[]) {
    
    int n, r, avg;
    cin >> n >> r >> avg;
    
    vector<int> A(n);
    vector<int> B(n);
    
    for(int i = 0; i < n; i++){
        int tmpAi, tmpBi;
        cin >> tmpAi >> tmpBi;
        A[i] = tmpAi;
        B[i] = tmpBi;
    }
    
    vector<size_t> indexes(n);
    size_t nn(0);
    generate(begin(indexes), end(indexes), [&]{return nn++;});
    sort(begin(indexes), end(indexes), [&](int i1, int i2){return B[i1] < B[i2];});
    vector<int> sortedA(n);
    vector<int> sortedB(n);
    for(int i = 0; i < n; i++){
        sortedB[i] = B[indexes[i]];
        sortedA[i] = A[indexes[i]];
    }
    //A.clear();
    //B.clear();
    
    int sum = accumulate(sortedA.begin(), sortedA.end(), 0);
    int time = 0;
    int i = 0;
    while((sum < avg*n) && (i < n)){
        int addScores = 0;
        while((sortedA[i] + addScores) < 5 && sum < avg*n){
            sum = sum + 1;
            time = time + sortedB[i];
            ++addScores;
        }
        ++i;
    }
    
    cout << time << endl;
    
    return 0;
}
```
