// 模拟请求数据
const imgPath = './src/img/prizes/';
const prizes = [
  {
    index: 1,
    desc: '5元话费券，用于话费充值',
    img: imgPath + '5yuan.png',
  },
  {
    index: 2,
    desc: '10元话费券，用于话费充值',
    img: imgPath + '10yuan.png',
  },
  {
    index: 3,
    desc: '30元话费券，用于话费充值',
    img: imgPath + '30yuan.png',
  },
  {
    index: 4,
    desc: '1天机器人',
    img: imgPath + '1day.png',
  },
  {
    index: 5,
    desc: '6个钻石',
    img: imgPath + 'x6.png',
  },
  {
    index: 6,
    desc: '夺宝券2张',
    img: imgPath + '2tickets.png',
  },
  {
    index: 7,
    desc: '8个钻石',
    img: imgPath + 'x8.png',
  },
  {
    index: 8,
    desc: '1个月超级机器人',
    img: imgPath + 'super.png',
  },
  {
    index: 9,
    desc: '88个钻石',
    img: imgPath + 'x88.png',
  },
  {
    index: 10,
    desc: '1个月高级机器人',
    img: imgPath + 'high-level.png',
  },
  {
    index: 11,
    desc: '碎片',
    img: imgPath + 'fragment.png',
  },
  {
    index: 12,
    desc: '1个月机器人',
    img: imgPath + '1month.png',
  },
  {
    index: 13,
    desc: '3天机器人',
    img: imgPath + '3days.png',
  },
  {
    index: 14,
    desc: '2天机器人',
    img: imgPath + '2days.png',
  },
];
const orders = [1, 2, 3, 4, 5, 7, 9, 14, 13, 12, 11, 10, 8, 6];
// 一次抽奖的时长
const periodPerDraw = 5000;
// 奖品类目数
const prizeNum = prizes.length;
// 计算时间差
function diff2Hms(diff) {
  //计算出小时数
  const h = Math.floor(diff / (3600 * 1000))
    .toString()
    .padStart(2, 0);
  //计算相差分钟数
  const leave1 = diff % (3600 * 1000); //计算小时后剩余的毫秒数
  const m = Math.floor(leave1 / (60 * 1000))
    .toString()
    .padStart(2, 0);
  //计算相差秒数
  const leave2 = leave1 % (60 * 1000); //计算分钟数后剩余的毫秒数
  const s = Math.round(leave2 / 1000)
    .toString()
    .padStart(2, 0);
  return { h, m, s };
}

