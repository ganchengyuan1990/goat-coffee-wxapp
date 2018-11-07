import {
    wx2promise
} from './util.js';

export function apiGet(url, param) {
    // let realParam = param;
    // let keys = Object.keys(param);
    // debugger
    return wx2promise(wx.request, {
        url: url,
        method: 'GET',
        // data:  'appid=1256596722&url=https://www.jasongan.cn/img/fengli.jpeg',
        data: param,
        header: {
            //设置参数内容类型为x-www-form-urlencoded
            'Content-Type': 'application/json',
            'Authorization': 'tdpeGHT2XVFmQOVci+vDhRFG6XZhPTEyNTY1OTY3MjImaz1BS0lEUmhpVUZ2b2FjUjFMUUZvQUc2a0FMSzdnejJwTFpZR2gmZT0xNTI5MTM2MTE1JnQ9MTUyOTA0OTcxNSZyPTM0Nzg0ODEwNzMmdT0wJmY9',
            'Host': 'recognition.image.myqcloud.com'
        },
    })
}

export function apiPost(url, param) {
    // let realParam = param;
    // let keys = Object.keys(param);
    // debugger
    return wx2promise(wx.request, {
        url: url,
        method: 'POST',
        // data:  'appid=1256596722&url=https://www.jasongan.cn/img/fengli.jpeg',
        data: param,
        header: {
            //设置参数内容类型为x-www-form-urlencoded
            'Content-Type': 'application/json',
            'Authorization': 'tdpeGHT2XVFmQOVci+vDhRFG6XZhPTEyNTY1OTY3MjImaz1BS0lEUmhpVUZ2b2FjUjFMUUZvQUc2a0FMSzdnejJwTFpZR2gmZT0xNTI5MTM2MTE1JnQ9MTUyOTA0OTcxNSZyPTM0Nzg0ODEwNzMmdT0wJmY9',
            'Host': 'recognition.image.myqcloud.com'
        },
    })
}