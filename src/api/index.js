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

// export const queryBrandList = query => {
//     return request({
//         url: '/api/admin/brand',
//         method: 'get',
//         params: query
//     });
// };

export const queryCategoryList = query => {
    return request({
        url: '/api/admin/category',
        method: 'get',
        params: query
    });
};


export const queryGoodsList = query => {
    return request({
        url: '/api/admin/goods',
        method: 'get',
        params: query
    });
};

export const queryGoodsInfo = query => {
    return request({
        url: '/api/admin/goods/info',
        method: 'get',
        params: query
    });
};

export const deleteGoods = query => {
    return request({
        url: '/api/admin/goods/destory',
        method: 'post',
        data: query
    });
};

export const updateGoodsSale = query => {
    return request({
        url: '/api/admin/goods/sale',
        method: 'post',
        data: query
    });
};
