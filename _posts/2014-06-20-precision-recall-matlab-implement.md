---
layout: post
title: 图像检索：precision recall曲线Matlab实现
categories: [Image Retrieval]
tags: 图像检索
---

在用哈希进行检索时，常会用到precision recall曲线对其性能进行定量评价。precision recall的定义在[信息检索评价指标](http://yuanyong.org/blog/evaluation-of-information-retrieval.html)中已做了详细说明，这里再记录一下precision recall的具体实现。

precision recall曲线matlab一般使用的都是下面的版本：

```matlab
function [recall, precision, rate] = recall_precision(Wtrue, Dhat)
%
% Input:
%    Wtrue = true neighbors [Ntest * Ndataset], can be a full matrix NxN
%    Dhat  = estimated distances
%
% Output:
%
%                  exp. # of good pairs inside hamming ball of radius <= (n-1)
%  precision(n) = --------------------------------------------------------------
%                  exp. # of total pairs inside hamming ball of radius <= (n-1)
%
%               exp. # of good pairs inside hamming ball of radius <= (n-1)
%  recall(n) = --------------------------------------------------------------
%                          exp. # of total good pairs

max_hamm = max(Dhat(:))
hamm_thresh = min(3,max_hamm);

[Ntest, Ntrain] = size(Wtrue);
total_good_pairs = sum(Wtrue(:));

% find pairs with similar codes
precision = zeros(max_hamm,1);
recall = zeros(max_hamm,1);
rate = zeros(max_hamm,1);

for n = 1:length(precision)
    j = (Dhat<=((n-1)+0.00001));

    %exp. # of good pairs that have exactly the same code
    retrieved_good_pairs = sum(Wtrue(j));

    % exp. # of total pairs that have exactly the same code
    retrieved_pairs = sum(j(:));

    precision(n) = retrieved_good_pairs/retrieved_pairs;
    recall(n)= retrieved_good_pairs/total_good_pairs;
    rate(n) = retrieved_pairs / (Ntest*Ntrain);
end

% The standard measures for IR are recall and precision. Assuming that:
%
%    * RET is the set of all items the system has retrieved for a specific inquiry;
%    * REL is the set of relevant items for a specific inquiry;
%    * RETREL is the set of the retrieved relevant items
%
% then precision and recall measures are obtained as follows:
%
%    precision = RETREL / RET
%    recall = RETREL / REL

% if nargout == 0 || nargin > 3
%     if isempty(fig);
%         fig = figure;
%     end
%     figure(fig)
%
%     subplot(311)
%     plot(0:hamm_thresh-1, precision(1:hamm_thresh), varargin{:})
%     hold on
%     xlabel('hamming radius')
%     ylabel('precision')
%
%     subplot(312)
%     plot(0:hamm_thresh-1, recall(1:hamm_thresh), varargin{:})
%     hold on
%     xlabel('hamming radius');
%     ylabel('recall');
%
%    subplot(313);
%     plot(recall, precision, varargin{:});
%     hold on;
%     axis([0 1 0 1]);
%     xlabel('recall');
%     ylabel('precision');
%
%     drawnow;
% end
```

上面画precision和recall曲线函数来自于[Iterative Quantization: A Procrustean Approach to Learning Binary Codes](http://www.unc.edu/~yunchao/itq.htm)。BRE即[Code for Binary Reconstructive Hashing](http://www.cse.ohio-state.edu/~kulis/pubschron.htm)的代码中，同样有计算precision recall函数：

```matlab
function [score, recall] = evaluation(Wtrue, Dhat, fig, varargin)
%
% Input:
%    Wtrue = true neighbors [Ntest * Ndataset], can be a full matrix NxN
%    Dhat  = estimated distances
%   The next inputs are optional:
%    fig = figure handle
%    options = just like in the plot command
%
% Output:
%
%               exp. # of good pairs inside hamming ball of radius <= (n-1)
%  score(n) = --------------------------------------------------------------
%               exp. # of total pairs inside hamming ball of radius <= (n-1)
%
%               exp. # of good pairs inside hamming ball of radius <= (n-1)
%  recall(n) = --------------------------------------------------------------
%                          exp. # of total good pairs

[Ntest, Ntrain] = size(Wtrue);
total_good_pairs = sum(Wtrue(:));

% find pairs with similar codes
score = zeros(20,1);
for n = 1:length(score)
    j = find(Dhat<=((n-1)+0.00001));

    %exp. # of good pairs that have exactly the same code
    retrieved_good_pairs = sum(Wtrue(j));

    % exp. # of total pairs that have exactly the same code
    retrieved_pairs = length(j);

    score(n) = retrieved_good_pairs/retrieved_pairs;
    recall(n)= retrieved_good_pairs/total_good_pairs;
end

% The standard measures for IR are recall and precision. Assuming that:
%
%    * RET is the set of all items the system has retrieved for a specific inquiry;
%    * REL is the set of relevant items for a specific inquiry;
%    * RETREL is the set of the retrieved relevant items
%
% then precision and recall measures are obtained as follows:
%
%    precision = RETREL / RET
%    recall = RETREL / REL

if nargout == 0 || nargin > 3
    if isempty(fig);
        fig = figure;
    end
    figure(fig)
    subplot(211)
    plot(0:length(score)-1, score, varargin{:})
    hold on
    xlabel('hamming radium')
    ylabel('percent correct (precision)')
    title('percentage of good neighbors inside the hamm ball')
    subplot(212)
    plot(recall, score, varargin{:})
    hold on
    axis([0 1 0 1])
    xlabel('recall')
    ylabel('percent correct (precision)')
    drawnow
end
```

不难看出，上面的score就是前面的precision,在追溯到08年，也就是谱哈希SH发表的那年，同样可以在SH中有画precision recall的曲线，跟第二个一样。考证这些，无非就是想说在自己画PR曲线时，就用这些牛提供的比较靠谱，自己写出来的不一定对。

好了，再对画precision recall输入的参数做些梳理。画precision recall曲线时，用到的groundtruth是原欧式空间中查询样本的近邻，所以在计算Wtrue时，可以采用下面的方法计算：

```matlab
%center, then normalize data
X = X - ones(size(X,1),1)*mean(X);
for i = 1:size(X,1)
    X(i,:) = X(i,:) / norm(X(i,:));
end

rp = randperm(size(X,1));
trIdx = rp(1:trN);
testIdx = rp(trN+1:trN+testN);
Xtr = X(trIdx,:);
Xtst = X(testIdx,:);

D_tst = distMat(Xtst,Xtr);
D_tr = distMat(Xtr);
Dball = sort(D_tr,2);
Dball = mean(Dball(:,50));
WTT = D_tst < Dball;
```

上面第一步先对数据进行中心化，然后进行归一化。之后挑选出训练样本和测试样本（查询样本），然后计算Wture。Dhat就是计算查询样本与database之间的汉明距离，可以通过下面方法计算：

```matlab
%get Hamming distance between queries and database
B1 = compactbit(H);
B2 = compactbit(H_query);
Dhamm = hammingDist(B2,B1);
```

H是database中的编码，进行压缩以十进制数进行表示，同理H_query即为查询样本的编码。将上面都计算出来后，便可以得到precision和recall,plot一下就可以了。

参考：

[1]:[Code for Binary Reconstructive Hashing](http://www.cse.ohio-state.edu/~kulis/pubschron.htm)