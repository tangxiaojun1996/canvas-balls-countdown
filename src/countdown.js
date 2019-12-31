var WINDOW_WIDTH = 1024;
var WINDOW_HEIGHT = 768;
var RADIUS = 8;
var MARGIN_TOP = 60;
var MARGIN_LEFT = 30;

const endTime = new Date(2019, 11, 26, 18, 47, 52);
var curShowTimeSeconds = 0;

var balls = [];
const colors = [
  "#33B5E5",
  "#0099CC",
  "#AA66CC",
  "#9933CC",
  "#99CC00",
  "#669900",
  "#FFBB33",
  "#FF8800",
  "#FF4444",
  "#CC0000"
];

window.onload = function() {
  MARGIN_LEFT = Math.round(WINDOW_WIDTH / 10);
  RADIUS = Math.round((WINDOW_WIDTH * 4) / 5 / 108) - 1;
  MARGIN_TOP = Math.round(WINDOW_HEIGHT / 5);

  var canvas = document.getElementById("canvas");
  var context = canvas.getContext("2d");

  canvas.width = WINDOW_WIDTH;
  canvas.height = WINDOW_HEIGHT;

  curShowTimeSeconds = getCurrentShowTimeSeconds();

  // start
  setInterval(function() {
    render(context);
    update();
  }, 50);
};

// 绘制数字
function renderDigit(x, y, num, cxt) {
  cxt.fillStyle = "rgb(0,102,153)";

  for (var i = 0; i < digit[num].length; i++)
    for (var j = 0; j < digit[num][i].length; j++)
      // 0不绘制， 1 才绘制小球
      if (digit[num][i][j] == 1) {
        cxt.beginPath();
        cxt.arc(
          x + j * 2 * (RADIUS + 1) + (RADIUS + 1),
          y + i * 2 * (RADIUS + 1) + (RADIUS + 1),
          RADIUS,
          0,
          2 * Math.PI
        );
        cxt.closePath();

        cxt.fill();
      }
}

// 绘制
function render(cxt) {
  cxt.clearRect(0, 0, WINDOW_WIDTH, WINDOW_HEIGHT); // 清除上一次绘制的内容

  var hours = parseInt(curShowTimeSeconds / 3600);
  var minutes = parseInt((curShowTimeSeconds - hours * 3600) / 60);
  var seconds = curShowTimeSeconds % 60;

  // 需要一位一位绘制数字
  // 时
  renderDigit(MARGIN_LEFT, MARGIN_TOP, parseInt(hours / 10), cxt); // parseInt对应的数值就是其数值数组的索引
  renderDigit(
    MARGIN_LEFT + 15 * (RADIUS + 1),
    MARGIN_TOP,
    parseInt(hours % 10),
    cxt
  );
  renderDigit(MARGIN_LEFT + 30 * (RADIUS + 1), MARGIN_TOP, 10, cxt); // 10是冒号
  // 分
  renderDigit(
    MARGIN_LEFT + 39 * (RADIUS + 1),
    MARGIN_TOP,
    parseInt(minutes / 10),
    cxt
  );
  renderDigit(
    MARGIN_LEFT + 54 * (RADIUS + 1),
    MARGIN_TOP,
    parseInt(minutes % 10),
    cxt
  );
  renderDigit(MARGIN_LEFT + 69 * (RADIUS + 1), MARGIN_TOP, 10, cxt);
  // 秒
  renderDigit(
    MARGIN_LEFT + 78 * (RADIUS + 1),
    MARGIN_TOP,
    parseInt(seconds / 10),
    cxt
  );
  renderDigit(
    MARGIN_LEFT + 93 * (RADIUS + 1),
    MARGIN_TOP,
    parseInt(seconds % 10),
    cxt
  );

  // 绘制 balls 每一个动球
  for (var i = 0; i < balls.length; i++) {
    cxt.fillStyle = balls[i].color;

    cxt.beginPath();
    cxt.arc(balls[i].x, balls[i].y, RADIUS, 0, 2 * Math.PI, true);
    cxt.closePath();

    cxt.fill();
  }
}

