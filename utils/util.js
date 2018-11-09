const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

function wx2promise(fn, params) {
  params = params || {};
  return new Promise(function (accept, reject) {
    params.success = accept;
    params.fail = reject;
    fn(params);
  });
}

function daojishi (timeRemain) {
  var interval = setInterval(() => {
    if (timeRemain > 1) {
      timeRemain--;
    } else {
      clearInterval(interval);
    }
  }, 1000);
  return interval;
}

function calcLeftTime (time) {
  var timeStr = parseFloat(time) - new Date().getTime();
  var left = parseInt((timeStr % 864e5) / 1000);
  var hours = parseInt(left / 3600);
  var minutes = parseInt((left - hours * 3600) / 60);
  var seconds = parseInt((left - hours * 3600 - minutes * 60));
  return {
    left: left,
    time: `${hours}小时${minutes}分${seconds}秒`
  };
}

function add(a, b) {
  var c, d, e;
  try {
    c = a.toString().split(".")[1].length;
  } catch (f) {
    c = 0;
  }
  try {
    d = b.toString().split(".")[1].length;
  } catch (f) {
    d = 0;
  }
  return e = Math.pow(10, Math.max(c, d)), (mul(a, e) + mul(b, e)) / e;
}

function sub(a, b) {
  var c, d, e;
  try {
    c = a.toString().split(".")[1].length;
  } catch (f) {
    c = 0;
  }
  try {
    d = b.toString().split(".")[1].length;
  } catch (f) {
    d = 0;
  }
  return e = Math.pow(10, Math.max(c, d)), (mul(a, e) - mul(b, e)) / e;
}

function mul(a, b) {
  var c = 0,
    d = a.toString(),
    e = b.toString();
  try {
    c += d.split(".")[1].length;
  } catch (f) { }
  try {
    c += e.split(".")[1].length;
  } catch (f) { }
  return Number(d.replace(".", "")) * Number(e.replace(".", "")) / Math.pow(10, c);
}

function div(a, b) {
  var c, d, e = 0,
    f = 0;
  try {
    e = a.toString().split(".")[1].length;
  } catch (g) { }
  try {
    f = b.toString().split(".")[1].length;
  } catch (g) { }
  return c = Number(a.toString().replace(".", "")), d = Number(b.toString().replace(".", "")), mul(c / d, Math.pow(10, f - e));
}
module.exports = {
  formatTime: formatTime,
  wx2promise: wx2promise,
  calcLeftTime: calcLeftTime,
  add: add,
  sub: sub,
  mul: mul,
  div: div
}
