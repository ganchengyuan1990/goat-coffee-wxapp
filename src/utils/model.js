/** 
 * 生产： prod
 * 测试： test
 * 开发： dev
 */
const CONFIG = {
    env: wx.getStorageSync('env') || 'prod'
}

export const BASE_URL = (() => {
    let url = {
        // prod: 'https://goatup.net/api/v1/server/',
        // test: 'http://127.0.0.1:8000/api/v1/server/',
        // dev: `http://test.goatup.net/api/v1/server/`
        prod: 'https://goatup.cn/api/v1/server/',
        test: 'https://test-mellower-main.powercoffee.cn/api/v1/server/',
        dev: `https://dev-mellower-main.goatup.net/api/v1/server/`
    }
    return url[CONFIG.env]
})()

wx.setStorageSync('config', {
    env: CONFIG.env,
    baseUrl: {
        prod: 'https://goatup.cn/',
        test: 'https://test-mellower-main.powercoffee.cn/',
        dev: `https://dev-mellower-main.goatup.net/`
    }
});

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
        if (_token && _token.user) {
            // console.log(`${_token.user.id} ${_token.token}`);
            console.log(url);
        }
        wx.request({
            url: url,
            data: data,
            method: method,
            header: header  || {
                'content-type': 'application/x-www-form-urlencoded',
                // 'Accept': 'application/json',
                'Authorization': _token ? `${_token.user.id} ${_token.token}` : '',
                'X-Requested-With': 'XMLHttpRequest',
                'source': 'addoil'
            },
            success(res) { 
                const { statusCode, errMsg, data} = res
                if (statusCode === 200 && data.code === 'suc') {
                    resolve(data)
                } else {
                    console.log(`[interface]: ${name}\n` + errMsg)
                    console.log(`[interface]: ${name}\n` + data.msg)
                    reject(data.msg, data.data)
                }
            },
            fail(err) {
                console.log(`${_token.user.id} ${_token.token}`);
                reject(err)
            }
        })
    })
}
export default model