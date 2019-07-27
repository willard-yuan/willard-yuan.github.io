---
layout: post
title: 机器视觉：TensorFlow C++提取特征
categories: [计算机视觉]
tags: CV
---

> 深情似海，问相逢初度，是何年纪？依约而今还记取，不是前生夙世。放学花前，题诗石上，春水园亭里。逢君一笑，人间无此欢喜。  
无奈苍狗看云，红羊数劫，惘惘休提起。客气渐多真气少，汩没心灵何已。千古声名，百年担负，事事违初意。心头阁住，儿时那种情味。

在实际应用中，将TensorFlow模型推理C++工程化的好处，不仅提升执行效率，保证服务的高可用性，还便于嵌入各类应用框架中。本文主要记录TensorFlow推理过程C++工程化，包含两部分的内容，分别为：  

- TensorFlow C++提取特征。通过TensorFlow C++接口，我们可以搭建高效、稳定的特征抽取接口服务、类别预测服务等。
- TensorFlow 嵌入到QT中。将TensorFlow引入QT后，我们可以快捷地开发一些基于深度学习的桌面类的应用。

举个例子，如果要开发一个像[INstance Search](http://yongyuan.name/project/)图像检索桌面应用，其中最重要的一步，就是将提取特征过程进行C++化，为QT界面程序调用提供特征抽取接口。

TensorFlow 编译过程可以参考[Ubuntu18.04下C++编译tensorflow并在QT中使用](https://blog.csdn.net/qq_29462849/article/details/84986592)，或者参考有道笔记[TensorFlow c++ 编译](http://note.youdao.com/noteshare?id=fb00a57baa78e7232b0aa1245537b345)。注意，在MAC OS下，最好是将`libtensorflow_cc.so`和`libtensorflow_framework.so`往`/usr/local/lib`拷贝一份，避免出现编译成功但链接失败的错误。如果要在Xcode中使用TensorFlow，在`Header Search Paths`中添加：

```text
/xxx/libs/tf_1.9/include
/xxx/libs/tf_1.9/include/tensorflow/
/xxx/libs/tf_1.9/include/third-party/
/xxx/libs/tf_1.9/include/bazel-genfiles/
/xxx/tensorflow/contrib/makefile/gen/protobuf/include
/xxx/libs/eigen3
/xxx/libs/opencv/3.4.2/include
```

在`Library Search Paths`中添加：

```
/xxx/tf/lib
/xxx/opencv/3.4.2/lib
```

然后在XCode中把相关的动态添加库添加进来，就可以开心地在Xcode里面调用TensorFlow C++的各种API了。

### TF C++ 特征提取

我们定义一个`CnnFeature`类，对外暴露单张图片特征提取接口`computeFeat`和N张图片批量特征提取接口`computeFeatsBatch`，除此之外，其他所有的细节，调用方都不用关心，具体的`CnnFeature`定义为：

```cpp
class CnnFeature{
public:
    CnnFeature(const int batchSize_, const std::string modelBin_) {
        netInputSize = 640;
        inPutName = "input:0";
        outPutName = "head/out_emb:0";
        batchSize = batchSize_;
        initModel(modelBin_);
    }
    
    ~CnnFeature() {
    }
    int computeFeat(const cv::Mat& img, std::vector<float> &ft);
    int computeFeatsBatch(const std::vector<cv::Mat> &img, std::vector<std::vector<float>> &fts);
    
private:
    int nomalizeVector(std::vector<float> &v, const int feature_dim);
    int initModel(const std::string& modelBin);
    
protected:
    int netInputSize;
    int batchSize;
    tensorflow::GraphDef graph_def;
    unique_ptr<tensorflow::Session> session;
    tensorflow::SessionOptions sess_opt;
    
    tensorflow::Tensor inputTensor;
    
    std::string inPutName = "input:0";
    std::string outPutName = "head/out_emb:0";
};
```

各变量和函数的意义分别为：

- netInputSize：为模型接收的输入的尺寸，如果输入图片尺寸不满足，内部会将其resize到640的尺寸；
- inPutName：PB模型的输入节点；
- outPutName：PB模型的输出节点；
- batchSize：这个没啥好解释的；
- initModel函数：实例初始化时，完成PB模型的载入以及网络初始化相关的工作；
- nomalizeVector：对网络输出的特征，进行L2归一化；

下面针对重点待实现的3个函数进行展开，分别为`initModel`、`computeFeat`、`computeFeatsBatch`。

#### 模型初始化

通过`ReadBinaryProto`读入PB模型，然后创建Session。对于PB模型，TF有一个限制，就是PB模型的大小不能超过2G，如果超过2G，`ReadBinaryProto`读取PB模型会失败，这时候需要将PB模型转为txt模型，txt模型的读取，TF没有模型大小的限制。


```cpp
int CnnFeature::initModel(const std::string& modelBin)
{
    // 读取模型文件
    if (!ReadBinaryProto(tensorflow::Env::Default(), modelBin, &graph_def).ok())
    {
        std::cout << "Read model .pb failed" << std::endl;
        return -1;
    }

    //sess_opt.config.mutable_gpu_options()->set_allow_growth(true);
    (&session)->reset(NewSession(sess_opt));
    if (!session->Create(graph_def).ok())
    {
        cout << "Create graph failed" << endl;
        return -1;
    }
    
    return 1;
}
```

#### 单图特征提取接口

图片的读取以及预处理，小白菜比较喜欢用OpenCV，另外2个需要注意的地方是：

- OpenCV的Mat数据传递到`tensorflow::Tensor`中；
- 输出的结果`tensorflow::Tensor`怎么传递到C++常用的数组中；

下面是完整的`computeFeat`接口实现：

```cpp
int CnnFeature::computeFeat(const cv::Mat& img, std::vector<float> &ft)
{
    int tmpBatchSize = 1;
    
    if (img.empty()) return 0;
    
    cv::Mat imgResized(netInputSize, netInputSize, CV_8UC3, cv::Scalar(0, 0, 0));
    cv::resize(img, imgResized, cv::Size(netInputSize, netInputSize));
    
    inputTensor = tensorflow::Tensor(tensorflow::DT_FLOAT,
                                     tensorflow::TensorShape({tmpBatchSize, netInputSize, netInputSize, 3}));
    auto inputTensorMapped = inputTensor.tensor<float, 4>();
    
    for (int y = 0; y < imgResized.rows; ++y)
    {
        for (int x = 0; x < imgResized.cols; ++x)
        {
            cv::Vec3b color = imgResized.at<cv::Vec3b>(cv::Point(x, y));
            inputTensorMapped(0, y, x, 0) = (float)color[2];
            inputTensorMapped(0, y, x, 1) = (float)color[1];
            inputTensorMapped(0, y, x, 2) = (float)color[0];
        }
    }
    
    std::vector<tensorflow::Tensor> outputs;
    std::pair<std::string, tensorflow::Tensor> imgPair(inPutName, inputTensor);
    
    tensorflow::Status status = session->Run({imgPair}, {outPutName}, {}, &outputs); //Run, 得到运行结果，存到outputs中
    if (!status.ok())
    {
        cout << "Running model failed"<<endl;
        cout << status.ToString() << endl;
        return -1;
    }
    
    // 得到模型运行结果
    tensorflow::Tensor t = outputs[0];
    auto tmap = t.tensor<float, 2>();
    int output_dim = (int)t.shape().dim_size(1);
    
    // 保存特征
    ft.clear();
    for (int n = 0; n < output_dim; n++)
    {
        ft.push_back(tmap(0, n));
    }
    
    // 特征归一化
    nomalizeVector(ft, (int)ft.size());
    
    return 1;
}
```

上面OpenCV的Mat在传递到`tensorflow::Tensor`并没有对每个像素做中心化（小白菜的模型在训练的时候，就没做这样的处理），如果需要中心化，改为`((float)color[i] - 127) / 128.0`即可。得到特征后，调用`nomalizeVector`函数对特征完成L2归一化。
 
#### 批量特征提取接口

对于传进来的N张图片，处理逻辑也比较直观：将N张图片拆分成nBatchs个batch和residNum个剩余的图片，然后将这nBatchs个batch分别传入网络，得到nBatchs个batch提取的特征，最后处理剩余的构不成1个batch的图片，即residNum个剩余的图片。下面是批量特征提取接口实现：

```cpp
int CnnFeature::computeFeatsBatch(const std::vector<cv::Mat> &imgs, std::vector<std::vector<float>> &fts)
{
    if (imgs.empty()) return 0;
    
    fts.clear();
    
    int nBatchs = (int)imgs.size() / batchSize;
    int residNum = (int)imgs.size() % batchSize;
    
    inputTensor = tensorflow::Tensor(tensorflow::DT_FLOAT,
                                     tensorflow::TensorShape({batchSize, netInputSize, netInputSize, 3}));
    auto inputTensorMapped = inputTensor.tensor<float, 4>();
    std::vector<float> ft;

    
    // n 个batch
    for (int i = 0; i < nBatchs; i++)
    {
        cv::Mat imgResized;
        for (int j = 0; j < batchSize; j++)
        {
            if (imgs.at(i*batchSize+j).empty())
            {
                std::cout << "image is empty" << std::endl;
                imgResized = cv::Mat::zeros(netInputSize, netInputSize, CV_8UC3);
            } else {
                cv::resize(imgs.at(i*batchSize+j), imgResized, cv::Size(netInputSize, netInputSize));
            }
            
            // 填充数据到tensor里面
            for (int y = 0; y < imgResized.rows; ++y)
            {
                for (int x = 0; x < imgResized.cols; ++x)
                {
                    cv::Vec3b color = imgResized.at<cv::Vec3b>(cv::Point(x, y));
                    inputTensorMapped(j, y, x, 0) = (float)color[2];
                    inputTensorMapped(j, y, x, 1) = (float)color[1];
                    inputTensorMapped(j, y, x, 2) = (float)color[0];
                }
            }
        }

        
        std::vector<tensorflow::Tensor> outputs;
        std::pair<std::string, tensorflow::Tensor> imgPair(inPutName, inputTensor);
        
        tensorflow::Status status = session->Run({imgPair}, {outPutName}, {}, &outputs); //Run, 得到运行结果，存到outputs中
        if (!status.ok())
        {
            cout << "Running model failed: " << status.ToString() <<endl;
            return -1;
        }
        
        // 得到模型运行结果
        tensorflow::Tensor t = outputs[0];
        auto tmap = t.tensor<float, 2>();
        int output_dim = (int)t.shape().dim_size(1);
        
        // 保存特征
        std::vector<float> feat;
        for (int k = 0; k < batchSize; k++)
        {
            ft.clear();
            for (int n = 0; n < output_dim; n++)
            {
                ft.push_back(tmap(k, n));
            }
            
            // 特征归一化
            nomalizeVector(ft, (int)ft.size());
            
            fts.push_back(ft);
        }
    }
    
    // 剩余的图片
    for (int i = 0; i < residNum; i++)
    {
        ft.clear();
        cv::Mat tmpImg = imgs.at(nBatchs*batchSize + i);
        if (tmpImg.empty())
        {
            std::cout << "image is empty" << std::endl;
            tmpImg = cv::Mat::zeros(netInputSize, netInputSize, CV_8UC3);
        }
        if (computeFeat(tmpImg, ft))
        {
            fts.push_back(ft);
        }
    }
    
    return 1;
}
```

当图片出现异常时，上面代码处理的方式是将当前这张有异常的图片，用一张纯黑色的图片替代，得到的特征，是这张纯黑图片的特征。

完成`computeFeat`、`computeFeatsBatch`两个接口的时候，我们便可以在此基础上，做一些更加有意思的事，比如通过gRPC提供server，或者使用QT开发跨平台桌面应用。

### QT引入TF

TF编译完成后，要想在QT中引入TF，是一件比较容易的事，直接在`.pro`文件中，写入头文件和库文件的路径，比如：

```sh
# OpenCV include
INCLUDEPATH += /usr/local/include/
INCLUDEPATH += /usr/local/include/opencv
INCLUDEPATH += /usr/local/include/opencv2

INCLUDEPATH += /xxx/libs/tf_1.9/include
INCLUDEPATH += /xxx/libs/tf_1.9/include/bazel-genfiles
INCLUDEPATH += /xxx/libs/tf_1.9/include/tensorflow
INCLUDEPATH += /xxx/libs/tf_1.9/include/third-party
INCLUDEPATH += /xxx/tensorflow/contrib/makefile/gen/protobuf/include

INCLUDEPATH += /usr/local/include/eigen3


LIBS += -L/usr/local/lib \
 -lopencv_calib3d \
 -lopencv_core \
 -lopencv_features2d \
 -lopencv_flann \
 -lopencv_highgui \
 -lopencv_imgcodecs \
 -lopencv_imgproc \
 -lopencv_ml \
 -lopencv_objdetect \
 -lopencv_photo \
 -lopencv_dnn \
 -ltensorflow_cc \
 -ltensorflow_framework
```

完成TF的`INCLUDEPATH`和`LIBS`添加后，即可在QT里面开心的使用TF C++的各种接口了。

### 完整实现

完整的TF C++通过PB模型提取特征的接口实现，可以在[tf_extract_feat](https://github.com/willard-yuan/cvtk/tree/master/tf_extract_feat)找到，`demo.cpp`里的pb模型，这里就不给出了，可以在自己转的PB模型上验证一下，看看跟自己的Python得到的特征，是否是一致的。

### 总结

本篇博客主要记录了TensorFlow C++通过PB模型特征提取的实现（单张图片、批量提取），以及在QT中引入QT中的方法。实际上，可以在此基础上稍微修改下，可以将其拓展到TF C++目标检测、分类等上。