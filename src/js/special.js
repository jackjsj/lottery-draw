$(document).ready(() => {
  let specialDrawState = false;
  // 一次抽奖的时长
  const periodPerDraw = 5000;
  // 显示弹窗
  function showPopup(prizes) {
    // 渲染奖池
    const $specialPool = $('#special-pool');
    const html = prizes
      .map(
        (item, i) =>
          `<div class="special-pool-item">
            <img src="${item.img}" data-index="${i + 1}">
            <p class="img-mask" data-index="${i + 1}"></p>
          </div>`
      )
      .join('');
    $specialPool.html(html);
    const $popup = $('#special-draw-popup');
    // 监听开始点击事件
    $popup.on('click', '.start-btn', (e) => {
      e.stopPropagation();
      // 开始抽奖
      if (specialDrawState) {
        //处于抽奖中状态，不可抽奖
        return;
      }
      specialDrawState = true;
      specialDraw();
    });
    $popup.removeClass('zoomOut').show();
    $('body').one('click', function() {
      $popup.addClass('zoomOut');
      setTimeout(function() {
        $popup.hide();
      }, 100);
    });
  }

  function specialDraw() {
    // 清除抽中高亮效果
    $(`#special-pool .img-mask`).removeClass('highlight blink');
    // 模拟抽中的奖序号为
    const resultNum = parseInt(Math.random() * 3) + 1;
    // 开始转动
    let current = parseInt(Math.random() * 3) + 1; // 随机开始点
    let left2Right = true;
    function roll() {
      const $cur = $(`#special-pool .img-mask[data-index=${current}]`);
      if(left2Right){
        current = current + 1;
      }else{
        current = current - 1;
      }
      if (current > 3) {
        left2Right = false;
      }
      if(current < 2){
        left2Right = true;
      }
      $cur.addClass('active');
      setTimeout(function() {
        $cur.removeClass('active');
      }, 100);
    }
    let interval = setInterval(roll, 100); //50ms 更换一次光圈位置，1-4依次转动
    setTimeout(() => {
      clearInterval(interval);
      if (current === resultNum) roll();
      interval = setInterval(function() {
        roll();
        if (current === resultNum) {
          clearInterval(interval);
          const $cur = $(`#special-pool .img-mask[data-index=${resultNum}]`);
          $cur.addClass('highlight blink');
          specialDrawState = false; // 关闭抽奖状态
          console.log('抽中的序号为：' + resultNum);
        }
      }, 100);
    }, periodPerDraw); // periodPerDraw秒后停止转动
  }

  // 模拟特殊奖池数据
  const imgPath = './src/img/prizes/';
  const specialPrizes = [
    {
      index: 1,
      desc: '10个钻石',
      img: imgPath + 'x10.png',
    },
    {
      index: 2,
      desc: '1000个钻石',
      img: imgPath + 'x1000.png',
    },
    {
      index: 3,
      desc: '2000个钻石',
      img: imgPath + 'x2000.png',
    },
    {
      index: 4,
      desc: '10000个钻石',
      img: imgPath + 'x10000.png',
    },
  ];

  $('#specialBtn').click((e) => {
    e.stopPropagation();

    // 显示抽奖弹窗
    showPopup(specialPrizes);
  });
});
