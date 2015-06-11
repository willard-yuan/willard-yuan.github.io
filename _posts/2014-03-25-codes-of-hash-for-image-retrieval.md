---
layout: post
title: Hashing图像检索源码及数据库总结
categories: [Image Retrieval]
---

下面的这份哈希算法小结来源于本周的周报，原本并没有打算要贴出来的，不过，考虑到这些资源属于关注利用哈希算法进行大规模图像搜索的各位看官应该很有用，所以好东西本小子就不私藏了。本资源汇总最主要的收录原则是原作者主页上是否提供了源代码，为了每种方法的资料尽可能完整，本小子会尽可能的除提供源码下载地址外，还会给出PDF文章的链接、项目主页，slide等。

>对哈希方法重新进行调研，右图是找到的提供有部分源码的哈希方法，这其中包含了比较经典的哈希方法，比如e2lsh、mih，同时也包含有最近几年一直到13年提出来的一些比较新的哈希算法，比如13年提出的有bpbc、opq、ksh。

上面这一段是摘自本小子的周报(本小子这周除改了篇文章，其余时间几乎都在打酱油，谁叫老板不给发工资，O(∩_∩)O~)，引用中的“右图”可以略过，直接看下面不同哈希算法的链接信息。

---
###哈希方法

公布代码的：

