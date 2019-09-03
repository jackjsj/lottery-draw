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
    index: 14,
    desc: '夺宝券2张',
    img: imgPath + '2tickets.png',
  },
  {
    index: 6,
    desc: '8个钻石',
    img: imgPath + 'x8.png',
  },
  {
    index: 13,
    desc: '1个月超级机器人',
    img: imgPath + 'super.png',
  },
  {
    index: 7,
    desc: '88个钻石',
    img: imgPath + 'x88.png',
  },
  {
    index: 12,
    desc: '1个月高级机器人',
    img: imgPath + 'high-level.png',
  },
  {
    index: 11,
    desc: '碎片',
    img: imgPath + 'fragment.png',
  },
  {
    index: 10,
    desc: '1个月机器人',
    img: imgPath + '1month.png',
  },
  {
    index: 9,
    desc: '3天机器人',
    img: imgPath + '3days.png',
  },
  {
    index: 8,
    desc: '2天机器人',
    img: imgPath + '2days.png',
  },
];
const orders = [1, 2, 3, 4, 5, 6, 6, 13, 7, 12, 11, 10, 9, 8];
// 一次抽奖的时长
const periodPerDraw = 5000;

$(function() {
  const $prizeItems = $('.prize-item');
  $prizeItems.each(function(i, item) {
    $(item).html(
      `<img src="${prizes[i].img}"><p class="img-mask" data-index="${prizes[i].index}"></p>`
    );
  });

  function drawOne() {
    // 清除状态
    $('.img-mask').removeClass('active blink');
    //请求接口，获取序号, 这里模拟
    const resultNum = parseInt(Math.random() * orders.length) || 1;
    console.log(resultNum);
    let current = parseInt(Math.random() * orders.length) || 1;
    function roll() {
      const $cur = $(`.img-mask[data-index=${current}]`);
      current = current + 1;
      if (current > orders.length) {
        current = 1;
      }
      $cur.toggleClass('active');
      setTimeout(function() {
        $cur.toggleClass('active');
      }, 100);
    }
    let interval = setInterval(roll, 50);
    setTimeout(function() {
      clearInterval(interval);
      if (current === resultNum) roll();
      interval = setInterval(function() {
        roll();
        if (current === resultNum) {
          clearInterval(interval);
          const $cur = $(`.img-mask[data-index=${current}]`);
          $cur.addClass('active blink');
        }
      }, 111);
      $('#one-draw-btn').one('click', drawOne);
    }, periodPerDraw);
  }
  function drawTen() {
    console.log('drawTen');
    $('#ten-draw-btn').one('click', drawTen);
  }

  $('#one-draw-btn').one('click', drawOne);
  $('#ten-draw-btn').one('click', drawTen);
  // console.log($prizeItems);
});
