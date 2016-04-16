---
layout: post
title: swift学习笔记（1）
categories: [Swift]
tags: Swift
---

前几天WWDC上库克发布了swift变成语言，网上关于swift褒贬不一。不管对新发布的苹果开发语言如何，本小子乐意一学，有moneny也入手一台苹果笔记本去搞下ios开发。

swift发布的当天，第一手关于swift权威的介绍与详解，当然是苹果在官网发布的《The Swift Programming Language》，目前该书在github上已有[童鞋](https://github.com/numbbbbb/the-swift-programming-language-in-chinese)开始翻译了，[《Swift 编程语言》](http://numbbbbb.github.io/the-swift-programming-language-in-chinese/)。翻译得还挺不错的，就以这本官方教程作为学习的笔记吧。

## 数据类型

任何编程语言，都有自己的数据类型。

### 变量与常量

swift用`let`来对常量进行类型申明，跟别的编程语言一样，常量只能赋值一次；变量用`var`关键字来申明紧随其后的是一个变量。

```text
var myVariable = 42
myVariable = 50
let myConstant = 42
```
上面申明了一个变量myVariable，从赋值的结果来看，myVariable是一个整型变量。这里在申明时类型是可选的，编译器会自动推断出myVariable属于整型数据。用`let`来申明myConstant是一个常量，在申明完后，不能再对myConstant进行赋值。这里myConstant是一个整型常量，如果我们要将其设置为Double型呢？这时，需要在变量后面对类型进行申明，用冒号分割，比如：

```text
let implicitInteger = 70
let implicitDouble = 70.0
let explicitDouble: Double = 70
```
上面explicitDouble被申明为Double型。如果要申明一个Float型的常量，可以这样申明：

```text
let explicitFloat:Float=4
```
swift变量的类型永远不会被隐式的转换为其他类型，如果要对其进行类型转换的话，只能显式完成，比如：

```text
let label = "The width is"
let width = 94
let widthLabel = label + String(width)
```
如果要打印"The width is 94",则应该将width整型常量转换为String类型，即`String()`。
此外还可以用`\()`来完成字符转换，比如：

```text
let apples = 3
let oranges = 5
let appleSummary = "I have \(apples) apples."
let fruitSummary = "I have \(apples + oranges) pieces of fruit."
```

### 数组与字典

本小子觉得swift里的数组和字典和Python里的数组和字典没神马区别。所以看这个毫无压力。

```text
var shoppingList = ["catfish", "water", "tulips", "blue paint"]
shoppingList[1] = "bottle of water"

var occupations = [
    "Malcolm": "Captain",
    "Kaylee": "Mechanic",
]
occupations["Jayne"] = "Public Relations"
```
木有Macbook，对上面的代码没法直接测试，不过本小猜swift数组的索引起始值应该是从0开始的，所以上面运行后的结果是：

```text
shoppingList = ["catfish", "bottle of water", "tulips", "blue paint"]
occupations = ["Malcolm": "Captain","Kaylee": "Mechanic","Jayne":"Public Relations",
]
```

要创建空字典或空数组，使用下面方法进行初始化。

```text
let emptyArray = String[]()
let emptyDictionary = Dictionary<String, Float>()
```
肿麽看着`String[]()`后面的`()`还别扭。上面在对字典进行初始化是，key是String型，value是Float型。

官方教程里说，如果类型信息可以被推断出来，则可以用`[]`来创建空数组，`[:]`来创建空字典。

```text
shoppingList = []
```

## 控制语句

所有的编程语言都有自己的控制语句。可以使用`if-else`,`switch`进行条件操作，用`for-in`,'for','while','do-while'进行循环控制，判断语句的括号可以省略，但后面的花括号是必须的。

```text
let individualScores = [75, 43, 103, 87, 12]
var teamScore = 0
for score in individualScores {
    if score > 50 {
        teamScore += 3
    } else {
        teamScore += 1
    }
}
teamScore
```

上面`for score in individualScores`跟Python里的for循环用法一样，`score>50`的括号省略掉了。上面teamScore运行出来的结果应该是11。

附:</br>
[1]. [VM10装Mac OS X 10.9.3及更新到Mac OS X 10.10](http://wang9262.github.io/blog/2014/06/06/install-mac-os-x-10-dot-10-by-vmare/)</br>
[2]. [SwiftChina](http://swift.sh/)</br>
[3]. [Swift课堂](http://www.swiftv.cn/school)
