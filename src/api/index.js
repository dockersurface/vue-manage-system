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

export const updateGoodsInfo = query => {
    return request({
        url: '/api/admin/goods/store',
        method: 'post',
        data: query
    });
};

export const deleteGoodsGallery = query => {
    return request({
        url: '/api/admin/goods/deleteGoodsGallery',
        method: 'post',
        data: query
    });
};

export const addGoodsGallery = query => {
    return request({
        url: '/api/admin/goods/addGoodsGallery',
        method: 'post',
        data: query
    });
};

export const queryCategoryList = query => {
    return request({
        url: '/api/admin/category',
        method: 'get',
        params: query
    });
};

export const deleteCategory = query => {
    return request({
        url: '/api/admin/category/destory',
        method: 'post',
        data: query
    });
};

export const storeCategory = query => {
    return request({
        url: '/api/admin/category/store',
        method: 'post',
        data: query
    });
};

// 订单列表增删改查
export const queryOrderList = query => {
    return request({
        url: '/api/admin/order',
        method: 'get',
        params: query
    });
};


export const queryOrderInfo = query => {
    return request({
        url: '/api/admin/order/info',
        method: 'get',
        params: query
    });
};

export const deleteOrder = query => {
    return request({
        url: '/api/admin/order/destory',
        method: 'post',
        data: query
    });
};

export const updateOrderInfo = query => {
    return request({
        url: '/api/admin/order/store',
        method: 'post',
        data: query
    });
};