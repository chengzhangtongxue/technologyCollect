var express = require('express');
var superagent = require('superagent');
var cheerio = require('cheerio');

var app = express();

app.get('/', function (req, res, next) {
    // 用 superagent 去抓取 https://cnodejs.org/ 的内容
    superagent.get('https://cnodejs.org/')
      .end(function (err, sres) {
        // 常规的错误处理
        if (err) {
          return next(err);
        }
        // sres.text 里面存储着网页的 html 内容，将它传给 cheerio.load 之后
        // 就可以得到一个实现了 jquery 接口的变量，我们习惯性地将它命名为 `$`
        // 剩下就都是 jquery 的内容了
        var $ = cheerio.load(sres.text);
        var items = [];
        $('#topic_list .cell').each(function (idx, element) {
          var $element = $(element);
          var $user = $element.find('.user_avatar img');
          var $topicTitle =  $element.find('.topic_title');
          items.push({
            title: $topicTitle.attr('title'),
            href: $topicTitle.attr('href'),
            author:$user.attr('title')
          });
        });
  
        res.send(items);
      });
  });

  app.listen(3000);