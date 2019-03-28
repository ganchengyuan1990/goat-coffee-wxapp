/** 
 * 生产： prod
 * 测试： test
 * 开发： dev
 */
const CONFIG = {
    env: 'dev'
}
export const BASE_URL = (() => {
    let url = {
        prod: 'https://mofafang.cn/api/v1/server/',
        test: '',
        dev: `https://heibanbao.wang/api/v1/server/`
    }
    return url[CONFIG.env]
})()

const model = (name = '', data = {}, method = 'GET', header, ip) => {
    let url = `${BASE_URL}${name}`
    if (ip) {
        url = `http://wx.web.haokaixin.xyz/api/${CONFIG.version}/server/${name}`
    }
    // if (wx.getStorageSync('token')) {
    //     data.token = wx.getStorageSync('token');
    // }
    let _token = false;
    if (wx.getStorageSync('token')) {
        _token = wx.getStorageSync('token');
    }
    return new Promise((resolve, reject) => {
        wx.request({
            url: url,
            data: data,
            method: method,
            header: header  || {
                'content-type': 'application/x-www-form-urlencoded',
                // 'Accept': 'application/json',
                'Authorization': _token ? `${_token.user.id} ${_token.token}` : '',
                'X-Requested-With': 'XMLHttpRequest'
            },
            success(res) {
                const { statusCode, errMsg, data} = res
                if (statusCode === 200 && data.code === 'suc') {
                    resolve(data)
                } else {
                    console.log(`[interface]: ${name}\n` + errMsg)
                    console.log(`[interface]: ${name}\n` + data.msg)
                    reject(data.msg)
                }
            },
            fail(err) {
                reject(err)
            }
        })
    })
}
export default model