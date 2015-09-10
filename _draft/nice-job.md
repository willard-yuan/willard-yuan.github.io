nice笔试题回忆及答案

1. 32位unix系统的时间戳在那一年用完？

答：在2038年用完，具体可以参阅[UNIX时间](https://zh.wikipedia.org/wiki/UNIX%E6%97%B6%E9%97%B4)

2. 算术表达式中，对于括号配对，采用哪种数据结构比较合理，并解释一下原因

答：采用栈结构比较合理，在顺序遍历括号的时候，每遇到一个左括号，将其压入栈空间中，在遇到右括号的时候，弹出栈顶元素，即为与该右括号配对的括号。

3. http属于OSI网络模型中的哪一层？SSL属于OSI网络模型中的哪一层？

4. 代码正误判断题，有a,b,c三个代码片段，a,b两个很简单，我觉得是没有错误的，c片段中有一个函数，是用char指针为字符串分配空间的，如下：
```c++
char* p = (char*)malloc(100);
```
我一般都很少这么用，习惯的用法都是`char* p = (char*)malloc(100*sizeof(char))`，然后认为这里错了，回来查了一下，这样分配是可以的，char类型占一个字节，所以两者的结果一样，都是为其分配100个字节的空间，所以估计是c代码片段里面其他地方有问题。

5. 代码补充填空题，对两个有序链表进行合并。
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

6. 给出一段代码，让你给出输出的结果，并且会出现什么问题，为什么？

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
6. 链表反转题。

此外还考察了http中post和get的作用，测试岗位还有用linux命令对数组进行排序的。
