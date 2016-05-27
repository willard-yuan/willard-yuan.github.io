---
layout: post
title: 图像检索：CNN卷积神经网络与实战
categories: [Image Retrieval]
tags: CBIR
---

<!--<object width="526" height="374">
<param name="movie" value="http://player.youku.com/player.php/Type/Folder/Fid/23766923/Ob/1/sid/XOTM4MzgxODY4/v.swf"></param>
<param name="allowFullScreen" value="true" />
<param name="allowScriptAccess" value="always"/>
<param name="wmode" value="transparent"></param>
<param name="bgColor" value="#ffffff"></param>
<embed src="http://player.youku.com/player.php/Type/Folder/Fid/23766923/Ob/1/sid/XOTM4MzgxODY4/v.swf" allowFullScreen="true" quality="high" width="480" height="400" align="middle" allowScriptAccess="always" type="application/x-shockwave-flash"></embed>
</object>-->

代码：[CNN-for-Image-Retrieval](https://github.com/willard-yuan/CNN-for-Image-Retrieval)。

**2015/12/31更新**：添加对MatConvNet最新版version 1.0-beta17的支持，预训练的模型请到Matconvnet官网下载最新的模型。

**2015/10/20更新**：Web演示部分代码公开[CNN-Web-Demo-for-Image-Retrieval](https://github.com/willard-yuan/CNN-Web-Demo-for-Image-Retrieval)。

**2015/09/24更新**：添加对MatConvNet最新版version 1.0-beta14的支持。

**2015/06/29更新**：添加对[MatConvNet](http://www.vlfeat.org/matconvnet/)最新版version 1.0-beta12的支持。

**注意**：其中文件夹matconvnet-1.0-beta17是已经编译好了的，鉴于MatConvNet只能在**Matlab 2014**及其以上以及系统必须是**64位**，所以在使用此工具箱之前得满足这两个条件。如果是Pythoner，推荐使用[flask-keras-cnn-image-retrieval](https://github.com/willard-yuan/flask-keras-cnn-image-retrieval)，纯Python，非常易于写成在线图像搜索应用。

>MatConvNet is a MATLAB toolbox implementing Convolutional Neural Networks (CNNs) for computer vision applications. It is simple, efficient, and can run and learn state-of-the-art CNNs. Several example CNNs are included to classify and encode images.

MatConvNet是Andrea Vedaldi用Matlab开发的一个卷积网络工具包，相比于[Caffe](caffe.berkeleyvision.org)，这个工具包配置比较简单，而且最近这两年，vgg小组在深度学习领域也是成绩斐然。关于MatConvNet的文档，可以查看[MatConvNet Convolutional Neural Networks for MATLAB](http://arxiv.org/pdf/1412.4564.pdf)以及[在线文档](http://www.vlfeat.org/matconvnet/)。这里我们主要讲讲怎么配置MatConvNet以及怎样利用在imageNet上已经训练好的模型抽取特征并进行图像检索。

## MatConvnet配置

首先，下载MatConvNet，怎么下载这个自己看着办，如果你有github的账号，推荐你star一下它，既然都用它了，不给个star好意思么(哈哈~)。下载完后，解压，移到某处，本小子自己将它放在`D:\matlabTools\`目录下，打开matlab，进入到`D:\matlabTools\matconvnet-1.0-beta10`目录下，然后在matlab命令窗下输入以下命令进行mex编译：

```matlab
addpath matlab
vl_compilenn
```

如果没出什么问题的话，会在你的`matconvnet-1.0-beta10\matlab`文件夹下多出几个文件夹，其中最重要的是mex，mex文件夹里有编译完成的mex文件`vl_imreadjpeg.mexw64`,`vl_nnconv.mexw64`,`vl_nnnormalize.mexw64`,`vl_nnpool.mexw64`说明编译成功。

**注意**：如果编译失败，可能的原因是你的matlab版本有点低（我在matlab2012b上没有编译成功），这个我查看了一下github上得issures，发觉也有人碰到这样的问题。另外根据Andrea Vedaldi在[error in compiling CPU version with windows 7 + matlab 2014a](https://github.com/vlfeat/matconvnet/issues/92)说的：

>Hi, we never tested a 32-bit build. Is there a particular reason why you are not running MATLAB 64 bit? Note that MATLAB 32 bit will be phased out by Mathwork in one of the upcoming releases. There does not seem much incentive in creating a 32 bit version of the code, although I am sure it could be done with  relatively little effort. Also, in most applications of deep learning 4GB of addressable memory seem a little too little.

所以建议使用64位的matlab，此外在编译的时候，确认mex是否在matlab命令窗里可用，不行的话就setup吧，我用的是vs2010的编译器。

上面这一步完成了，基本就配置完了，下面就测试一下MatConvNet吧。测试的脚本见[http://www.vlfeat.org/matconvnet/pretrained/](http://www.vlfeat.org/matconvnet/pretrained/)给出的脚本例子，即：

```matlab
% install and compile MatConvNet (needed once)
untar('http://www.vlfeat.org/matconvnet/download/matconvnet-1.0-beta17.tar.gz') ;
cd matconvnet-1.0-beta17
run matlab/vl_compilenn

% download a pre-trained CNN from the web (needed once)
urlwrite(...
  'http://www.vlfeat.org/matconvnet/models/imagenet-vgg-f.mat', ...
  'imagenet-vgg-f.mat') ;

% setup MatConvNet
run  matlab/vl_setupnn

% load the pre-trained CNN
net = load('imagenet-vgg-f.mat') ;

% load and preprocess an image
im = imread('peppers.png') ;
im_ = single(im) ; % note: 0-255 range
im_ = imresize(im_, net.meta.normalization.imageSize(1:2)) ;
im_ = im_ - net.meta.normalization.averageImage ;

% run the CNN
res = vl_simplenn(net, im_) ;

% show the classification result
scores = squeeze(gather(res(end).x)) ;
[bestScore, best] = max(scores) ;
figure(1) ; clf ; imagesc(im) ;
title(sprintf('%s (%d), score %.3f',...
net.meta.classes.description{best}, best, bestScore)) ;
```

上面用的是`urlwrite`来下载`imagenet-vgg-f.mat`的，这里强烈推荐你单独下载，然后把`urlwrite`下载的那一行去掉，`load`时指向你放置的`imagenet-vgg-f.mat`具体位置即可。测试如果顺利的话，就可以进入下一节我们真正关心的图像减速话题了。


## 用已训练模型抽取特征

在抽取特征之前，有必要稍微先来了解一下`imagenet-vgg-f`这个模型。这里稍微啰嗦一下上面的那个测试脚本，`im_ = imresize(im_, net.normalization.imageSize(1:2))`将图像缩放到统一尺寸，即224*224的大小，这点你可以看看net中`normalization.imageSize`，而且还必须为彩色图像。**res**有22个struct，从第17到20的struct分别是4096位，最后第21到22个struct是1000维的，是4096维经过softmax后的结果，这里我们要用的是第20个struct的数据(自己测过第19个struct，检索效果比采用第20个struct的特征差）。这个网络有8层构成，从第6层到第8层都是全连接层。关于这个网络的结构，暂时到这里。

大致了解了这个网络结构后，我们便可以使用该网络抽取图像的特征了，抽取特征的代码(**完整的图像检索代码见文末最后给出的链接**)如下：

```matlab
% Author: Yong Yuan
% Homepage: yongyuan.name

clear all;close all;clc;

% version: matconvnet-1.0-beta17
%run ./matconvnet-1.0-beta17/matlab/vl_compilenn
run ./matconvnet-1.0-beta17/matlab/vl_setupnn

%% Step 1 lOADING PATHS
path_imgDB = './database/';
addpath(path_imgDB);
addpath tools;

% viesion: matconvnet-1.0-beta17
net = load('imagenet-vgg-f.mat') ;

%% Step 2 LOADING IMAGE AND EXTRACTING FEATURE
imgFiles = dir(path_imgDB);
imgNamList = {imgFiles(~[imgFiles.isdir]).name};
clear imgFiles;
imgNamList = imgNamList';

numImg = length(imgNamList);
feat = [];
rgbImgList = {};

%parpool;

%parfor i = 1:numImg
for i = 1:numImg
   oriImg = imread(imgNamList{i, 1});
   if size(oriImg, 3) == 3
       im_ = single(oriImg) ; % note: 255 range
       im_ = imresize(im_, net.meta.normalization.imageSize(1:2)) ;
       im_ = im_ - net.meta.normalization.averageImage ;
       res = vl_simplenn(net, im_) ;

       % viesion: matconvnet-1.0-beta17
       featVec = res(20).x;

       featVec = featVec(:);
       feat = [feat; featVec'];
       fprintf('extract %d image\n\n', i);
   else
       im_ = single(repmat(oriImg,[1 1 3])) ; % note: 255 range
       im_ = imresize(im_, net.meta.normalization.imageSize(1:2)) ;
       im_ = im_ - net.meta.normalization.averageImage ;
       res = vl_simplenn(net, im_) ;

       % viesion: matconvnet-1.0-beta17
       featVec = res(20).x;

       featVec = featVec(:);
       feat = [feat; featVec'];
       fprintf('extract %d image\n\n', i);
   end
end

feat_norm = normalize1(feat);
save('feat4096Norml.mat','feat_norm', 'imgNamList', '-v7.3');
```

在倒数第二行，对特征进行了L2归一化，方便后面用余弦距离度量，L2归一化方法如下：

```matlab
function [X] = normalize1(X)
% X:n*d

for i=1:size(X,1)
    if(norm(X(i,:))==0)

    else
        X(i,:) = X(i,:)./norm(X(i,:));
    end
end
```

上面便是特征抽取的代码，特征抽取完后，我们便可以采用进行检索了。匹配时采用的是余弦距离度量方式，至于后面的检索部分的代码，相比于前面特征抽取的过程，更显灵活，怎么处理可以随自己的喜欢了，所以这里就不再对代码进行列举了。下面是我在**corel1k**外加上Caltech256抽取几类构成1333张图像库做的一个飞机检索结果，时间所限，就不测大的图像库了。

示例：Caltech-256图像数据库
<p align="center"><img src="http://www.vision.caltech.edu/VisionWiki/images/thumb/2/23/Caltech256a_crop.png/537px-Caltech256a_crop.png" alt="caltech256"/></p>
Caltech-256图像数据库上搜索结果
![airplane-image-retrieval]({{ site.url }}/images/posts/2015-04-02/airplane-image-retrieval.jpg)

最后，整个图像检索的代码已放在github上了，感兴趣的同学可以去[**CNN-for-Image-Retrieval**](https://github.com/willard-yuan/CNN-for-Image-Retrieval)，有github的同学不要吝啬你的star哦，这个代码我会随时完善更新，比如添加计算mAP的代码。

![Caltech1-70]({{ site.url }}/images/posts/2015-02-09/Caltech1-70.png)

![Caltech1-70-example]({{ site.url }}/images/posts/2015-02-09/Caltech1-70-example.png)

![Caltech71-101]({{ site.url }}/images/posts/2015-02-09/Caltech71-101.png)

![Caltech71-140-example]({{ site.url }}/images/posts/2015-02-09/Caltech71-140-example.png)

![Caltech141-210]({{ site.url }}/images/posts/2015-02-09/Caltech141-210.png)

![Caltech141-210-example]({{ site.url }}/images/posts/2015-02-09/Caltech141-210-example.png)

![Caltech141-210-example1]({{ site.url }}/images/posts/2015-02-09/Caltech141-210-example1.png)

![random]({{ site.url }}/images/posts/2015-02-09/random.png)
![river]({{ site.url }}/images/posts/2015-02-09/river.png)
![lion]({{ site.url }}/images/posts/2015-02-09/lion.png)
![tiger]({{ site.url }}/images/posts/2015-02-09/tiger.png)
