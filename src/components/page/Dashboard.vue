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
                        <!-- <el-select v-model="query.category_id" clearable placeholder="商品分类" class="mr10">
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
                        </el-select> -->
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
                            :src="scope.row.image_url"
                            :preview-src-list="[scope.row.image_url]"
                        ></el-image>
                    </template>
                </el-table-column>
                <el-table-column prop="name" label="商品名称" align="center"></el-table-column>
                <el-table-column label="是否显示" width="180" align="center">
                    <template slot-scope="scope">
                        <el-row type="flex" class="row-bg" justify="center">
                            <el-col :span="8">显示</el-col>
                            <el-col :span="8">
                                <el-switch
                                    v-model="scope.row.enabled"
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
                <el-form-item label="商品主图" style='width: auto;'>
                    <el-upload
                    class="swiper-uploader"
                    :action=uploadSwiperUrl
                    :show-file-list="false"
                    name="swiper_pic"
                    :headers="uploadHeaders"
                    :on-success="handlePrimarayPicUploadSuccess"
                    :before-upload="beforeAvatarUpload">
                    <img v-if="form.image_url" :src="form.image_url" class="swiper-img">
                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>
                    <div>建议375*208</div>
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
import { fetchData, queryAdsList, deleteAds, queryAdsInfo, updateAdsInfo } from 'api/index';
import { imgHost } from '../../utils/utils';
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
            fileList: [],
            uploadHeaders: {
                ['x-nideshop-token']: token
            },
            uploadSwiperUrl: imgHost + "/admin/upload/swiperPic",
        };
    },
    components: {
    },
    async created() {
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
            const response = await queryAdsList(this.query);
            const { count, data, currentPage, pageSize } = response;
            // console.log(this.category)
            this.tableData = data;
            this.pageTotal = count;
        },
        // 修改是否上架
        async changeSwitch(row) {
            // const { id, is_on_sale } = row;
            const response = await updateAdsInfo(row);
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
                    const response = await deleteAds({id: row.id});
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
            const res = await queryAdsInfo({id: row.id});
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
            await updateAdsInfo(this.form)
            this.editVisible = false;
            this.$message.success(`修改第 ${this.idx + 1} 行成功`);
            this.$set(this.tableData, this.idx, this.form);
            this.getData()
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
            console.log(fileUrl)
            this.form.image_url = fileUrl
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
.swiper-uploader {
    width: 375px;
    height: 208px;
}
.swiper-img {
    width: 375px;
    height: 208px;
}
</style>
<style>
.swiper-uploader .el-upload--text {
    width: 375px;
    height: 208px;
}
</style>
