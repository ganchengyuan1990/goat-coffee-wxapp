const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute, second].map(formatNumber).join(':')
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
    time: `${hours}:${minutes}:${seconds}`
  };
}

function throttle(fn = () => {}, delay = 0) {
  let last = +new Date()
  let timer = null
  return function () {
    let self = this
    let args = arguments
    let now = +new Date()
    if (now - last > delay) {
      clearTimeout(timer)
      fn.apply(self, args)
      last = now
    } else {
      timer = setTimeout(function () {
        fn.apply(self, args)
      }, delay)
    }
  }
}
module.exports = {
  formatTime: formatTime,
  wx2promise: wx2promise,
  calcLeftTime: calcLeftTime,
  throttle: throttle
}
