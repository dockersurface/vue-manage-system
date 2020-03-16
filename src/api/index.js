import request from '../utils/request';

export const fetchData = query => {
    return request({
        url: './table.json',
        method: 'get',
        params: query
    });
};

// /api为代理url
// export const testFetch = query => {
//     return request({
//         url: '/api',
//         method: 'get',
//         params: query
//     });
// };

export const login = query => {
    return request({
        url: '/api/admin/auth/login',
        method: 'post',
        data: query
    });
};

export const queryBrandList = query => {
    return request({
        url: '/api/admin/brand',
        method: 'get',
        params: query
    });
};
