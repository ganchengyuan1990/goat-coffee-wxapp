import model from './model.js'

export const setConfigParam = (param) => {
    return new Promise((resolve, reject) => {
        return model('base/site/config-list').then(res => {
            if (res.code == 'suc') {
                resolve(res.data);
            } else {
                reject(res.msg);
            }
        }).catch(e => {
            reject(e);
        });
    });
}

