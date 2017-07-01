---
layout: post
title: 图像检索：Hashing图像检索源码及数据库总结
categories: [Image Retrieval]
tags: 哈希
---

下面的这份哈希算法小结来源于本周的周报，原本并没有打算要贴出来的，不过，考虑到这些资源属于关注利用哈希算法进行大规模图像搜索的各位看官应该很有用，所以好东西本小子就不私藏了。本资源汇总最主要的收录原则是原作者主页上是否提供了源代码，为了每种方法的资料尽可能完整，本小子会尽可能的除提供源码下载地址外，还会给出PDF文章的链接、项目主页，slide等。

> 对哈希方法重新进行调研，右图是找到的提供有部分源码的哈希方法，这其中包含了比较经典的哈希方法，比如e2lsh、mih，同时也包含有最近几年一直到13年提出来的一些比较新的哈希算法，比如13年提出的有bpbc、opq、ksh。

上面这一段是摘自本小子的周报(本小子这周除改了篇文章，其余时间几乎都在打酱油，谁叫老板不给发工资(要逆天？)，引用中的“右图”可以略过，直接看下面不同哈希算法的链接信息。

## 哈希方法对比框架

自己整理的哈希方法对比框架，主要是无监督的哈希方法对比框架：[hashing-baseline-for-image-retrieval](https://github.com/willard-yuan/hashing-baseline-for-image-retrieval)

## 哈希方法

主要贴公布代码的：

1. **AGH**: Hashing with Graphs, [Paper](http://machinelearning.wustl.edu/mlpapers/paper_files/ICML2011Liu_6.pdf) and [Code](http://www.ee.columbia.edu/~wliu/Anchor_Graph_Hash.zip)
2. **BPBC**: Learning Binary Codes for High-Dimensional Data Using Bilinear Projections, [Paper](http://www.unc.edu/~yunchao/papers/CVPR13.pdf) and [Code](http://www.unc.edu/~yunchao/bpbc.htm)
3. **BRE**: Learning to Hash with Binary Reconstructive Embeddings [Paper](http://www.cse.ohio-state.edu/~kulis/pubs/bre_nips.pdf) and [Code](http://www.cse.ohio-state.edu/~kulis/bre/bre.tar.gz)
4. **DBQ**: Double-bit quantization for hashing [Paper](http://cs.nju.edu.cn/lwj/paper/AAAI12_DBQ.pdf) and [Code]( http://cs.nju.edu.cn/lwj/code/DBQ.rar)
5. **E2LSH**: Local Sensitive Hash, [Project Page](http://www.mit.edu/~andoni/LSH/)
6. **HDML**: Hamming Distance Metric Learning, [Paper](http://www.cs.toronto.edu/~norouzi/research/papers/hdml.pdf) and [Code](https://github.com/norouzi/hdml)
7. **IMH**: Inter-Media Hashing for Large-scale Retrieval from Heterogenous Data Sources, [Project Page](http://staff.itee.uq.edu.au/shenht/UQ_IMH) and [Code](http://staff.itee.uq.edu.au/shenht/UQ_IMH/imh.7z)
8. **ISOH**: Isotropic Hashing, [Paper](http://cs.nju.edu.cn/lwj/paper/NIPS12-IsoHash.pdf) and [Code](http://cs.nju.edu.cn/lwj/code/IsoHash.zip)
9. **ITQ**: Iterative Quantization: A Procrustean Approach to Learning Binary Codes [Paper](http://www.unc.edu/~yunchao/papers/CVPR11_a.pdf) and [Code](http://www.unc.edu/~yunchao/code/smallcode.zip) ~~已下线~~
10. **KLSH**: Kernelized Locality-Sensitive Hashing for Scalable Image Search, [Project Page](http://www.cse.ohio-state.edu/~kulis/klsh/klsh.htm), [Paper](http://www.cse.ohio-state.edu/~kulis/pubs/iccv_klsh.pdf) and [Code](http://www.cse.ohio-state.edu/~kulis/klsh/klsh_code.tar.gz)
11. **KMH**: K-means Hashing: an Affinity-Preserving Quantization Method for Learning Binary Compact Codes, [Paper](http://131.107.65.14/en-us/um/people/kahe/publications/cvpr13kmh.pdf) and [Code](http://131.107.65.14/en-us/um/people/kahe/cvpr13/matlab_KMH_release_v1.1.rar)
12. **KSH**: Supervised Hashing with Kernels, [Paper](http://www.ee.columbia.edu/~wliu/CVPR12_ksh.pdf) and [Code](http://www.ee.columbia.edu/~wliu/ksh_code.zip)
13. **MDSH**: Multidimensional Spectral Hashing, [Paper](http://people.csail.mit.edu/torralba/publications/msh_eccv12.pdf) and [Code](http://www.cs.huji.ac.il/~yweiss/export2.tar)
14. **MH**: Manhattan hashing for large-scale image retrieval, [Paper](http://cs.nju.edu.cn/lwj/paper/SIGIR12_MH.pdf) and [Code](http://cs.nju.edu.cn/lwj/code/MH.rar)
15. **MLH**: Minimal Loss Hashing for Compact Binary Codes, [Paper](http://www.cs.toronto.edu/~norouzi/research/papers/min_loss_hash.pdf), [Code](http://www.cs.toronto.edu/~norouzi/research/mlh/) and [Slide]( http://www.cs.toronto.edu/~norouzi/research/slides/mlh-icml.ppt)
16. **OPQ**: Optimized Product Quantization for Approximate Nearest Neighbor Search, [Paper](http://131.107.65.14/en-us/um/people/kahe/publications/cvpr13opq.pdf) and [Code]( http://131.107.65.14/en-us/um/people/kahe/cvpr13/matlab_OPQ_release_v1.1.rar)
17. **SH**: Spectral Hashing, [Paper](http://people.csail.mit.edu/torralba/publications/spectralhashing.pdf) and [Code]( http://www.cs.huji.ac.il/~yweiss/SpectralHashing/sh.zip)
18. **IHM**: Inductive Hashing on Manifolds (2013 CVPR) [ProjectPage](http://cs.adelaide.edu.au/~chhshen/projects/inductive_hashing/)
19. **BSPH**: Semi-supervised Nonlinear Hashing Using Bootstrap Sequential Projection Learning (2012 TKDE), [ProjectPage](http://appsrv.cse.cuhk.edu.hk/~jkzhu/bnsplh/)
20. **FastHash**: Fast Supervised Hashing with Decision Trees for High-Dimensional Data (2014 CVPR) [Code](https://bitbucket.org/chhshen/fasthash)
21. **Spherical Hashing**: Spherical Hashing (2012 CVPR)
23. **PDH**: Predictable Dual-View Hashing, [Paper](http://www.umiacs.umd.edu/~jhchoi/paper/icml2013_pdh.pdf) (ICML2013)

另外推荐两个整理的：[Learning to Hash](http://cs.nju.edu.cn/lwj/L2H.html), [Introduction to Hashing](http://stoudemireyan32.wix.com/yanli#!introduction-to-hashing/c1z2j).

## 常用数据库

1. [**LabelMe**](http://www.cs.toronto.edu/~norouzi/research/mlh/data/LabelMe_gist.mat)
2. [**min-loss-hashing**](https://github.com/willard-yuan/min-loss-hashing/tree/master/matlab)
3. [图像检索：常用图像库整理](http://yongyuan.name/blog/database-for-cbir.html)

## 关注的人

注：下面不同的哈希方法的代码可以在他们的主页上找到

- [**Grauman**](http://cs.nyu.edu/~fergus/pmwiki/pmwiki.php?n=PmWiki.Publications), [Image search and large-scale retrieval](http://www.cs.utexas.edu/~grauman/research/pubs-by-topic.html#Fast_similarity_search_and_image)系列Paper

- [**Norouzi**](http://www.cs.toronto.edu/~norouzi/)

>Hamming Distance Metric Learning  
Fast Search in Hamming Space with Multi-Index Hashing   
Minimal Loss Hashing for Compact Binary Codes, [code](http://www.cs.toronto.edu/~norouzi/research/mlh/)

- [**Fergus**](http://cs.nyu.edu/~fergus/pmwiki/pmwiki.php?n=PmWiki.Publications)

>Spectral Hashing  
Multidimensional Spectral Hashing

- [**Chhshen & Guosheng Lin**](http://cs.adelaide.edu.au/~chhshen/notes.html)

>A general two-step approach to learning-based hashing (CVPR 2013), [code](https://bitbucket.org/guosheng/two-step-hashing), [阅读笔记](http://www.dreamingo.com:9999/blog/General%20Two%20Step%20Approach%20to%20Learning%20Ba)  
Learning hash functions using column generation (ICML 2013), [code](https://bitbucket.org/guosheng/column-generation-hashing)  
Fast Supervised Hashing with Decision Trees (CVPR 2014), [Paper](http://arxiv.org/pdf/1404.1561v1.pdf) and [code](https://bitbucket.org/chhshen/fasthash/)

- [**Yunchao**](http://www.unc.edu/~yunchao/)

>Iterative Quantization (CVPR 2011), [**Project page**](http://www.unc.edu/~yunchao/itq.htm)    
Angular Quantization-based Binary Codes for Fast Similarity Search (NIPS 2012), [**Project page**](http://www.unc.edu/~yunchao/aqbc.htm)    
Learning Binary Codes for High-Dimensional Data Using Bilinear Projections (CVPR 2013), [**Project page**](http://www.unc.edu/~yunchao/bpbc.htm)

- [**kahe**](http://research.microsoft.com/en-us/um/people/kahe/)

>K-means Hashing (CVPR 2013), [**code**](http://research.microsoft.com/en-us/um/people/kahe/cvpr13/matlab_KMH_release_v1.1.rar)  
Optimized Product Quantization (CVPR 2013), [**Project page**](http://research.microsoft.com/en-us/um/people/kahe/cvpr13/index.html)

- [**Jun Wang**](http://www.ee.columbia.edu/~jwang/)

- [**Wei Liu**](http://www.ee.columbia.edu/~wliu/), 代表方法AGH

- [**Xianglong LIU**](http://www.nlsde.buaa.edu.cn/~xlliu/), 刘老师是2012年开始做哈希，发表过一系列论文，是国内做哈希比较早的学者，在他的主页上有一些他发表的哈希文章的代码。

## 他人讲解papers的一些好博文
- [Locality Sensitive Hashing(LSH)之随机投影法](http://www.strongczq.com/2012/04/locality-sensitive-hashinglsh%E4%B9%8B%E9%9A%8F%E6%9C%BA%E6%8A%95%E5%BD%B1%E6%B3%95.html)
- [Semi-Supervised Hashing](http://www.dreamingo.com:9999/blog/Semi-Supervised_Hashing)
- [Spherical Hashing](http://blog.csdn.net/zwwkity/article/details/8565485?reload)

## 非哈希方法

- [Liang Zheng](http://www.liangzheng.org/Publication.html)
	- Packing and Padding: Coupled Multi-Index for Accurate Image Retrieval
	- Bayes Merging of Multiple Vocabularies for Scalable Image Retrieval
	- Lp-norm IDF for Large Scale Image Search
	- Visual Phraselet: Refining Spatial Constraints for Large Scale Image Search

感谢这些公布代码的大神，本小硕向你们致以崇高的敬意，如果各位看官发觉还有没收录进来的，恳请留言以便补充完整。