function getCurrentShowTimeSeconds() {
  var curTime = new Date();
  var ret = endTime.getTime() - curTime.getTime();
  ret = Math.round(ret / 1000);

  return ret >= 0 ? ret : 0;
}

function update() {
  var nextShowTimeSeconds = getCurrentShowTimeSeconds(); // 获取还要倒计时的总时间

  var nextHours = parseInt(nextShowTimeSeconds / 3600);
  var nextMinutes = parseInt((nextShowTimeSeconds - nextHours * 3600) / 60);
  var nextSeconds = nextShowTimeSeconds % 60;

  var curHours = parseInt(curShowTimeSeconds / 3600);
  var curMinutes = parseInt((curShowTimeSeconds - curHours * 3600) / 60);
  var curSeconds = curShowTimeSeconds % 60;

  // 判断时间发生变化
  if (nextSeconds != curSeconds) {
    if (parseInt(curHours / 10) != parseInt(nextHours / 10)) {
      addBalls(MARGIN_LEFT + 0, MARGIN_TOP, parseInt(curHours / 10));
    }
    if (parseInt(curHours % 10) != parseInt(nextHours % 10)) {
      addBalls(
        MARGIN_LEFT + 15 * (RADIUS + 1), // 7 * 2 + 1间隔
        MARGIN_TOP,
        parseInt(curHours / 10)
      );
    }

    if (parseInt(curMinutes / 10) != parseInt(nextMinutes / 10)) {
      addBalls(
        MARGIN_LEFT + 39 * (RADIUS + 1),
        MARGIN_TOP,
        parseInt(curMinutes / 10)
      );
    }
    if (parseInt(curMinutes % 10) != parseInt(nextMinutes % 10)) {
      addBalls(
        MARGIN_LEFT + 54 * (RADIUS + 1),
        MARGIN_TOP,
        parseInt(curMinutes % 10)
      );
    }

    if (parseInt(curSeconds / 10) != parseInt(nextSeconds / 10)) {
      addBalls(
        MARGIN_LEFT + 78 * (RADIUS + 1),
        MARGIN_TOP,
        parseInt(curSeconds / 10)
      );
    }
    if (parseInt(curSeconds % 10) != parseInt(nextSeconds % 10)) {
      addBalls(
        MARGIN_LEFT + 93 * (RADIUS + 1),
        MARGIN_TOP,
        parseInt(nextSeconds % 10)
      );
    }

    curShowTimeSeconds = nextShowTimeSeconds;
  }

  updateBalls(); // 改变动球的位置

  console.log(balls.length);
}

function addBalls(x, y, num) {
  for (var i = 0; i < digit[num].length; i++)
    for (var j = 0; j < digit[num][i].length; j++)
      if (digit[num][i][j] == 1) {
        // 如果变化后的位置是1，即要添加一个小球
        var aBall = {
          x: x + j * 2 * (RADIUS + 1) + (RADIUS + 1),
          y: y + i * 2 * (RADIUS + 1) + (RADIUS + 1),
          g: 1.5 + Math.random(), // 加速度
          vx: Math.pow(-1, Math.ceil(Math.random() * 1000)) * 4, // 随机方向
          vy: -5,
          color: colors[Math.floor(Math.random() * colors.length)] // 随机颜色
        };

        balls.push(aBall); //
      }
}

// x y g加速度
function updateBalls() {
  for (var i = 0; i < balls.length; i++) {
    balls[i].x += balls[i].vx;
    balls[i].y += balls[i].vy;
    balls[i].vy += balls[i].g; // 加上了加速度

    // 检测底部碰撞
    if (balls[i].y >= WINDOW_HEIGHT - RADIUS) {
      balls[i].y = WINDOW_HEIGHT - RADIUS;
      balls[i].vy = -balls[i].vy * 0.75; // 碰撞后反弹，并且加上一个阻力
    }
  }

  var cnt = 0;
  for (var i = 0; i < balls.length; i++)
    // 在左  右边缘之间
    if (balls[i].x + RADIUS > 0 && balls[i].x - RADIUS < WINDOW_WIDTH)
      balls[cnt++] = balls[i];
}
