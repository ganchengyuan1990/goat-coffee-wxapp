/** 
 * 生产： prod
 * 测试： test
 * 开发： dev
 */
const CONFIG = {
    env: 'dev',
    version: 'v1'
}
const BASE_URL = (() => {
    let url = {
        prod: '',
        test: '',
        dev: `http://47.100.233.24:6688/api/${CONFIG.version}/server/`
    }
    return url[CONFIG.env]
})()
const model = (name = '', data = {}) => {
    const url = `${BASE_URL}${name}`
    return new Promise((resolve, reject) => {
        wx.request({
            url: url,
            data: data,
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
module.exports = model