$(function() {
  const $prizeItems = $('.prize-item');
  $prizeItems.each(function(i, item) {
    $(item).html(
      `<img class="prize-img" data-index="${i + 1}" src="${
        prizes[i].img
      }"><p class="img-mask" data-index="${i + 1}"></p>`
    );
  });
  // 当前抽奖状态 false:待抽奖 | true: 抽奖中
  let drawState = false;
  // 当前抢单状态 false:待抢单 | true: 正在抢单
  let scrambleState = false;
  /**
   * 抽1次
   * @param {Number} resultNum 最终抽中的序号
   */
  function drawOne(resultNum) {
    return new Promise(function(resolve, reject) {
      // 随机抽奖起始序号
      let current = parseInt(Math.random() * prizeNum) || 1;
      function roll() {
        const $cur = $(`.img-mask[data-index=${current}]`);
        // 找到current在orders中的索引，获取索引加1的值
        let curOrderIndex = orders.indexOf(current);
        curOrderIndex = curOrderIndex + 1;
        if (curOrderIndex > prizeNum - 1) {
          curOrderIndex = 0;
        }
        current = orders[curOrderIndex];
        $cur.addClass('active');
        setTimeout(function() {
          $cur.removeClass('active');
        }, 100);
      }
      let interval = setInterval(roll, 50); //50ms 更换一次光圈位置，顺时针转动
      setTimeout(function() {
        // periodPerDraw 后停止转动
        clearInterval(interval);
        if (current === resultNum) roll();
        interval = setInterval(function() {
          roll();
          if (current === resultNum) {
            clearInterval(interval);
            const $cur = $(`.img-mask[data-index=${resultNum}]`);
            $cur.addClass('highlight blink');
            setTimeout(function() {
              resolve({
                resultNum,
              });
            }, 300);
          }
        }, 100);
      }, periodPerDraw);
    });
  }
  /**
   * 抽10次
   * @param {Array} resultNums 最终抽中的序号集合
   */
  function drawTen(resultNums) {
    drawOne(resultNums[0]).then(function() {
      //显示抽奖结果
      const $lotterResultPanel = $('#lottery-result-panel');
      let html = '<div class="result-prize-wrapper">';
      resultNums.forEach(function(item) {
        const $cur = $(`.img-mask[data-index=${item}]`);
        $cur.addClass('highlight blink');
        const imgSrc = $(`.prize-img[data-index=${item}]`).attr('src');
        html += `<img class="result-prize-img" src="${imgSrc}">`;
      });
      html += '</div>';
      $lotterResultPanel.html(html);
      $lotterResultPanel.removeClass('zoomOut').show();
      $('body').one('click', function() {
        $('.img-mask').removeClass('highlight active blink');
        $('#lottery-result-panel').addClass('zoomOut');
        setTimeout(function() {
          $lotterResultPanel.hide();
        }, 800);
      });
      drawState = false; // 抽奖结束
    });
  }

  // 抽1次按钮点击事件
  $('#one-draw-btn').on('click', function() {
    if (drawState) {
      //处于抽奖中状态，不可抽奖
      return;
    }
    // 初始状态
    $('.img-mask').removeClass('highlight active blink');
    drawState = true;
    //请求接口，获取序号, 这里模拟
    const resultNum = parseInt(Math.random() * prizeNum) || 1;
    console.log('抽中的奖品序号为：' + resultNum);
    drawOne(resultNum).then(function(e) {
      //抽完后执行回调
      //显示抽奖结果
      const imgSrc = $(`.prize-img[data-index=${e.resultNum}]`).attr('src');
      const $lotterResultPanel = $('#lottery-result-panel');
      $lotterResultPanel.html(
        `<div class="result-prize-wrapper"><img src="${imgSrc}"></div>`
      );
      $lotterResultPanel.removeClass('zoomOut').show();
      $('body').one('click', function() {
        $('.img-mask').removeClass('highlight active blink');
        $('#lottery-result-panel').addClass('zoomOut');
        setTimeout(function() {
          $lotterResultPanel.hide();
        }, 800);
      });
      drawState = false; // 抽奖结束
    });
  });

  // 抽10次按钮点击事件
  $('#ten-draw-btn').on('click', function() {
    if (drawState) {
      //处于抽奖中状态，不可抽奖
      return;
    }
    // 初始状态
    $('.img-mask').removeClass('highlight active blink');
    drawState = true;
    //请求接口，获取序号数组, 这里模拟
    const resultNums = new Array(10)
      .fill()
      .map((item) => parseInt(Math.random() * prizeNum) || 1);
    console.log('抽中的奖品序号为：' + resultNums.join(','));
    drawTen(resultNums);
  });

  // 抢单按钮点击
  $('#order-scramble-btn').on('click', function() {
    if (this.scrambleState) {
      return;
    }
    this.scrambleState = true;
    // 获取结束时间
    const endTime = Date.now() + (Math.random() * 30 + 1) * 60 * 1000; // 模拟
    // 计算与当前时间的差值
    let diff = endTime - Date.now();
    console.log(diff);
    let hms = diff2Hms(diff);
    console.log(hms);
    let html = `<p class="f02">预计${Number(hms.h) * 60 +
      Number(hms.m)}分钟完成</p>
    <p class="f06">正在抢单</p>
    <p class="f04" id="scramble-countdown">${hms.h}:${hms.m}:${hms.s}</p>`;
    $('#order-scramble-btn').html(html);
    let countDownInt = setInterval(function() {
      diff = endTime - Date.now();
      hms = diff2Hms(diff);
      if (diff > 0) {
        $('#scramble-countdown').html(`${hms.h}:${hms.m}:${hms.s}`);
      } else {
        clearInterval(countDownInt);
        $('#order-scramble-btn').html(`<p class="f06">开始抢单</p>`);
        this.scrambleState = false;
      }
    }, 1000);
  });
});
