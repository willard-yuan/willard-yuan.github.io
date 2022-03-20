---
layout: post
title: 继承、dynamic_cast、纯虚函数、protected，一场多态之旅
categories: [Cpp]
tags: Cpp
---

做算法策略过程中，常常会存在这样一种情形：由于业务压力或者岗位性质的缘故，做算法、策略的同学（也包括我自己），对于一些工程上的实现，往往只追求尽快实现、拿到收益，而忽略了实现过程中，代码的复用性、可读性。举个例子，某模型AB版本不断迭代，当模型特征输入、推理、业务发生小的差异时，为了追求尽快实现拿到收益，会出现很多的冗余代码，代码量急剧膨胀，可行性也变得比较差，推高维护成本。

比如在实际中遇到的一个例子：

```cpp
class NNPredict {
    bool RemoteNN();
    bool RemoteNNAB();
    bool RemoteNNKMM();
    bool RemoteNNDailyMM();
    bool RemoteNNKMMSg();
}
```

刚开始的时候，线上模型请求RemoteNN()方法，AB实验模型请求RemoteNNAB()方法。RemoteNN()和RemoteNNAB()，有比较多的冗余代码，并且后面随着模型、业务迭代，出现了RemoteNNKMM()、RemoteNNDailyMM()和RemoteNNKMMSg()。这些方法，可能只是输入、推理、业务存在一些差异，为了尽快实验看效果，就直接对方法进行copy改造，导致一个文件，代码超过五六千行，代码高度冗余。

## 基类设计

虽然模型版本在不断AB迭代，但不同版本的模型，正如前面所说的，只是特征输入、推理、业务不一样导致的差异。针对上面遇到的场景，我们可以对这样AB请求模型的不同版本，进行抽样，涉及如下基类接口：

- SetClient函数设置AB版本对应不同的远程调用grpc的client；
- Run函数暴露的最终接口，对于请求需要的所有信息，都可以把它放到context里面；
- PrepareData函数用于特征输入与预处理，RemoteApply函数远程调用，GetResult函数获取最终返回的结果，这3个函数，在基类中都定义为了纯虚函数，且都为private；

```cpp
class BaseRemoteInfer {
 public:
  virtual ~ BaseRemoteInfer() {
  }
  
  // 初始化阶段调用
  bool SetClient(const std::shared_ptr<InferKessClient>& infer_client);
  // 执行函数
  bool Run(NNContext* context, std::vector<NNResult>* score) const;
 
 private:
  // 准备数据
  virtual bool PrepareData(NNContext* context) const = 0;
  // 远程调用，可以设计成统一的非虚函数
  virtual bool RemoteApply(NNContext* context) const = 0;
  // 获取结果，填充 debug 信息
  virtual bool GetResult(NNContext* context, std::vector<NNResult>* score) const = 0;
  // 业务填充一些公共的执行函数，在上述阶段中使用 ...
 private:
  std::shared_ptr<InferKessClient> infer_client_;
};

bool BaseRemoteInfer::Run(NNContext* context, std::vector<NNResult>* score) const {
  if (!context || !score) {
    LOG(ERROR) << "BaseRemoteInfer input error";
    return false;
  }
  if (!PrepareData(context)) {
    LOG(ERROR) << "Prepare data error";
    return false;
  }
  if (!RemoteApply(context)) {
    LOG(ERROR) << "Remote apply error";
    return false;
  }
  if (!GetResult(context, score)) {
    LOG(ERROR) << "Get result error";
    return false;
  }
  return true;
}
```

### 纯虚函数、protected

对于上述设计的基类，由于GetResult方法、SetClient方法，在基类、子类实现方法无差异，将其放在基类中实现就可以，因而GetResult不必将其设计成纯虚函数，将GetResult方法设计为虚函数即可，GetResult方法、SetClient方法都放在基类里，作为基类方法供子类调用。此外，在子类调用SetClient的时候，会访问到`std::shared_ptr<InferKessClient> infer_client_`，如果将其设置为private属性，显然子类不能直接访问到该成员变量，因而将其设置为protected是比较合理的。最终，基类设计为如下：

```cpp
class BaseRemoteInfer {
 public:
  virtual ~ BaseRemoteInfer() {
  }
  
  // 初始化阶段调用
  bool SetClient(const std::shared_ptr<InferKessClient>& infer_client);
  // 执行函数
  bool Run(NNContext* context, std::vector<NNResult>* score) const;
 
 private:
  // 准备数据
  virtual bool PrepareData(NNContext* context) const = 0;
  // 远程调用，可以设计成统一的非虚函数
  virtual bool RemoteApply(NNContext* context) const = 0;
  // 获取结果，填充 debug 信息
  virtual bool GetResult(NNContext* context, std::vector<NNResult>* score) const;
  // 业务填充一些公共的执行函数，在上述阶段中使用 ...
 protected:
  std::shared_ptr<InferKessClient> infer_client_;
};
```

## 派生类

由于派生类和基类具有相同的GetResult方法、SetClient方法实现，派生类不用再单独实现GetResult方法、SetClient方法了。只需要实现PrepareData方法和RemoteApply。一个示意实现的派生类如下：

```cpp
class DSNNRemoteInfer:public BaseRemoteInfer {
 public:
  ~ DSNNRemoteInfer() {
  }
 private:
  bool PrepareData(NNContext* context) const;
  bool RemoteApply(NNContext* context) const;
};
```
上述命令会对项目进行编译，并将cvtk包安装在本地，在Python中导入包名验证即可。

## dynamic_cast

`dynamic_cast < type-id > ( expression)`，该运算符把expression转换成type-id类型的对象。使用的时候，应注意：

- Type-id必须是类的指针、类的引用或者void*；
- 如果type-id是类指针类型，那么expression也必须是一个指针，如果type-id是一个引用，那么expression也必须是一个引用；
- dynamic_cast运算符可以在执行期决定真正的类型。如果downcast是安全的（也就说，如果基类指针或者引用确实指向一个派生类对象）这个运算符会传回适当转型过的指针。如果downcast不安全，这个运算符会传回空指针（也就是说，基类指针或者引用没有指向一个派生类对象）；

dynamic_cast主要用于类层次间的上行转换和下行转换，还可以用于类之间的交叉转换。将一个基类对象指针（或引用）cast到继承类指针，dynamic_cast会根据基类指针是否真正指向继承类指针来做相应处理：

- 对指针进行dynamic_cast，失败返回null，成功返回正常cast后的对象指针；
- 对引用进行dynamic_cast，失败抛出一个异常，成功返回正常cast后的对象引用；

在类层次间进行上行转换时，dynamic_cast和static_cast的效果是一样的；在进行下行转换时，dynamic_cast具有类型检查的功能，比static_cast更安全。

```cpp
ds_nn_infer_ = std::make_shared<DSNNRemoteInfer>();
status = ds_nn_infer_->SetClient(exp_client_);
succ = dynamic_cast<BaseRemoteInfer *>(ds_nn_infer_.get())->Run(ctr, &score);
```
