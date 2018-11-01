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

module.exports = {
  formatTime: formatTime,
  wx2promise: wx2promise
}
