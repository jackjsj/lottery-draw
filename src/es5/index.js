'use strict';

// 模拟请求数据
var imgPath = './src/img/prizes/';
/**
 * 说明：
 * prizes中的数组顺序是div的顺序，即从左往右，从上往下的依次列出
 * 而对象中的index是以左上为第一个div的顺时针的顺序
 * 必须严格按这个顺序生成数组以及index值
 */
var prizes = [{
  index: 1,
  desc: '5元话费券，用于话费充值',
  img: imgPath + '5yuan.png'
}, {
  index: 2,
  desc: '10元话费券，用于话费充值',
  img: imgPath + '10yuan.png'
}, {
  index: 3,
  desc: '30元话费券，用于话费充值',
  img: imgPath + '30yuan.png'
}, {
  index: 4,
  desc: '1天机器人',
  img: imgPath + '1day.png'
}, {
  index: 5,
  desc: '6个钻石',
  img: imgPath + 'x6.png'
}, {
  index: 14,
  desc: '夺宝券2张',
  img: imgPath + '2tickets.png'
}, {
  index: 6,
  desc: '8个钻石',
  img: imgPath + 'x8.png'
}, {
  index: 13,
  desc: '1个月超级机器人',
  img: imgPath + 'super.png'
}, {
  index: 7,
  desc: '88个钻石',
  img: imgPath + 'x88.png'
}, {
  index: 12,
  desc: '1个月高级机器人',
  img: imgPath + 'high-level.png'
}, {
  index: 11,
  desc: '碎片',
  img: imgPath + 'fragment.png'
}, {
  index: 10,
  desc: '1个月机器人',
  img: imgPath + '1month.png'
}, {
  index: 9,
  desc: '3天机器人',
  img: imgPath + '3days.png'
}, {
  index: 8,
  desc: '2天机器人',
  img: imgPath + '2days.png'
}];

// 一次抽奖的时长
var periodPerDraw = 5000;
// 奖品类目数
var prizeNum = prizes.length;
// 计算时间差
function diff2Hms(diff) {
  //计算出小时数
  var h = Math.floor(diff / (3600 * 1000)).toString().padStart(2, 0);
  //计算相差分钟数
  var leave1 = diff % (3600 * 1000); //计算小时后剩余的毫秒数
  var m = Math.floor(leave1 / (60 * 1000)).toString().padStart(2, 0);
  //计算相差秒数
  var leave2 = leave1 % (60 * 1000); //计算分钟数后剩余的毫秒数
  var s = Math.round(leave2 / 1000).toString().padStart(2, 0);
  return { h: h, m: m, s: s };
}

