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
        url: '/admin/auth/login',
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
        url: '/admin/goods',
        method: 'get',
        params: query
    });
};

export const queryGoodsInfo = query => {
    return request({
        url: '/admin/goods/info',
        method: 'get',
        params: query
    });
};

export const deleteGoods = query => {
    return request({
        url: '/admin/goods/destory',
        method: 'post',
        data: query
    });
};

export const updateGoodsInfo = query => {
    return request({
        url: '/admin/goods/store',
        method: 'post',
        data: query
    });
};

export const deleteGoodsGallery = query => {
    return request({
        url: '/admin/goods/deleteGoodsGallery',
        method: 'post',
        data: query
    });
};

export const addGoodsGallery = query => {
    return request({
        url: '/admin/goods/addGoodsGallery',
        method: 'post',
        data: query
    });
};

export const queryCategoryList = query => {
    return request({
        url: '/admin/category',
        method: 'get',
        params: query
    });
};

export const deleteCategory = query => {
    return request({
        url: '/admin/category/destory',
        method: 'post',
        data: query
    });
};

export const storeCategory = query => {
    return request({
        url: '/admin/category/store',
        method: 'post',
        data: query
    });
};

// 订单列表增删改查
export const queryOrderList = query => {
    return request({
        url: '/admin/order',
        method: 'get',
        params: query
    });
};


export const queryOrderInfo = query => {
    return request({
        url: '/admin/order/info',
        method: 'get',
        params: query
    });
};

export const deleteOrder = query => {
    return request({
        url: '/admin/order/destory',
        method: 'post',
        data: query
    });
};

export const updateOrderInfo = query => {
    return request({
        url: '/admin/order/store',
        method: 'post',
        data: query
    });
};

export const queryAdsList = query => {
    return request({
        url: '/admin/ads',
        method: 'get',
        params: query
    });
};

export const queryAdsInfo = query => {
    return request({
        url: '/admin/ads/info',
        method: 'get',
        params: query
    });
};

export const deleteAds = query => {
    return request({
        url: '/admin/ads/destory',
        method: 'post',
        data: query
    });
};

export const updateAdsInfo = query => {
    return request({
        url: '/admin/ads/store',
        method: 'post',
        data: query
    });
};