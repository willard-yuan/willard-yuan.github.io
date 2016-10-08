---
layout: post
title: 机器视觉：特征序列化
categories: [机器视觉]
tags: 机器视觉
---

>下面说的这个问题及提供的方法，把它归到机器视觉里面可能会将它限制得过于狭隘，但是俺觉得把它放到机器视觉里常常面临的需要把特征保存下来的场景，会更具有代入感。

在抽取图像的特征后，我们经常会面临一个问题，即怎么高效的把特征保存下来，高效在这里指读写方便且读写速度快？如果是用Python的话，根据以往的经历，其序列化可以使用pickle以及hdf5，都是非常好用的。但随着后面语言中心转移到c++，发觉在c++要对提取到的特征进行序列化，能够使用的，除了c++自带的文件流(fstream, ifstream, ostream)外，就是google protobuf(caffe用了这个)，以及boost。c++自带的文件流之前也用过一下，遇到比较复杂的数据结构且数据量大的情况，写起来费劲且读写因为涉及到循环而比较慢，google protobuf不支持不支持二维数组（指针）以及不支持STL容器序列化（见[最常用的两种C++序列化方案的使用心得（protobuf和boost serialization）](http://www.cnblogs.com/lanxuezaipiao/p/3703988.html)），所以还是boost了。

在一般的场合，我们的特征其数据结构应该是这样的：`std::pair<vector<string>, vector<vector<float>>>`，即`vector<string>`保存图像文件名，`vector<vector<float>>`则保存图像对应的特征，所以我们需要对该类型数据进行序列化，这个问题如果用c++自带的文件流写也是可以的，不过相比于用boost的serialization，就少了很多的折腾。下面给出一个完整的例子，例子里面的4个函数对于想要序列化STL数据类型会有很好的借鉴作用。

```cpp
//
//  main.cpp
//  boost-serialization
//
//  Created by willard on 2016/10/7.
//  Copyright © 2016年 wilard. All rights reserved.
//


#include <boost/archive/binary_iarchive.hpp>
#include <boost/archive/binary_oarchive.hpp>
#include <boost/serialization/string.hpp>
#include <boost/serialization/export.hpp>
#include <boost/serialization/vector.hpp>
#include <boost/serialization/list.hpp>

#include <vector>
#include <iostream>
#include <sstream>
#include <fstream>
#include <string>

using namespace std;

template <class T>
void saveFeaturesFile(T  &features, string &filename){
    ofstream out(filename.c_str());
    stringstream ss;
    boost::archive::binary_oarchive oa(ss);
    oa << features;
    out << ss.str();
    out.close();
}

template <class T>
void loadFeaturesFile(T &features, string &filename){
    ifstream in(filename.c_str());
    boost::archive::binary_iarchive ia(in);
    ia >> features;
    in.close();
}

void saveFeaturesFilePair(std::pair<vector<string>, vector<vector<float> >>  &features, string &filename){
    ofstream out(filename.c_str());
    stringstream ss;
    boost::archive::binary_oarchive oa(ss);
    oa << features.first << features.second;
    out << ss.str();
    out.close();
}

void loadFeaturesFilePair(std::pair<vector<string>, vector<vector<float> >> &features, string &filename){
    ifstream in(filename.c_str());
    boost::archive::binary_iarchive ia(in);
    ia >> features.first >> features.second;
    in.close();
}

int main(int argc, const char * argv[]) {
    // insert code here...
    std::cout << "Hello, World!\n";
    
    vector<string> fileNames;
    fileNames.push_back("1.jpg");
    fileNames.push_back("2.jpg");
    fileNames.push_back("3.jpg");
    
    vector<vector<float> > feats;
    
    vector<float> tmp1(5,1.0);
    feats.push_back(tmp1);
    
    vector<float> tmp2(5,2.0);
    feats.push_back(tmp2);
    
    vector<float> tmp3(5,3.0);
    feats.push_back(tmp3);
    
    
    std::pair<vector<string>, vector<vector<float> >> test(fileNames, feats);

    // serialize vector<string>
    string filenameNames = "testVectorNames.bin";
    saveFeaturesFile(fileNames, filenameNames);
    
    // serialize vector<vector<float> >
    string filenameFeats = "testVectorFeats.bin";
    saveFeaturesFile(feats, filenameFeats);
    
    // serialize std::pair<vector<string>, vector<vector<float> >>
    string filenamePair = "testPair.bin";
    saveFeaturesFilePair(test, filenamePair);
    
    // deserialize std::pair<vector<string>, vector<vector<float> >>
    loadFeaturesFilePair(test, filenamePair);
    
    return 0;
}
```
上面的例子完整的演示了序列化`vector<class T>`以及`std::pair<vector<string>, vector<vector<float>>>`，同时也给出了反序列化的方法。

后面如果碰到了需要序列化提取处理的特征的问题，不妨用上面的方法试试。