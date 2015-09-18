---
layout: post
title: 2015年部分互联网公司笔试综合题及答案
categories: [Life]
---

笔试了几场，对部分题目做了下整理与总结，代码写得比较渣，需要多多训练。

##网易算法工程师岗编程题
- 问题描述:
> 小V今年有n门课，每门都课都有考试。为了拿到奖学金，小V必须让自己的平均年成绩至少为avg，每门课的最终成绩由平时成绩和考试成绩组成，满分为r，现在他知道每门课的平时成绩为ai，如果想要让自己这门课的成绩多拿一分的话，小V必须花bi小时复习，不花时间意味着这门课的考试成绩只能拿0分，平时成绩加考试成绩超过r这么课最终成绩也只能按r计算。为了拿到奖学金，请问小V至少需要花多少时间复习功课？
输入：

```text
输入两行数据，第一行是两个整数：路灯数目n(1<=n<=1000)，街道长度(1<=l<=pow(10, 9))。第二行有n个整数ai(0<=ai<=l)，表示路灯坐标，多个路灯可以在同一个地方，也可以安放在终止点位置。
```

样例输入：

```text
5 5 4
5 2
4 7
3 1
3 2
2 5
```
结果:

```text
4
```

Hint:

```text
花两个小时复习第三门考试拿两分，两个小时复习第四门考试拿一分，这样总平均成绩为(5+4+5+4+2)/4 = 4
```

**解题思路**：对第i门课程，如果要增加1分，需要花费bi个小时的时间，为了耗费的时间最小，我们肯定应该选那些增加1分所用时间短的课程复习。
**代码步骤**：先以bi(也就是以样例中的时间列)为排序基准，对由ai和bi组成的矩阵(二维数组)由小到大排序，然后逐步由花费时间最小的课程开始(也就是排序后的第一行)逐步增加1分，判断总分数是否到了avg*n，到了就停止，否则继续加1分。

下面是自己写的参考代码，没考虑输入边界情况，写得比较渣，思路比较好理解。

```c++
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

- 问题描述:
> V先生有一天工作得很晚，回家的时候要穿过一条长度为l的笔直街道，这条街道上有n个路灯。假设这条街起点为0，终点为l，第i个路灯的坐标为ai。路灯发光能力以正数d来衡量，其中d表示路灯能够照亮的街道上的点与路灯的最远距离，所有路灯发光能力相同。为了让V先生看清回家的路，路灯必须照亮整天街道，又为了节省电力希望找到最小的d是多少？

输入：

```text
输入两行数据，第一行是两个整数：路灯数目n(1<=n<=1000)，街道长度(1<=l<=pow(10, 9))。第二行有n个整数ai(0<=ai<=l)，表示路灯坐标，多个路灯可以在同一个地方，也可以安放在终止点位置。
```

样例输入：

```text
7 15
15 5 3 7 9 14 0
```

结果：

```text
2.5
```

**解题思路**：找出相邻坐标差值中最大的，然后除以2便是最小的d。
**代码步骤**：先进行输入处理，将其保存在`looc`中，再对其进行由小到大的排序，然后计算找出相邻坐标中最大的差值。
下面是自己写的参考代码，没考虑输入边界情况，写得比较渣，思路比较好理解。

```c++
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

## 大众点评数据挖掘岗综合题
上面这道题跟第二天考的大众点评数据挖掘岗综合题的第二题解题思路一样，该题题目为：
> N个为排序的整数，在线性时间内，求这N个数在数轴上相邻两个数之间的最大差值（写出关键算法）

顺便吐槽一下，大众点评Java考得真多，综合题的第一题要求用Java用递归实现阶乘计算，虐得真惨，找完工作了Java搞起。

另外大众点评综合题第三题是贝叶斯公式的运用，题目描述如下：
>某公司有两个部门，A部门有30名女生和24名男生，B部分有12名女生和42名男生。现在从两个部门中挑选出一个女生来安排一次联谊团建，请问这个女生来自A部门的概率为多少？
解：设H1表示A部门，H2表示B部门，P(H1) = P(H2) = 0.5, P(E|H1) = 30/54, P(E|H2) = 12/54;
设E表示女生，则问题转成求P(H1|E)；
P(E) = P(E|H1)P(H1) + P(E|H2)P(H2) = 7/18;
根据条件概率公式有：
P(H1|E) = P(H1)*P(E|H1)/P(E) = 0.5*(30/54)/(7/18) = 0.714

##京东算法岗综合题
问题描述：
> 输入数据仅包含一组测试样例，对于每组测试案例，共有两行输入数据，输入第一行代表要处理的字符串s1(不超过50)，输入第二行代表替换的字符串s2（不超过10）.

样例输入：

```text
You are the best
123
To be NO.1
Yes
Thank you very much
%%%
```

样例输出：

```text
You1234are1234the1234best
ToYesbeYesNO.1
Thank%%%you%%%very%%%much
```

**解题思路**：可以参阅《剑指offer》P46页替换空格那道题。

```c++
#include <iostream>
using namespace std;

char* replace_blank(char str[], char strB[], int len, int lenB)
{
    if(str == NULL || len <= 0) {
        return NULL;
    }
    
    int i = 0, numberBlanks = 0; // cnt为整个字符串的空格个数，size为字符串字符个数
    while(str[i] != '\0') {
        if(str[i] == ' ') {
            ++numberBlanks;
        }
        ++i;
    }
    
    for(i = len-1; i >= 0; --i) {
        if(str[i] != ' ') {
            str[i+numberBlanks*(lenB - 1)] = str[i];
            // 测试输出
            //char tt = str[i];
            //int tmp = i+numberBlanks*(lenB - 1);
            //cout << tmp << ": " << tt << endl;
        }
        else {
            for(int j = 0; j < lenB; j++){
                str[i+numberBlanks*(lenB - 1) - j] = strB[lenB -1 - j];
                // 测试输出
                //char tt = strB[lenB -1 - j];
                //int tmp = i+numberBlanks*(lenB - 1) - j;
                //cout << tmp << ": " << tt << endl;
            }
            --numberBlanks;
        }
    }
    return str;
}

int main(int argc, const char * argv[]) {

    string inputA, inputB;
    getline(cin, inputA);
    getline(cin, inputB);
    int lenA = (int)inputA.length();
    int lenB = (int)inputB.length();
    char strA[lenA];
    char insertedB[lenB];
    strcpy(strA, inputA.c_str());
    strcpy(insertedB, inputB.c_str());
    char* afterInserted = replace_blank(strA, insertedB, lenA, lenB);
    cout << afterInserted << endl;
    
    return 0;
}
```

就这样子，睡了。
