import axios from 'axios';
import { Message } from 'element-ui';//引入elm组件
import { removeUserInfo } from './utils';

const service = axios.create({
    // process.env.NODE_ENV === 'development' 来判断是否开发环境
    // easy-mock服务挂了，暂时不使用了
    // baseURL: 'https://www.easy-mock.com/mock/592501a391470c0ac1fab128',
    timeout: 5000
});


let loadingInstance;//定时器

service.interceptors.request.use(
    config => {
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
            return data;
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
