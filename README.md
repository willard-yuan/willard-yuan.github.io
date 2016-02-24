这是我的个人主页，该主题是[Sébastien Saunier](https://raw.github.com/ssaunier/ssaunier.github.io/)在[marcgg](http://marcgg.com/)的基础上改写的。我fork过来后，也稍微做了些修改，如果你觉得不错，可以直接从我这里fork过去，fork过去后还请你把涉及到我的一些信息、文章、图片删掉。[主题预览](http://yongyuan.name/)。

### 已完成功能

- 调用豆瓣api显示书单列表
- 在线简历
- 添加latex公式支持

### 安装步骤

这个博客被我改得有点乱，什么时候那个地方不爽了就改一下，所以整体的结构还是很混乱的，不过要套用这个模板还是完全可以的，遵行下面的步骤应该可以成功。

1. 把模板下载过去，如果你没有用单独的域名的话，把`CNAME`文件删掉，然后顺便把`_posts`里的文章删掉，可以留一篇，方便后面用markdown时对文章格式做参考；

2. 配置`_config.yml`，比如把title修改成你自己；

3. 修改英文页面[default.html](https://github.com/willard-yuan/willard-yuan.github.io/blob/master/_layouts/default.html)，把里面出现的固定的url更改成你的url；

4. 修改中文页面[index.html](https://github.com/willard-yuan/willard-yuan.github.io/blob/master/cn/index.html)，主要是中文页面的一些内容；

5. **contact**目录这个里面的东西没用，我虽没删，但从没有用过，你觉得碍眼的话，完全可以把这个目录删掉，不会造成任何影响；

6. **resume**目录是在线简历，[演示效果](http://yongyuan.name/resume/)，这个你在用时，把前面那个[default.html](https://github.com/willard-yuan/willard-yuan.github.io/blob/master/_layouts/default.html)中把latex的简历url换成这个目录的url；

7. **book**模板，这个你需要有一个豆瓣账号，现在[books/index.html](https://github.com/willard-yuan/willard-yuan.github.io/blob/master/books/index.html)页面把title等修改一下，然后到[douban.api.js](https://github.com/willard-yuan/willard-yuan.github.io/blob/master/js/douban.api.js)把账号user和api改一下。

上面7步改完了，应该就没什么问题了。

## Todo
- 添加时间线，参考[fexo](https://github.com/forsigner/fexo)