$(function () {
  var $prizeItems = $('.prize-item');
  $prizeItems.each(function (i, item) {
    $(item).html('<img class="prize-img" data-index="' + prizes[i].index + '" src="' + prizes[i].img + '"><p class="img-mask" data-index="' + prizes[i].index + '"></p>');
  });
  // 当前抽奖状态 false:待抽奖 | true: 抽奖中
  var drawState = false;
  // 当前抢单状态 false:待抢单 | true: 正在抢单
  var scrambleState = false;
  /**
   * 抽1次
   * @param {Number} resultNum 最终抽中的序号
   */
  function drawOne(resultNum) {
    return new Promise(function (resolve, reject) {
      // 随机抽奖起始序号
      var current = parseInt(Math.random() * prizeNum) || 1;
      function roll() {
        var $cur = $('.img-mask[data-index=' + current + ']');
        current = current + 1;
        if (current > prizeNum) {
          current = 1;
        }
        $cur.addClass('active');
        setTimeout(function () {
          $cur.removeClass('active');
        }, 100);
      }
      var interval = setInterval(roll, 50); //50ms 更换一次光圈位置，顺时针转动
      setTimeout(function () {
        // periodPerDraw 后停止转动
        clearInterval(interval);
        if (current === resultNum) roll();
        interval = setInterval(function () {
          roll();
          if (current === resultNum) {
            clearInterval(interval);
            var $cur = $('.img-mask[data-index=' + resultNum + ']');
            $cur.addClass('highlight blink');
            setTimeout(function () {
              resolve({
                resultNum: resultNum
              });
            }, 1200);
          }
        }, 100);
      }, periodPerDraw);
    });
  }
  /**
   * 抽10次
   * @param {Array} resultNums 最终抽中的序号集合
   */
  async function drawTen(resultNums) {
    var results = [];
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = resultNums[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var i = _step.value;

        var _ref = await drawOne(i),
            resultNum = _ref.resultNum;

        results.push(resultNum);
      }
      //显示抽奖结果
    } catch (err) {
      _didIteratorError = true;
      _iteratorError = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion && _iterator.return) {
          _iterator.return();
        }
      } finally {
        if (_didIteratorError) {
          throw _iteratorError;
        }
      }
    }

    var $lotterResultPanel = $('#lottery-result-panel');
    var html = '<div class="result-prize-wrapper">';
    results.forEach(function (item) {
      var imgSrc = $('.prize-img[data-index=' + item + ']').attr('src');
      html += '<img class="result-prize-img" src="' + imgSrc + '">';
    });
    html += '</div>';
    $lotterResultPanel.html(html);
    $lotterResultPanel.removeClass('zoomOut').show();
    $('body').one('click', function () {
      $('#lottery-result-panel').addClass('zoomOut');
      setTimeout(function () {
        $lotterResultPanel.hide();
      }, 800);
    });
    drawState = false; // 抽奖结束
    console.log(results);
  }

  // 抽1次按钮点击事件
  $('#one-draw-btn').on('click', function () {
    if (drawState) {
      //处于抽奖中状态，不可抽奖
      return;
    }
    // 初始状态
    $('.img-mask').removeClass('highlight active blink');
    drawState = true;
    //请求接口，获取序号, 这里模拟
    var resultNum = parseInt(Math.random() * prizeNum) || 1;
    console.log('抽中的奖品序号为：' + resultNum);
    drawOne(resultNum).then(function (e) {
      //抽完后执行回调
      //显示抽奖结果
      var imgSrc = $('.prize-img[data-index=' + e.resultNum + ']').attr('src');
      var $lotterResultPanel = $('#lottery-result-panel');
      $lotterResultPanel.html('<div class="result-prize-wrapper"><img src="' + imgSrc + '"></div>');
      $lotterResultPanel.removeClass('zoomOut').show();
      $('body').one('click', function () {
        $('#lottery-result-panel').addClass('zoomOut');
        setTimeout(function () {
          $lotterResultPanel.hide();
        }, 800);
      });
      drawState = false; // 抽奖结束
    });
  });

  // 抽10次按钮点击事件
  $('#ten-draw-btn').on('click', function () {
    if (drawState) {
      //处于抽奖中状态，不可抽奖
      return;
    }
    // 初始状态
    $('.img-mask').removeClass('highlight active blink');
    drawState = true;
    //请求接口，获取序号数组, 这里模拟
    var resultNums = new Array(10).fill().map(function (item) {
      return parseInt(Math.random() * prizeNum) || 1;
    });
    console.log('抽中的奖品序号为：' + resultNums.join(','));
    drawTen(resultNums);
  });

  // 抢单按钮点击
  $('#order-scramble-btn').on('click', function () {
    if (this.scrambleState) {
      return;
    }
    this.scrambleState = true;
    // 获取结束时间
    var endTime = Date.now() + (Math.random() * 30 + 1) * 60 * 1000; // 模拟
    // 计算与当前时间的差值
    var diff = endTime - Date.now();
    console.log(diff);
    var hms = diff2Hms(diff);
    console.log(hms);
    var html = '<p class="f02">\u9884\u8BA1' + (Number(hms.h) * 60 + Number(hms.m)) + '\u5206\u949F\u5B8C\u6210</p>\n    <p class="f06">\u6B63\u5728\u62A2\u5355</p>\n    <p class="f04" id="scramble-countdown">' + hms.h + ':' + hms.m + ':' + hms.s + '</p>';
    $('#order-scramble-btn').html(html);
    var countDownInt = setInterval(function () {
      diff = endTime - Date.now();
      hms = diff2Hms(diff);
      if (diff > 0) {
        $('#scramble-countdown').html(hms.h + ':' + hms.m + ':' + hms.s);
      } else {
        clearInterval(countDownInt);
        $('#order-scramble-btn').html('<p class="f06">\u5F00\u59CB\u62A2\u5355</p>');
        this.scrambleState = false;
      }
    }, 1000);
  });
});