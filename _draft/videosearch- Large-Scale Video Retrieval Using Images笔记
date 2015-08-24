videosearch: Large-Scale Video Retrieval Using Images

### 安装

编译VLFEAT库

```sh
> cd $mypath/videosearch/common/vlfeat-0.9.18/
> make # Making vlfeat
```
此时会在vlfeat-0.9.18的bin目录下生成一个名为glnxa64的文件夹(如果是linux系统的话），如果是OS X系统则生成的是一个maci64的
文件夹，里面包含了一个名字为`libvl.so`的动态链接库，如果我们需要使用VLFEAT的C接口的话，则需要调用到该动态链接库。

为了便于使用pkg-conf管理调用该动态链接库，我们需要把`libvl.so`弄到`/usr/lib/`目录下，按照作者给的方式，采用的是建立
软链接的方式，即：

```sh
sudo ln -s bin/glnxa64/libvl.so /usr/lib/libvl.so #sym-link it to your library
```
如果是OS X，把glnxa64改为maci64就行。下面就可以编译SIFT提取部分的源码了。

```sh
> cd $mypath/videosearch/indexer/local_features/
> make # Making programs for extracting, reading and writing features
```

编译完成后，我们可以对其进行测试，运行：

```
> ./test_extract
```
该测试代码会载入当前目录中的`test_image.jpg`，然后提取其SIFT特征点，但是，我在运行时，出现找不到
`libvl.so`动态链接库的情况，然后看了一下Makefile，发觉它是用pkg-config来管理，源码在编译时会通过
pkg-config在`/usr/lib`中查找需要用到的动态链接库，按理说既然已经软链接到里面了，不会出现找不到的问题
，然后在stackoverflow上查找到了相关的问题![“loading shared libraries” error using VLFeat in C]
(http://stackoverflow.com/questions/22887344/loading-shared-libraries-error-using-vlfeat-in-c)
，然后我按照把`libvl.so`复制到`/usr/lib/`下的方法，就可以运行了。

之后我把该目录下的所有文件都打开看了一遍，在`run_sift_extraction`看到这么一句，一个字，“跪”，藏得这么隐蔽：
# Note: sometimes there is an error when running this, such as "./extract: error while loading shared libraries: libvl.so: cannot open shared object file: No such file or directory"
# To resolve it, do something like:
# sudo cp ../../common/vlfeat-0.9.18/bin/glnxa64/libvl.so /usr/lib/
