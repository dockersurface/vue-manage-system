<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 基础表格
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-row type="flex" class="row-bg" justify="space-between">
                    <el-col :span="6">
                        <el-button
                            type="primary"
                            icon="el-icon-plus"
                            class="handle-del mr10"
                            @click="handleInsert"
                        >新增</el-button>
                    </el-col>
                    <el-col :span="18" style='text-align: right;'>
                        <el-input v-model="query.name" placeholder="商品名称" class="handle-input mr10"></el-input>
                        <!-- <el-select v-model="query.address" placeholder="商品分类" class="handle-select mr10">
                            <el-option key="1" label="广东省" value="广东省"></el-option>
                            <el-option key="2" label="湖南省" value="湖南省"></el-option>
                        </el-select> -->
                        <el-select v-model="query.category_id" clearable placeholder="商品分类" class="mr10">
                            <el-option
                            v-for="item in options"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                            </el-option>
                        </el-select>
                        <el-select v-model="query.is_on_sale" clearable placeholder="上架状态" class="handle-select mr10">
                            <el-option key="1" label="上架" value=1></el-option>
                            <el-option key="2" label="下架" value=0></el-option>
                        </el-select>
                        <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
                    </el-col>
                </el-row>
            </div>
            <el-table
                :data="tableData"
                border
                class="table"
                ref="multipleTable"
                header-cell-class-name="table-header"
                @selection-change="handleSelectionChange"
            >
                <el-table-column prop="id" label="商品ID" align="center"></el-table-column>
                <!-- <el-table-column type="index" label="编号" width="55" align="center"></el-table-column> -->
                <el-table-column label="商品图片" align="center">
                    <template slot-scope="scope">
                        <el-image
                            class="table-td-thumb"
                            :src="scope.row.primary_pic_url"
                            :preview-src-list="[scope.row.primary_pic_url]"
                        ></el-image>
                    </template>
                </el-table-column>
                <el-table-column prop="name" label="商品名称" align="center"></el-table-column>
                <el-table-column label="价格" align="center">
                    <template slot-scope="scope">￥{{scope.row.retail_price}}</template>
                </el-table-column>
                <el-table-column prop="category_name" label="商品分类" align="center"></el-table-column>
                <el-table-column label="标签" width="180" align="center">
                    <template slot-scope="scope">
                        <el-row type="flex" class="row-bg" justify="center">
                            <el-col :span="8">上架</el-col>
                            <el-col :span="8">
                                <el-switch
                                    v-model="scope.row.is_on_sale"
                                    active-color="#00A854"
                                    :active-value=1
                                    inactive-color=""
                                    :inactive-value=0
                                    @change="changeSwitch(scope.row)">
                                </el-switch>
                            </el-col>
                        </el-row>
                        <el-row type="flex" class="row-bg" justify="center">
                            <el-col :span="8">人气</el-col>
                            <el-col :span="8">
                                <el-switch
                                    v-model="scope.row.is_hot"
                                    active-color="#00A854"
                                    :active-value=1
                                    inactive-color=""
                                    :inactive-value=0
                                    @change="changeSwitch(scope.row)">
                                </el-switch>
                            </el-col>
                        </el-row>
                        <el-row type="flex" class="row-bg" justify="center">
                            <el-col :span="8">新品</el-col>
                            <el-col :span="8">
                                <el-switch
                                    v-model="scope.row.is_new"
                                    active-color="#00A854"
                                    :active-value=1
                                    inactive-color=""
                                    :inactive-value=0
                                    @change="changeSwitch(scope.row)">
                                </el-switch>
                            </el-col>
                        </el-row>
                    </template>
                </el-table-column>
                <el-table-column prop="goods_number" label="库存" align="center"></el-table-column>
                <el-table-column prop="sell_volume" label="销量" align="center"></el-table-column>
                <el-table-column prop="sort_order" label="排序" align="center"></el-table-column>
                <el-table-column label="操作" width="180" align="center">
                    <template slot-scope="scope">
                        <el-button
                            type="text"
                            icon="el-icon-edit"
                            @click="handleEdit(scope.$index, scope.row)"
                        >编辑</el-button>
                        <el-button
                            type="text"
                            icon="el-icon-delete"
                            class="red"
                            @click="handleDelete(scope.$index, scope.row)"
                        >删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination
                    background
                    layout="total, prev, pager, next"
                    :current-page="query.page"
                    :page-size="query.size"
                    :total="pageTotal"
                    @current-change="handlePageChange"
                ></el-pagination>
            </div>
        </div>

        <!-- 编辑弹出框 -->
        <el-dialog title="编辑商品信息" :visible.sync="editVisible" @close='closeDialog'>
            <el-form ref="form" :model="form" label-width="70px">
                <el-form-item label="商品名称">
                    <el-input v-model="form.name"></el-input>
                </el-form-item>
                <el-form-item label="商品简要">
                    <el-input v-model="form.goods_brief"></el-input>
                </el-form-item>
                <el-form-item label="商品主图" style='width: auto;'>
                    <el-upload
                    class="avatar-uploader"
                    :action=uploadPrimaryUrl
                    :show-file-list="false"
                    name="primary_url"
                    :headers="uploadHeaders"
                    :on-success="handlePrimarayPicUploadSuccess"
                    :before-upload="beforeAvatarUpload">
                    <img v-if="form.primary_pic_url" :src="form.primary_pic_url" class="avatar">
                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>
                </el-form-item>
                <el-form-item label="商品图片">
                    <el-upload
                        :action=uploadGalleryPic
                        :headers="uploadHeaders"
                        name="gallery_url"
                        list-type="picture-card"
                        :file-list="fileList"
                        :on-success="handleGalleryPicUploadSuccess"
                        :on-remove="handleRemove">
                        <i class="el-icon-plus"></i>
                    </el-upload>
                </el-form-item>
                <el-form-item label="商品分类">
                    <el-select v-model="form.category_id" clearable placeholder="商品分类" class="mr10">
                        <el-option
                        v-for="item in options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="价格">
                    <el-input v-model="form.retail_price"></el-input>
                </el-form-item>
                <el-form-item label="库存">
                    <el-input v-model="form.goods_number"></el-input>
                </el-form-item>
                <el-form-item label="销量">
                    <el-input v-model="form.sell_volume"></el-input>
                </el-form-item>
                <el-form-item label="商品描述">
                    <quill-editor ref="myTextEditor" v-model="form.goods_desc" :options="editorOption"></quill-editor>
                </el-form-item>             
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveEdit">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import 'quill/dist/quill.core.css';
import 'quill/dist/quill.snow.css';
import 'quill/dist/quill.bubble.css';
import {quillEditor, Quill} from 'vue-quill-editor'
import {container, ImageExtend, QuillWatch} from 'quill-image-extend-module'
Quill.register('modules/ImageExtend', ImageExtend)

