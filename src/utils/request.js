import axios from 'axios';
import { Message } from 'element-ui';//引入elm组件
import { removeUserInfo } from './utils';

const service = axios.create({
    //  来判断是否开发环境
    // easy-mock服务挂了，暂时不使用了
    baseURL: process.env.NODE_ENV === 'development' ? '' : 'https://www.lunaflower.club',
    // baseURL: process.env.NODE_ENV === 'development' ? 'https://www.lunaflower.club' : '',
    timeout: 5000
});

let loadingInstance;//定时器

service.interceptors.request.use(
    config => {
        console.log(process.env.NODE_ENV, 'process.env.NODE_ENV')
        // 下面会说在什么时候存储 token
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['x-nideshop-token'] = token
        }
        console.log(config)
        return config;
    },
    error => {
        console.log(error);
        return Promise.reject();
    }
);

service.interceptors.response.use(
    response => {
        console.log(response)
        const { status, data } = response;
        if (status === 200) {
            const { errno, errmsg } = data;

            if(errmsg) Message.error(errmsg);

            if(errno === 401) {
                // 401 说明 token 验证失败
                // 可以直接跳转到登录页面，重新登录获取 token
                // setTimeout(() => {
                //     removeUserInfo();
                //     window.location.href = '/login'
                // }, 2000)
            }
            return data.data;
        } else {
            Promise.reject();
        }
    },
    error => {
        console.log(error);
        return Promise.reject();
    }
);

export default service;
