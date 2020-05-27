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
                <el-button
                    type="primary"
                    icon="el-icon-plus"
                    class="handle-del mr10"
                    @click="handleInsert"
                >新增</el-button>
            </div>
              <el-table
                :data="tableData"
                style="width: 100%;margin-bottom: 20px;"
                row-key="id"
                border
                >
                <el-table-column
                prop="id"
                label="分类ID"
                width="180">
                </el-table-column>
                <el-table-column
                prop="name"
                label="分类名称"
                width="180">
                </el-table-column>
                <el-table-column label="分类图片" align="center">
                    <template slot-scope="scope">
                        <el-image
                            class="table-td-thumb"
                            :src="scope.row.wap_banner_url"
                            :preview-src-list="[scope.row.wap_banner_url]"
                        ></el-image>
                    </template>
                </el-table-column>
                <el-table-column
                prop="sort_order"
                label="分类排序">
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
        <el-dialog title="编辑" :visible.sync="editVisible" width="70%">
            <el-form ref="form" :model="form" label-width="70px">
                <el-form-item label="分类名称">
                    <el-input v-model="form.name"></el-input>
                    <div>建议四个字以内</div>
                </el-form-item>
                <el-form-item label="分类描述">
                    <el-input v-model="form.front_desc"></el-input>
                    <div>分类图片上面的描述文字</div>
                </el-form-item>
                <el-form-item label="分类图片" style='width: auto;'>
                    <el-upload
                    class="category-uploader"
                    :action="uploadUrl"
                    :show-file-list="false"
                    name="wap_banner_url"
                    :headers="uploadHeaders"
                    :on-success="handleCategoryPicUploadSuccess"
                    :before-upload="beforeAvatarUpload">
                    <img v-if="form.wap_banner_url" :src="form.wap_banner_url" class="category-img">
                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>
                    <div>建议260*96横屏，分类图片</div>
                </el-form-item>
                <el-form-item label="分类排序">
                    <el-input v-model="form.sort_order"></el-input>
                    <div>建议输入10、20、30、40方便后续排序</div>
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
import { fetchData, queryCategoryList, deleteCategory, storeCategory } from '../../../api/index';
import { imgHost } from '../../../utils/utils';
const token = localStorage.getItem('token')
export default {
    name: 'basetable',
    data() {
        return {
            query: {
                address: '',
                name: '',
                pageIndex: 1,
                pageSize: 10
            },
            tableData: [],
            multipleSelection: [],
            delList: [],
            editVisible: false,
            pageTotal: 0,
            form: {},
            idx: -1,
            id: -1,
            uploadHeaders: {
                ['x-nideshop-token']: token
            },
            uploadUrl: imgHost + "/admin/upload/categoryWapBannerPic"
        };
    },
    created() {
        this.getData();
    },
    methods: {
        // 获取 easy-mock 的模拟数据
        async getData() {
            // fetchData(this.query).then(res => {
            //     console.log(res);
            //     this.tableData = res.list;
            //     this.pageTotal = res.pageTotal || 50;
            // });
            const {data, count} = await queryCategoryList();
            const topCategory = data.filter((item) => {
                return item.parent_id === 0;
            });
            const category_list = topCategory.map((item) => (
                {
                    ...item,
                    level: 1,
                    children: data.filter((child) => child.parent_id === item.id)
                }
            ));
            this.pageTotal = count;
            this.tableData = category_list;
        },
        // 触发搜索按钮
        handleSearch() {
            this.$set(this.query, 'pageIndex', 1);
            this.getData();
        },
        // 删除操作
        handleDelete(index, row) {
            // 二次确认删除
            this.$confirm('确定要删除吗？', '提示', {
                type: 'warning'
            })
                .then(async () => {
                    this.$message.success('删除成功');
                    this.tableData.splice(index, 1);
                    await deleteCategory({id: row.id})
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
        handleCategoryPicUploadSuccess(res, file, fileList) {
            const { data: { fileUrl } } = res;
            this.form.wap_banner_url = fileUrl
        },
        // 新增操作
        handleInsert() {
            this.form = {}
            this.editVisible = true;
        },
        // 编辑操作
        handleEdit(index, row) {
            this.idx = index;
            this.form = row;
            this.editVisible = true;
        },
        // 保存编辑
        async saveEdit() {
            await storeCategory(this.form)

            this.editVisible = false;
            // this.$message.success(`修改第 ${this.idx + 1} 行成功`);
            this.$set(this.tableData, this.idx, this.form);
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
        },
        // 分页导航
        handlePageChange(val) {
            this.$set(this.query, 'pageIndex', val);
            this.getData();
        }
    }
};
</script>
<style>
.category-uploader .el-upload--text {
    width: 260px;
    height: 96px;
}
</style>

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
.category-uploader {
    width: 260px;
    height: 96px;
}
.category-img {
    width: 260px;
    height: 96px;
}
</style>