1. **AGH**: Hashing with Graphs [\[Paper\]](http://machinelearning.wustl.edu/mlpapers/paper_files/ICML2011Liu_6.pdf) [\[Code\]](http://www.ee.columbia.edu/~wliu/Anchor_Graph_Hash.zip)
2. **BPBC**: Learning Binary Codes for High-Dimensional Data Using Bilinear Projections [\[Paper\]](http://www.unc.edu/~yunchao/papers/CVPR13.pdf) [\[Code\]](http://www.unc.edu/~yunchao/bpbc.htm)
3. **BRE**: Learning to Hash with Binary Reconstructive Embeddings [\[Paper\]](http://www.cse.ohio-state.edu/~kulis/pubs/bre_nips.pdf) [\[Code\]](http://www.cse.ohio-state.edu/~kulis/bre/bre.tar.gz)
4. **DBQ**: Double-bit quantization for hashing [\[Paper\]](http://cs.nju.edu.cn/lwj/paper/AAAI12_DBQ.pdf) [\[Code\]]( http://cs.nju.edu.cn/lwj/code/DBQ.rar)
5. **E2LSH**: Local Sensitive Hash [\[Project Page\]](http://www.mit.edu/~andoni/LSH/) ~~read~~
6. **HDML**: Hamming Distance Metric Learning [\[Paper\]](http://www.cs.toronto.edu/~norouzi/research/papers/hdml.pdf) [\[Code\]](https://github.com/norouzi/hdml)
7. **IMH**: Inter-Media Hashing for Large-scale Retrieval from Heterogenous Data Sources [\[Project Page\]](http://staff.itee.uq.edu.au/shenht/UQ_IMH) [\[Code\]](http://staff.itee.uq.edu.au/shenht/UQ_IMH/imh.7z)
8. **ISOH**: Isotropic Hashing [\[Paper\]](http://cs.nju.edu.cn/lwj/paper/NIPS12-IsoHash.pdf) [\[Code\]](http://cs.nju.edu.cn/lwj/code/IsoHash.zip)
9. **ITQ**: Iterative Quantization: A Procrustean Approach to Learning Binary Codes [\[Project Page\]](http://www.unc.edu/~yunchao/itq.htm) [\[Paper\]](http://www.unc.edu/~yunchao/papers/CVPR11_a.pdf) [\[Code\]](http://www.unc.edu/~yunchao/code/smallcode.zip) ~~read~~
10. **KLSH**: Kernelized Locality-Sensitive Hashing for Scalable Image Search [\[Project Page\]](http://www.cse.ohio-state.edu/~kulis/klsh/klsh.htm) [\[Paper\]](http://www.cse.ohio-state.edu/~kulis/pubs/iccv_klsh.pdf) [\[Code\]](http://www.cse.ohio-state.edu/~kulis/klsh/klsh_code.tar.gz)
11. **KMH**: K-means Hashing: an Affinity-Preserving Quantization Method for Learning Binary Compact Codes [\[Paper\]](http://131.107.65.14/en-us/um/people/kahe/publications/cvpr13kmh.pdf) [\[Code\]](http://131.107.65.14/en-us/um/people/kahe/cvpr13/matlab_KMH_release_v1.1.rar) ~~read~~
12. **KSH**: Supervised Hashing with Kernels [\[Paper\]](http://www.ee.columbia.edu/~wliu/CVPR12_ksh.pdf) [\[Code\]](http://www.ee.columbia.edu/~wliu/ksh_code.zip) ~~read~~
13. **MDSH**: Multidimensional Spectral Hashing [\[Paper\]](http://people.csail.mit.edu/torralba/publications/msh_eccv12.pdf) [\[Code\]](http://www.cs.huji.ac.il/~yweiss/export2.tar)
14. **MH**: Manhattan hashing for large-scale image retrieval [\[Paper\]](http://cs.nju.edu.cn/lwj/paper/SIGIR12_MH.pdf) [\[Code\]](http://cs.nju.edu.cn/lwj/code/MH.rar) ~~read~~
15. **MLH**: Minimal Loss Hashing for Compact Binary Codes [\[Paper\]](http://www.cs.toronto.edu/~norouzi/research/papers/min_loss_hash.pdf) [\[Code\]](http://www.cs.toronto.edu/~norouzi/research/mlh/) [\[Slide\]]( http://www.cs.toronto.edu/~norouzi/research/slides/mlh-icml.ppt) （KMH中有提到MLH是一种半监督的哈希）
16. **OPQ**: Optimized Product Quantization for Approximate Nearest Neighbor Search [\[Paper\]](http://131.107.65.14/en-us/um/people/kahe/publications/cvpr13opq.pdf) [\[Code\]]( http://131.107.65.14/en-us/um/people/kahe/cvpr13/matlab_OPQ_release_v1.1.rar)
17. **SH**: Spectral Hashing [\[Paper\]](http://people.csail.mit.edu/torralba/publications/spectralhashing.pdf) [\[Code\]]( http://www.cs.huji.ac.il/~yweiss/SpectralHashing/sh.zip) ~~read~~
18. **IHM**: Inductive Hashing on Manifolds (2013 CVPR) [ProjectPage](http://cs.adelaide.edu.au/~chhshen/projects/inductive_hashing/) ~~read~~
19. **BSPH**: Semi-supervised Nonlinear Hashing Using Bootstrap Sequential Projection Learning (2012 TKDE)[ProjectPage](http://appsrv.cse.cuhk.edu.hk/~jkzhu/bnsplh/) ~~read~~
20. **FastHash**: Fast Supervised Hashing with Decision Trees for High-Dimensional Data (2014 CVPR) [\[Code\]](https://bitbucket.org/chhshen/fasthash) ~~read~~
21. **Spherical Hashing**: Spherical Hashing (2012 CVPR)~~read~~

无代码：

1. **PDH**: [Predictable Dual-View Hashing](http://www.umiacs.umd.edu/~jhchoi/paper/icml2013_pdh.pdf) (ICML2013) ~~read~~

---
###常用数据库
1. [**LabelMe**](http://www.cs.toronto.edu/~norouzi/research/mlh/data/LabelMe_gist.mat)
2. [**min-loss-hashing**](https://github.com/willard-yuan/min-loss-hashing/tree/master/matlab)

---
###关注的人

注：下面不同的哈希方法的代码可以在他们的主页上找到

- [**Grauman**](http://cs.nyu.edu/~fergus/pmwiki/pmwiki.php?n=PmWiki.Publications)
>[Image search and large-scale retrieval](http://www.cs.utexas.edu/~grauman/research/pubs-by-topic.html#Fast_similarity_search_and_image)系列Paper   

- [**Norouzi**](http://www.cs.toronto.edu/~norouzi/)
>Hamming Distance Metric Learning
>
>Fast Search in Hamming Space with Multi-Index Hashing
>
>Minimal Loss Hashing for Compact Binary Codes [**code**](http://www.cs.toronto.edu/~norouzi/research/mlh/)

- [**Fergus**](http://cs.nyu.edu/~fergus/pmwiki/pmwiki.php?n=PmWiki.Publications)
>Spectral Hashing ~~read~~
>
>Multidimensional Spectral Hashing

- [**Chhshen & Guosheng Lin**](http://cs.adelaide.edu.au/~chhshen/notes.html)
>A general two-step approach to learning-based hashing (CVPR 2013)[**code in Bitbucket**](https://bitbucket.org/guosheng/two-step-hashing)</br>
>[**阅读笔记**](http://www.dreamingo.com:9999/blog/General%20Two%20Step%20Approach%20to%20Learning%20Ba)
>
>Learning hash functions using column generation (ICML 2013)[**code in Bitbucket**](https://bitbucket.org/guosheng/column-generation-hashing)
>
>Fast Supervised Hashing with Decision Trees (CVPR 2014)[Paper](http://arxiv.org/pdf/1404.1561v1.pdf)[**code in Bitbucket**](https://bitbucket.org/chhshen/fasthash/) ~~read~~

- [**Yunchao**](http://www.unc.edu/~yunchao/)
>Iterative Quantization (CVPR 2011)[**Project page**](http://www.unc.edu/~yunchao/itq.htm) ~~read~~
>
>Angular Quantization-based Binary Codes for Fast Similarity Search (NIPS 2012)[**Project page**](http://www.unc.edu/~yunchao/aqbc.htm)
>
>Learning Binary Codes for High-Dimensional Data Using Bilinear Projections (CVPR 2013)[**Project page**](http://www.unc.edu/~yunchao/bpbc.htm)

- [**kahe**](http://research.microsoft.com/en-us/um/people/kahe/)
>K-means Hashing (CVPR 2013)[**code link from his homepage**](http://research.microsoft.com/en-us/um/people/kahe/cvpr13/matlab_KMH_release_v1.1.rar) ~~read~~
>
>Optimized Product Quantization (CVPR 2013)[**Project page**](http://research.microsoft.com/en-us/um/people/kahe/cvpr13/index.html)

- [**Jun Wang**](http://www.ee.columbia.edu/~jwang/)

- [**Wei Liu **](http://www.ee.columbia.edu/~wliu/)

---
###他人讲解papers的一些好博文
- [Locality Sensitive Hashing(LSH)之随机投影法](http://www.strongczq.com/2012/04/locality-sensitive-hashinglsh%E4%B9%8B%E9%9A%8F%E6%9C%BA%E6%8A%95%E5%BD%B1%E6%B3%95.html)
- [Semi-Supervised Hashing](http://www.dreamingo.com:9999/blog/Semi-Supervised_Hashing)
- [Spherical Hashing](http://blog.csdn.net/zwwkity/article/details/8565485?reload)

---

###非哈希方法

- [liangzheng](http://www.liangzheng.org/Publication.html)
	- Packing and Padding: Coupled Multi-Index for Accurate Image Retrieval
	- Bayes Merging of Multiple Vocabularies for Scalable Image Retrieval
	- Lp-norm IDF for Large Scale Image Search
	- Visual Phraselet: Refining Spatial Constraints for Large Scale Image Search

感谢这些公布代码的大神，本小硕向你们致以崇高的敬意，如果各位看官发觉还有没收录进来的，恳请留言以便补充完整。