import { fetchData, queryGoodsList, queryCategoryList, deleteGoods, queryGoodsInfo, updateGoodsInfo, deleteGoodsGallery, addGoodsGallery } from 'api/index';
import { imgHost } from '../../../utils/utils';
const token = localStorage.getItem('token')
export default {
    name: 'basetable',
    data() {
        return {
            query: {
                category_id: '',
                name: '',
                is_on_sale: '',
                page: 1,
                size: 10
            },
            tableData: [],
            multipleSelection: [],
            delList: [],
            editVisible: false,
            pageTotal: 0,
            form: {},
            idx: -1,
            id: -1,
            options: [],
            category: [],
            fileList: [],
            uploadHeaders: {
                ['x-nideshop-token']: token
            },
            editorOption: {
                placeholder: '填写商品描述信息',
                modules: {
                    ImageExtend: {
                        loading: true,
                        name: 'goods_desc_pic',
                        headers: (xhr) => {
                            xhr.setRequestHeader(['x-nideshop-token'],token)
                        },
                        action: 'http://127.0.0.1:8360/admin/upload/goodsDescPic',
                        response: (res) => {
                            console.log(res)
                            return res.data.fileUrl
                        }
                    },
                    toolbar: {
                        container: container,
                        handlers: {
                            'image': function () {
                                QuillWatch.emit(this.quill.id)
                            }
                        }
                    }
                }
            },
            uploadPrimaryUrl: imgHost + "/admin/upload/primaryPic",
            uploadGalleryPic: imgHost + "/admin/upload/galleryPic"
        };
    },
    components: {
        quillEditor
    },
    async created() {
        await this.queryCategory();
        await this.getData();
    },
    methods: {
        // 获取 easy-mock 的模拟数据
        async getData() {
            // fetchData(this.query).then(res => {
            //     console.log(res);
            //     this.tableData = res.list;
            //     this.pageTotal = res.pageTotal || 50;
            // });
            const response = await queryGoodsList(this.query);
            const { count, data, currentPage, pageSize } = response;
            // console.log(this.category)
            const formatData = data.map((item) => ({
                ...item,
                category_name: this.category.filter((cate) => cate.id === item.category_id)[0].name
            }))
            this.tableData = formatData;
            this.pageTotal = count;
        },
        async queryCategory() {
            const { data } = await queryCategoryList();
            const topCategory = data.filter((item) => item.parent_id === 0);
            const category_list = topCategory.map((item) => (
                {
                    label: item.name,
                    value: item.id
                }
            ));
            this.category = topCategory;
            this.options = category_list
        },
        // 修改是否上架
        async changeSwitch(row) {
            // const { id, is_on_sale } = row;
            const response = await updateGoodsInfo(row);
        },
        // 触发搜索按钮
        handleSearch() {
            console.log(this.query)
            this.$set(this.query, 'page', 1);
            this.getData();
        },
        // 删除操作
        handleDelete(index, row) {
            // 二次确认删除
            this.$confirm('确定要删除吗？', '提示', {
                type: 'warning'
            })
                .then(async() => {
                    const response = await deleteGoods({id: row.id});
                    console.log(response)
                    this.getData();
                    this.$message.success('删除成功');
                    // this.tableData.splice(index, 1);
                })
                .catch(() => {});
        },
        // 多选操作
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },
        delAllSelection() {
            const length = this.multipleSelection.length;
            let str = '';
            this.delList = this.delList.concat(this.multipleSelection);
            for (let i = 0; i < length; i++) {
                str += this.multipleSelection[i].name + ' ';
            }
            this.$message.error(`删除了${str}`);
            this.multipleSelection = [];
        },
        // 新增操作
        handleInsert() {
            this.editVisible = true;
        },
        // 编辑操作
        async handleEdit(index, row) {
            const res = await queryGoodsInfo({id: row.id});
            this.fileList = res.gallery.map((item) => ({
                ...item,
                url: item.img_url
            }))
            this.idx = index;
            this.form = row;
            this.editVisible = true;
        },
        closeDialog() {
            this.form = {};
            this.fileList = [];
        },
        // 保存编辑
        async saveEdit() {
            console.log(this.form)
            await updateGoodsInfo(this.form)
            this.editVisible = false;
            this.$message.success(`修改第 ${this.idx + 1} 行成功`);
            this.$set(this.tableData, this.idx, this.form);
        },
        // 分页导航
        handlePageChange(val) {
            this.$set(this.query, 'page', val);
            this.getData();
        },
        onEditorChange({ editor, html, text }) {
            this.content = html;
            console.log(this.content)
        },
        async handleRemove(file, fileList) {
            const { id } = file;
            const res = await deleteGoodsGallery({id}) 
            console.log(file, fileList, 'remove');
        },
        handlePrimarayPicUploadSuccess(res, file, fileList) {
            const { data: { fileUrl } } = res;
            this.form.primary_pic_url = fileUrl
            // this.form.primary_pic_url = URL.createObjectURL(file.raw);
        },
        async handleGalleryPicUploadSuccess(res, file, fileList) {
            const { id } = this.form;
            // console.log(res, file, fileList, '12211221')
            const { data: { fileUrl } } = res;
            await addGoodsGallery({goods_id: id, gallery_url: fileUrl})
            // this.form.primary_pic_url = URL.createObjectURL(file.raw);
        },
        beforeAvatarUpload(file) {
            // const isJPG = file.type === 'image/jpeg';
            // const isLt2M = file.size / 1024 / 1024 < 2;

            // if (!isJPG) {
            // this.$message.error('上传头像图片只能是 JPG 格式!');
            // }
            // if (!isLt2M) {
            // this.$message.error('上传头像图片大小不能超过 2MB!');
            // }
            // return isJPG && isLt2M;
        }
    }
};
</script>

<style scoped>
.handle-box {
    margin-bottom: 20px;
}

.handle-select {
    width: 120px;
}

.handle-input {
    width: 300px;
    display: inline-block;
}
.table {
    width: 100%;
    font-size: 14px;
}
.red {
    color: #ff0000;
}
.mr10 {
    margin-right: 10px;
}
.table-td-thumb {
    display: block;
    margin: auto;
    width: 40px;
    height: 40px;
}
.el-row {
    margin: 6px 0;
}
.avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
}
.avatar-uploader .el-upload:hover {
    border-color: #409EFF;
}
.avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 146px;
    height: 146px;
    line-height: 146px;
    text-align: center;
}
.avatar {
    width: 146px;
    height: 146px;
    display: block;
}
</style>
<style>
.avatar-uploader .el-upload--text {
    width: 146px;
    height: 146px;
}
</style>
