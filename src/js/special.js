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
          `<div class="special-pool-item rel">
            <img src="${item.img}" data-index="${i + 1}">
            <p class="img-mask" data-index="${i + 1}"></p>
            <p class="special-pool-item-num">x${item.num}</p>
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
      $('#special-draw-result-popup-wrapper')
        .addClass('zoomOut')
        .hide();
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
      if (left2Right) {
        current = current + 1;
      } else {
        current = current - 1;
      }
      if (current > 3) {
        left2Right = false;
      }
      if (current < 2) {
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
          // 再弹一个窗口
          showResultPanel(resultNum);
        }
      }, 100);
    }, periodPerDraw); // periodPerDraw秒后停止转动
  }

  // 显示结果弹窗
  function showResultPanel(resultNum) {
    // 渲染中奖结果
    const targetItem = specialPrizes[resultNum - 1];
    const $wrapper = $('#special-draw-result-popup-wrapper');
    const $resultPopup = $('#special-draw-result-popup');
    $resultPopup.html(
      `<div class="special-pool-item">
        <img src="${targetItem.img}" data-index="${resultNum}">
        <p class="img-mask" data-index="${resultNum}"></p>
        <p class="special-pool-item-num">x${targetItem.num}</p>
      </div>`
    );
    $wrapper.removeClass('zoomOut').show();
  }

  // 模拟特殊奖池数据
  const imgPath = './src/img/prizes/';
  const specialPrizes = [
    {
      index: 1,
      desc: '10个钻石',
      img: imgPath + 'sample.png',
      num: 10,
    },
    {
      index: 2,
      desc: '1000个钻石',
      img: imgPath + 'sample.png',
      num: 1000,
    },
    {
      index: 3,
      desc: '2000个钻石',
      img: imgPath + 'sample.png',
      num: 2000,
    },
    {
      index: 4,
      desc: '10000个钻石',
      img: imgPath + 'sample.png',
      num: 10000,
    },
  ];

  $('#specialBtn').click((e) => {
    e.stopPropagation();

    // 显示抽奖弹窗
    showPopup(specialPrizes);
  });
});
