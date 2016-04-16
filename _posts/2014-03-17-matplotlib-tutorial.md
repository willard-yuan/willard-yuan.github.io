---
layout: post
title: Matplotlib指南
categories: [Python]
tags: Python
---

>本小子最近这几天在做一个关于Python科学计算方面的讲稿，做完Python简介部分后，核心的关于科学计算部分烦难了。编程语言这东西，讲起来着实不是一件好差事。想当年本小子大一上C课程的时候，叫我们C的老师绝对是催眠的好手，一堂课还没上到半个小时，下面听趴一片，那时绝对的NB。所以，本小子想通过一些具体的实例，结合实验室研究方向做一些Python方面的介绍与演示。Python科学计算这部分，其实自己了解得不多，而且国内关于这方面的中文资料更是少之又少。今天在查Matplotlib模块时，发觉了一个不错的译文资料。这么好的译文资料，竟然雪藏了。那个Python八荣八耻最后一条怎么说来着，“以总结分享为荣”，本小子偷偷地把它扒过来了，又犯罪了，囧。不过，本小子还是需要再一次的郑重申明，本译文来自[\[Reverland的知行阁\]](http://reverland.org/python/2012/09/07/matplotlib-tutorial/#ipython--pylab)

翻译自:[Matplotlib tutorial](http://www.loria.fr/~rougier/teaching/matplotlib/)Nicolas P. Rougier - Euroscipy 2012

这个教程基于可以从[scipy lecture note](http://scipy-lectures.github.com/)得到的 Mike Müller的[教程](http://scipy-lectures.github.com/intro/matplotlib/matplotlib.html)。

源代码可从[这里](http://www.loria.fr/~rougier/teaching/matplotlib/matplotlib.rst)获得。图像在[figures](http://www.loria.fr/~rougier/teaching/matplotlib/figures/)文件夹内，所有的脚本位于[scripts](http://www.loria.fr/~rougier/teaching/matplotlib/scripts/)文件夹。

所有的代码和材料以[Creative Commons Attribution 3.0 United States License (CC-by)](http://creativecommons.org/licenses/by/3.0/us)发布。

特别感谢Bill Wing和Christoph Deil的检查和校正。

## 引言

matplotlib大概是被使用最多的二维绘图Python包。它不仅提供一个非常快捷的用python可视化数据的方法，而且提供了出版质量的多种格式图像。我们将要探索matplotlib包含最常见情况的交互模式。

### Ipython 和 pylab模式

[IPython](http://ipython.org/)是一个增强的Python交互shell，它拥有很多有趣的特性包括被命名的输入与输出，可使用shell命令，增强的调试和许多其它特性。当我们在命令参数中用`-pylab`(自从IPython0.12版变成`--pylab`),它容许交互的matplotlib会话有像Matlab/Mathematica样的功能。

### pylab

pylab提供了一个针对matplotlib面向对象绘图库的程序界面。它模仿Matlab(TM)开发。因此，pylab大部分的绘图命令和参数和Matlab(TM)相似。重要的命令被交互示例解释。

## 简单绘图

在这一部分，我们想在同一个图片中绘制正弦和余弦函数。从默认设置开始，我们将一步一步地改进使它看上去更棒。

首先获得正弦和余弦函数的数据：

```python
from pylab import *

X = np.linspace(-np.pi, np.pi, 256,endpoint=True)
C,S = np.cos(X), np.sin(X)
```

X现在是一个numpy数组，包含从-π到+π(包含π)等差分布的256个值。C是正弦(256个值)，S是余弦(256个值)。

运行这个例子，你可以在IPython交互会话键入它们

```bash
[lyy@arch ~]$ ipython2 --pylab
Python 2.7.3 (default, Apr 24 2012, 00:00:54)
Type "copyright", "credits" or "license" for more information.

IPython 0.13 -- An enhanced Interactive Python.
?         -> Introduction and overview of IPython's features.
%quickref -> Quick reference.
help      -> Python's own help system.
object?   -> Details about 'object', use 'object??' for extra details.

Welcome to pylab, a matplotlib-based Python environment [backend: Qt4Agg].
For more information, type 'help(pylab)'.
```
或者你可以下载每个示例然后使用普通的的python运行它：

```bash
$ python exercice_1.py
```
你可以点击相应图片的获得每一步的源码。

### 使用默认

[![using defaults](http://www.loria.fr/~rougier/teaching/matplotlib/figures/exercice_1.png)](http://www.loria.fr/~rougier/teaching/matplotlib/scripts/exercice_1.py)

matplotlib有一套允许定制各种属性的默认设置。你可以几乎控制matplotlib中的每一个默认属性：图像大小，每英寸点数，线宽，色彩和样式，子图(axes)，坐标轴和网格属性，文字和字体属性，等等。虽然matplotlib的默认设置在大多数情况下相当好，你却可能想要在一些特别的情形下更改一些属性。

```python
from pylab import *

X = np.linspace(-np.pi, np.pi, 256,endpoint=True)
C,S = np.cos(X), np.sin(X)

plot(X,C)
plot(X,S)

show()
```
### 示例默认

[![using defaults](http://www.loria.fr/~rougier/teaching/matplotlib/figures/exercice_2.png)](http://www.loria.fr/~rougier/teaching/matplotlib/scripts/exercice_2.py)

在以下脚本中，我们示例(并注释)所有影响图像外观的图像设定。这些设定被显式地设置成它们的默认值，但是现在你可以交互地尝试这些值来探索它们的作用(参考之后的[线条属性](#)和[线条样式](#))。

```python
# Import everything from matplotlib (numpy is accessible via 'np' alias)
from pylab import *

# Create a new figure of size 8x6 points, using 80 dots per inch
figure(figsize=(8,6), dpi=80)

# Create a new subplot from a grid of 1x1
subplot(1,1,1)

X = np.linspace(-np.pi, np.pi, 256,endpoint=True)
C,S = np.cos(X), np.sin(X)

# Plot cosine using blue color with a continuous line of width 1 (pixels)
plot(X, C, color="blue", linewidth=1.0, linestyle="-")

# Plot sine using green color with a continuous line of width 1 (pixels)
plot(X, S, color="green", linewidth=1.0, linestyle="-")

# Set x limits
xlim(-4.0,4.0)

# Set x ticks
xticks(np.linspace(-4,4,9,endpoint=True))

# Set y limits
ylim(-1.0,1.0)

# Set y ticks
yticks(np.linspace(-1,1,5,endpoint=True))

# Save figure using 72 dots per inch
# savefig("exercice_2.png",dpi=72)

# Show result on screen
show()
```
### 更改色彩和线宽

[![using defaults](http://www.loria.fr/~rougier/teaching/matplotlib/figures/exercice_3.png)](http://www.loria.fr/~rougier/teaching/matplotlib/scripts/exercice_3.py)

首先，我们想要余弦是蓝色而正弦是红色，它们的线条都稍厚一点。我们将也稍微更改图片大小来使它更宽一点。

```python
figure(figsize=(10,6), dpi=80)
plot(X, C, color="blue", linewidth=2.5, linestyle="-")
plot(X, S, color="red",  linewidth=2.5, linestyle="-")
```
### 设置边界

[![using defaults](http://www.loria.fr/~rougier/teaching/matplotlib/figures/exercice_4.png)](http://www.loria.fr/~rougier/teaching/matplotlib/scripts/exercice_4.py)

当前的图像边界有点太紧了一点，而且我们想要预留一点空间使数据点更清晰。

```python
xlim(X.min()*1.1, X.max()*1.1)
ylim(C.min()*1.1, C.max()*1.1)
```

### 设置刻度

[![using defaults](http://www.loria.fr/~rougier/teaching/matplotlib/figures/exercice_5.png)](http://www.loria.fr/~rougier/teaching/matplotlib/scripts/exercice_5.py)

当前刻度并不理想，因为它们不显示正余弦中我们感兴趣的值(+/-π,+/-π/2)。我们将更改它们让它们只显式这些值。

```python
xticks( [-np.pi, -np.pi/2, 0, np.pi/2, np.pi])
yticks([-1, 0, +1])
```

### 设置刻度标签

[![using defaults](http://www.loria.fr/~rougier/teaching/matplotlib/figures/exercice_6.png)](http://www.loria.fr/~rougier/teaching/matplotlib/scripts/exercice_6.py)

刻度已经放置合适但是他们的标签并不很清楚，我们可以猜出3.142是π但是最好让它更直接。当我们设置刻度值时，我们也可以在第二个参数列表中提供相应的标签。注意，我们用latex获得更好渲染的标签。

```python
xticks([-np.pi, -np.pi/2, 0, np.pi/2, np.pi],
       [r'$-\pi$', r'$-\pi/2$', r'$0$', r'$+\pi/2$', r'$+\pi$'])

yticks([-1, 0, +1],
       [r'$-1$', r'$0$', r'$+1$'])
```

### 移动轴线(spine)

[![using defaults](http://www.loria.fr/~rougier/teaching/matplotlib/figures/exercice_7.png)](http://www.loria.fr/~rougier/teaching/matplotlib/scripts/exercice_7.py)

轴线(spines)是连接刻度标志和标示数据区域边界的线。它们现在可以被放置在任意地方，它们在子图的边缘。我们将改变这点，因为我们想让它们位于中间。因为一共有四个轴线(上/下/左/右)。我们将通过将它们的颜色设置成None，舍弃位于顶部和右部轴线。然后我们把底部和左部的轴线移动到数据空间坐标中的零点。

```python
ax = gca()
ax.spines['right'].set_color('none')
ax.spines['top'].set_color('none')
ax.xaxis.set_ticks_position('bottom')
ax.spines['bottom'].set_position(('data',0))
ax.yaxis.set_ticks_position('left')
ax.spines['left'].set_position(('data',0))
```

### 添加图例

[![using defaults](http://www.loria.fr/~rougier/teaching/matplotlib/figures/exercice_8.png)](http://www.loria.fr/~rougier/teaching/matplotlib/scripts/exercice_8.py)

让我们在图片左上角添加一个图例。这仅仅需要向plot命令添加关键字参数label(之后将被图例框使用)。

```python
plot(X, C, color="blue", linewidth=2.5, linestyle="-", label="cosine")
plot(X, S, color="red",  linewidth=2.5, linestyle="-", label="sine")

legend(loc='upper left')
```

### 注解某些点

[![using defaults](http://www.loria.fr/~rougier/teaching/matplotlib/figures/exercice_9.png)](http://www.loria.fr/~rougier/teaching/matplotlib/scripts/exercice_9.py)

让我们现在使用annotate命令注解一些我们感兴趣的点。我们选择2π/3作为我们想要注解的正弦和余弦值。我们将在曲线上做一个标记和一个垂直的虚线。然后，使用annotate命令来显示一个箭头和一些文本。

```python
t = 2*np.pi/3
plot([t,t],[0,np.cos(t)], color ='blue', linewidth=2.5, linestyle="--")
scatter([t,],[np.cos(t),], 50, color ='blue')

annotate(r'$sin(\frac{2\pi}{3})=\frac{\sqrt{3}}{2}$',
		 xy=(t, np.sin(t)), xycoords='data',
		 xytext=(+10, +30), textcoords='offset points', fontsize=16,
		 arrowprops=dict(arrowstyle="->", connectionstyle="arc3,rad=.2"))

plot([t,t],[0,np.sin(t)], color ='red', linewidth=2.5, linestyle="--")
scatter([t,],[np.sin(t),], 50, color ='red')

annotate(r'$cos(\frac{2\pi}{3})=-\frac{1}{2}$',
		 xy=(t, np.cos(t)), xycoords='data',
		 xytext=(-90, -50), textcoords='offset points', fontsize=16,
		 arrowprops=dict(arrowstyle="->", connectionstyle="arc3,rad=.2"))
```

## 魔鬼在于细节

[![using defaults](http://www.loria.fr/~rougier/teaching/matplotlib/figures/exercice_10.png)](http://www.loria.fr/~rougier/teaching/matplotlib/scripts/exercice_10.py)

由于蓝色和红色的线，刻度标签现在很难看清。。我们可以让它们更大并且调整它们的属性使它们的背景半透明。这将让我们把数据和标签都看清。

```python
for label in ax.get_xticklabels() + ax.get_yticklabels():
	label.set_fontsize(16)
	label.set_bbox(dict(facecolor='white', edgecolor='None', alpha=0.65 ))
```

### 图像，子区，子图，刻度(Figures,Subplots,Axes,Ticks)

_Note:这一段很绕，我不知道该怎么翻译好。在matplotlib中axes容器处于核心地位。翻译成子图因为在《Python科学计算》中作者这样称呼.subplot翻译成子区_

目前我们已经隐式地使用了图像(figure)和子图(axes)的创建。这对快速绘图很方便。我们通过显式使用figure，subplot，axes可以控制更多图像的呈现。一个图像(figure)意味着用户界面的整个窗口。在一个图像中可以有些子区(subplot)。subplot将绘图放置在常规的网格位置上而axes允许更自由的放置。它们都非常有用，取决于你的意图。我们已经隐式地使用了figure和subplot。当我们调用plot时，matplotlib调用gca来获取当前axes反过来调用gcf()获取当前图像(figure)。如果没有当前图像(figure)，它调用figure()创建一个，严格地说，是创建一个subplot(111)。让我们详细看看。

### 图像(Figure)

图像是一个图形用户界面的窗口，以"Figure #"作为标题。相对于Python通常是0索引的，图像是从一开始的。这显然是matlab风格。这里有几个决定图像外观的参数：

|参数 |	默认 |	描述|
|--------|--------------|------------------|
|num |	1 |	图像编号|
|figsize |	figure.figsize |图像大小(宽度，高度)(英寸)|
|dpi |	figure.dpi |每英寸分辨率|
|facecolor| 	figure.facecolor |	背景色|
|edgecolor| 	figure.edgecolor |绘图背景边沿色|
|frameon| 	True| 	绘制框架与否|

默认可以在资源文件[^1]指定，并将在大多数时间被使用。只有图像的编号频繁变动。

当你使用图形用户界面时，你可以通过点击右上角[^2]的`x`来关闭一个图像。但也可以用一种编程方式调用close来关闭一个图像。取决于参数它关闭(1)当前图像(无参数)，(2)一个指定的图像(以图像编号或图像实例作为参数),(3)所有图像(以all作为参数)。

和其它对象一样，你可以通过`setp`或`set_somethin`方法来设置图像属性。

### 子区(subplots)

[![using defaults](http://www.loria.fr/~rougier/teaching/matplotlib/figures/subplot-horizontal.png)](http://www.loria.fr/~rougier/teaching/matplotlib/scripts/subplot-horizontal.py)

[![using defaults](http://www.loria.fr/~rougier/teaching/matplotlib/figures/subplot-vertical.png)](http://www.loria.fr/~rougier/teaching/matplotlib/scripts/subplot-vertical.py)

[![using defaults](http://www.loria.fr/~rougier/teaching/matplotlib/figures/subplot-grid.png)](http://www.loria.fr/~rougier/teaching/matplotlib/scripts/subplot-grid.py)

你可以通过subplot在正常网格中布置图像。你需要指定行数和列数和区域的编号。注意[gridspec](http://matplotlib.sourceforge.net/users/gridspec.html)命令是个更强大的选择。

### 子图(axes)

[![using defaults](http://www.loria.fr/~rougier/teaching/matplotlib/figures/gridspec.png)](http://www.loria.fr/~rougier/teaching/matplotlib/scripts/gridspec.py)

[![using defaults](http://www.loria.fr/~rougier/teaching/matplotlib/figures/axes.png)](http://www.loria.fr/~rougier/teaching/matplotlib/scripts/axes.py)

[![using defaults](http://www.loria.fr/~rougier/teaching/matplotlib/figures/axes-2.png)](http://www.loria.fr/~rougier/teaching/matplotlib/scripts/axes-2.py)

子图和子区(subplot)非常相似，但是允许把图片放置到图像(figure)中的任何地方。所以如果我们想要在一个大图片中嵌套一个小点的图片，我们通过子图(axes)来完成它。

### 刻度(ticks)

良好格式化的刻度是准备发表的图片中的重要部分。Matplotlib为刻度提供完全可配置的系统。刻度定位器指定刻度出现的位置，刻度格式器让刻度看起来如你所愿。主刻度和次要刻度可以分别放置和格式化，每个默认主刻度并不显示，也就是，它们只有一个空列表，因为它们作为空定位器(NullLocator)(参见下面)。

#### 刻度定位器(Tick Locator)

这有几个针对不同种类需求的各种定位器：

|Class| 	Description|
|-----|--------------------|
|NullLocator|没有刻度.|
||![](http://www.loria.fr/~rougier/teaching/matplotlib/figures/ticks-NullLocator.png)|
|IndexLocator |	每到一个基数的倍数点放置一个刻度|
||![](http://www.loria.fr/~rougier/teaching/matplotlib/figures/ticks-IndexLocator.png)|
|FixedLocator 	|刻度位置是固定的|
||![](http://www.loria.fr/~rougier/teaching/matplotlib/figures/ticks-FixedLocator.png)|
|LinearLocator 	|决定刻度位置|
||![](http://www.loria.fr/~rougier/teaching/matplotlib/figures/ticks-LinearLocator.png)|
|MultipleLocator|在每个基于基数倍数的整数点放置刻度|
||![](http://www.loria.fr/~rougier/teaching/matplotlib/figures/ticks-MultipleLocator.png)|
|AutoLocator|在不错的位置选择不超过n个间隔|
||![](http://www.loria.fr/~rougier/teaching/matplotlib/figures/ticks-AutoLocator.png)|
|LogLocator |以log坐标决定刻度位置|
||![](http://www.loria.fr/~rougier/teaching/matplotlib/figures/ticks-LogLocator.png)|

所有这些定位器源于matplotlib基类matplotlib.ticker.Locator。你可以源于它创建你自己的定位器。处理时间刻度可能非常棘手。因此，matplotlib在matplotlib.dates中提供了特殊的定位器。

## 其它种类绘图

### 常规绘图

[![reguler plots](http://www.loria.fr/~rougier/teaching/matplotlib/figures/plot_ex.png)](http://www.loria.fr/~rougier/teaching/matplotlib/scripts/plot_ex.py)

从下面的代码开始，尝试重新生成上边的填充图形。

```python
from pylab import *

n = 256
X = np.linspace(-np.pi,np.pi,n,endpoint=True)
Y = np.sin(2*X)

plot (X, Y+1, color='blue', alpha=1.00)
plot (X, Y-1, color='blue', alpha=1.00)
show()
```
提示：你需要使用[fill_between](http://matplotlib.sourceforge.net/api/pyplot_api.html#matplotlib.pyplot.fill_between)命令。

点击图片获取答案。

### 散点图(scatter plots)

[![reguler plots](http://www.loria.fr/~rougier/teaching/matplotlib/figures/scatter_ex.png)](http://www.loria.fr/~rougier/teaching/matplotlib/scripts/scatter_ex.py)

从以下代码开始，尝试生成上边的图形，注意标记大小，颜色和透明度。

```python
from pylab import *

n = 1024
X = np.random.normal(0,1,n)
Y = np.random.normal(0,1,n)

scatter(X,Y)
show()
```
提示：色彩由(X,Y)角度给出。

点击图像获取答案。

### 条形图(bar plots)

[![reguler plots](http://www.loria.fr/~rougier/teaching/matplotlib/figures/bar_ex.png)](http://www.loria.fr/~rougier/teaching/matplotlib/scripts/bar_ex.py)

从以下代码开始，尝试生成上边的图形，添加标签和红色条形。

```python
from pylab import *

n = 12
X = np.arange(n)
Y1 = (1-X/float(n)) * np.random.uniform(0.5,1.0,n)
Y2 = (1-X/float(n)) * np.random.uniform(0.5,1.0,n)

bar(X, +Y1, facecolor='#9999ff', edgecolor='white')
bar(X, -Y2, facecolor='#ff9999', edgecolor='white')

for x,y in zip(X,Y1):
	text(x+0.4, y+0.05, '%.2f' % y, ha='center', va= 'bottom')

ylim(-1.25,+1.25)
show()
```
提示:你要注意文本对齐。

点击图像获取答案。

### 等高线图(contour plots)

[![reguler plots](http://www.loria.fr/~rougier/teaching/matplotlib/figures/contour_ex.png)](http://www.loria.fr/~rougier/teaching/matplotlib/scripts/contour_ex.py)

从以下代码开始，尝试生成上边的图形，注意色彩表。(参见[色彩表](http://www.loria.fr/~rougier/teaching/matplotlib/#colormaps))

```python
from pylab import *

def f(x,y): return (1-x/2+x**5+y**3)*np.exp(-x**2-y**2)

n = 256
x = np.linspace(-3,3,n)
y = np.linspace(-3,3,n)
X,Y = np.meshgrid(x,y)

contourf(X, Y, f(X,Y), 8, alpha=.75, cmap='jet')
C = contour(X, Y, f(X,Y), 8, colors='black', linewidth=.5)
show()
```
提示：你需要使用[clabel](http://matplotlib.sourceforge.net/api/pyplot_api.html#matplotlib.pyplot.clabel)命令。

点击图像获取答案。

### Imshow

[![reguler plots](http://www.loria.fr/~rougier/teaching/matplotlib/figures/imshow_ex.png)](http://www.loria.fr/~rougier/teaching/matplotlib/scripts/imshow_ex.py)

从以下代码开始，尝试生成上边的图形，添加标签和红色条形。

```python
from pylab import *

def f(x,y): return (1-x/2+x**5+y**3)*np.exp(-x**2-y**2)

n = 10
x = np.linspace(-3,3,4*n)
y = np.linspace(-3,3,3*n)
X,Y = np.meshgrid(x,y)
imshow(f(X,Y)), show()
```
提示:你需要注意imshow命令中图像的_来源_，并且使用色[彩条](http://matplotlib.sourceforge.net/api/pyplot_api.html#matplotlib.pyplot.colorbar)(colorbar)。

点击图像获取答案。

### 饼图(Pie charts)

[![reguler plots](http://www.loria.fr/~rougier/teaching/matplotlib/figures/pie_ex.png)](http://www.loria.fr/~rougier/teaching/matplotlib/scripts/pie_ex.py)

从以下代码开始，尝试生成上边的图形，添加标签和红色条形。

```python
from pylab import *

n = 20
Z = np.random.uniform(0,1,n)
pie(Z), show()
```
提示：你需要改变Z。

点击图像获取答案。

### 矢量图(quiver plots)

[![reguler plots](http://www.loria.fr/~rougier/teaching/matplotlib/figures/quiver_ex.png)](http://www.loria.fr/~rougier/teaching/matplotlib/scripts/quiver_ex.py)

从以下代码开始，尝试生成上边的图形，注意色彩和方向。

```python
from pylab import *

n = 8
X,Y = np.mgrid[0:n,0:n]
quiver(X,Y), show()
```
提示：你需要画两次箭头。

点击图像获取答案。

### 网格(grids)

[![reguler plots](http://www.loria.fr/~rougier/teaching/matplotlib/figures/grid_ex.png)](http://www.loria.fr/~rougier/teaching/matplotlib/scripts/grid_ex.py)

从以下代码开始，尝试生成上边的图形，添加标签和红色条形。

```python
from pylab import *

axes = gca()
axes.set_xlim(0,4)
axes.set_ylim(0,3)
axes.set_xticklabels([])
axes.set_yticklabels([])

show()
```
点击图像获取答案。

### 多图绘制

[![reguler plots](http://www.loria.fr/~rougier/teaching/matplotlib/figures/multiplot_ex.png)](http://www.loria.fr/~rougier/teaching/matplotlib/scripts/multiplot_ex.py)

从以下代码开始，尝试生成上边的图形，添加标签和红色条形。

```python
from pylab import *

subplot(2,2,1)
subplot(2,2,3)
subplot(2,2,4)

show()
```
提示：你可以对不同部分使用几个subplot命令。

点击图像获取答案。

### 极轴图

[![reguler plots](http://www.loria.fr/~rougier/teaching/matplotlib/figures/polar_ex.png)](http://www.loria.fr/~rougier/teaching/matplotlib/scripts/polar_ex.py)

从以下代码开始，尝试生成上边的图形，添加标签和红色条形。

```python
from pylab import *

axes([0,0,1,1])

N = 20
theta = np.arange(0.0, 2*np.pi, 2*np.pi/N)
radii = 10*np.random.rand(N)
width = np.pi/4*np.random.rand(N)
bars = bar(theta, radii, width=width, bottom=0.0)

for r,bar in zip(radii, bars):
	bar.set_facecolor( cm.jet(r/10.))
	bar.set_alpha(0.5)

show()
```
提示：你仅仅需要修改_axes_这行。

点击图像获取答案。

### 三维绘图

[![reguler plots](http://www.loria.fr/~rougier/teaching/matplotlib/figures/plot3d_ex.png)](http://www.loria.fr/~rougier/teaching/matplotlib/scripts/plot3d_ex.py)

从以下代码开始，尝试生成上边的图形，添加标签和红色条形。

```python
from pylab import *
from mpl_toolkits.mplot3d import Axes3D

fig = figure()
ax = Axes3D(fig)
X = np.arange(-4, 4, 0.25)
Y = np.arange(-4, 4, 0.25)
X, Y = np.meshgrid(X, Y)
R = np.sqrt(X**2 + Y**2)
Z = np.sin(R)

ax.plot_surface(X, Y, Z, rstride=1, cstride=1, cmap='hot')

show()
```
提示：你需要使用[contourf](http://matplotlib.sourceforge.net/api/pyplot_api.html#matplotlib.pyplot.contourf)命令。

点击图像获取答案。

### 绘制文本

[![reguler plots](http://www.loria.fr/~rougier/teaching/matplotlib/figures/text_ex.png)](http://www.loria.fr/~rougier/teaching/matplotlib/scripts/text_ex.py)

试着从头做这个！提示：看一看[matplotlib logo](http://matplotlib.sourceforge.net/examples/api/logo2.html)

点击图像获取答案。

## 此教程之外

matplotlib受益于丰富的文档和巨大的用户和开发者社区。这有几个有关的链接：

### 教程

[pyplot教程](http://matplotlib.sourceforge.net/users/pyplot_tutorial.html)

[图像教程](http://matplotlib.sourceforge.net/users/image_tutorial.html)

[文本教程](http://matplotlib.sourceforge.net/users/index_text.html)

[artist对象教程](http://matplotlib.sourceforge.net/users/artists.html)

[路径教程](http://matplotlib.sourceforge.net/users/path_tutorial.html)

[变换教程](http://matplotlib.sourceforge.net/users/transforms_tutorial.html)

### matplotlib文档

[用户手册](http://matplotlib.sourceforge.net/users/index.html)

[常见问题](http://matplotlib.sourceforge.net/faq/index.html)

[截图](http://matplotlib.sourceforge.net/users/screenshots.html)

### 代码文档

代码相当好的文档化了，你可以在python会话中快速查询指定命令

```python
>>> from pylab import *
>>> help(plot)
Help on function plot in module matplotlib.pyplot:

plot(*args, **kwargs)
   Plot lines and/or markers to the
   :class:`~matplotlib.axes.Axes`.  *args* is a variable length
   argument, allowing for multiple *x*, *y* pairs with an
   optional format string.  For example, each of the following is
   legal::

	 plot(x, y)         # plot x and y using default line style and color
	 plot(x, y, 'bo')   # plot x and y using blue circle markers
	 plot(y)            # plot y using x as index array 0..N-1
	 plot(y, 'r+')      # ditto, but with red plusses

   If *x* and/or *y* is 2-dimensional, then the corresponding columns
   will be plotted.
```
### 画廊(Galleries)

当你搜寻如何绘制指定图像时，[matplotlib gallery](http://matplotlib.sourceforge.net/gallery.html)也相当有用。每个例子和它的源码一同被提供。

一个较小的画廊在[这里](http://www.loria.fr/~rougier/coding/gallery/)

### 邮件列表

最后，这里有一个[用户邮件列表](https://lists.sourceforge.net/lists/listinfo/matplotlib-users)，那里你可以寻求帮助。一个[开发者邮件列表](https://lists.sourceforge.net/lists/listinfo/matplotlib-devel)是更加技术性的。

## 快速参考

没什么好翻译的，看原文吧……[传送门](http://www.loria.fr/~rougier/teaching/matplotlib/#quick-references)

### 线条属性

### 线型

### 标记

### 色彩表

----

[^1]:资源文件？
[^2]:有时是左上角
