<template>
    <div class="content">

        <div class="md-layout">
            <div class="md-layout-item md-medium-size-100 md-xsmall-size-100 md-size-100" >

                
                <md-dialog :md-active.sync="showDialog">
                    <md-dialog-title>Thông tin người nhận</md-dialog-title>

                    <md-card-content>
                        <div class="md-layout primary">
                        <div v-if="!isEdit" class="md-layout-item md-small-size-100 md-size-100">
                            <md-field>
                            <label>tài khoàn nhận</label>
                            <md-input v-model="itemEdit.idKhachHang" type="text" @keyup="search()"></md-input>
                            </md-field>
                        </div>
                        <div class="md-layout-item md-small-size-100 md-size-100">
                            <md-field>
                            <label>tên gợi nhớ</label>
                            <md-input v-model="itemEdit.tenGoiNho" :disabled="!isExists" type="text"></md-input>
                            </md-field>
                        </div>
                        </div>
                    </md-card-content>

                    <md-dialog-actions>
                        <md-button class="md-primary" @click="showDialog = false">Close</md-button>
                        <md-button class="md-primary" @click="save()">Lưu</md-button>
                    </md-dialog-actions>
                </md-dialog>
                
                <md-card>
                    <md-card-header data-background-color="green">
                        <h4 class="title">Thiết lập người nhận</h4>
                    </md-card-header>
                    <md-card-content>
                        <div class="md-layout primary">
                        <div class="md-layout-item md-small-size-25 md-size-25">
                            <md-button class="md-success" @click="create()">thêm mới</md-button>
                        </div>
                        </div>
                    </md-card-content>
                </md-card>

                <md-card>
                    <md-card-header data-background-color="green">
                        <h4 class="title">Thiết lập người nhận</h4>
                    </md-card-header>
                    <md-card-content>
                        <div>
                            <b-table ref="mytable" striped hover 
                                :items="getHistory" 
                                :fields="headers"
                                :per-page="perPage"
                                :current-page="currentPage"
                            >
                            
                            
                            <template v-slot:cell(tools)="data">
                                <md-button class="md-just-icon md-simple md-primary" @click="Edit(data.item)">
                                <md-icon>edit</md-icon>
                                <md-tooltip md-direction="top">Edit</md-tooltip>
                                </md-button>
                                
                                <md-button class="md-just-icon md-simple md-primary" @click="Delete(data.item)">
                                <md-icon>delete</md-icon>
                                <md-tooltip md-direction="top">Delete</md-tooltip>
                                </md-button>
                            </template>
                            
                            <template v-slot:cell(nganHang)="data">
                                {{data.item.nganHang || "nội bộ"}}
                            </template>

                            </b-table>
                            <div class="paging-right md-card-actions md-alignment-space-between">
                                <div></div>
                                <b-pagination class="pagination-success "
                                    v-model="currentPage"
                                    :total-rows="rows"
                                    :per-page="perPage"
                                    aria-controls="my-table"
                                ></b-pagination>
                            </div>
                            <div style="display: none;" :key="item.id" v-for="item in thietlapList">
                                <input type="hidden" v-model.lazy="item.giaoDich" v-money="money" /> 
                            </div>
                        </div>
                        <!-- <simple-table table-header-color="green"></simple-table> -->
                    </md-card-content>
                </md-card>
            </div>
        </div>
    </div>
</template>

<script>
import axios from "axios";
import { VMoney } from "v-money";
import { mapActions } from 'vuex';
export default {
    data() {
        return {
            currentPage: 1,
            perPage: 10,
            rows: 0,
            headers: [
                { key: 'soTaiKhoanNhan', label: 'TK nhận' },
                { key: 'nganHang', label: 'Ngân hàng' },
                { key: 'tenGoiNho', label: 'Tên gợi nhớ' },
                { key: 'tools', label: 'tools' },
            ],
            thietlapList: [],
            money: {
                thousands: ",",
                precision: 0,
                masked: false
            },
            isEdit: false,
            isExists: false,
            showDialog: false,
            itemEdit: {
                tenGoiNho: "",
            },
        };
    },
    methods: {
        ...mapActions(["getToken"]),
        async getHistory() {
            const accessToken = await this.getToken();

            const res = await axios.get("/thietlapnguoinhan/detail", {
                headers: {
                "x-access-token": accessToken
                },
                params:{
                    limit: this.perPage,
                    offset: this.currentPage - 1
                }
            })
                this.rows = res.data.totalItems;
                this.thietlapList = res.data.listResult;
                return this.thietlapList;
        },
        Edit(item){
            console.log(this.itemEdit);
            this.isExists = true;
            this.isEdit = true;
            this.showDialog = true;
            this.itemEdit = item;
        },
        create(){
            this.isExists = false;
            this.isEdit = false;
            this.showDialog = true;
            this.itemEdit = {
                idKhachHang: 0,
                tenGoiNho: "",
            };
        },
        async search(){
            const tl = this.thietlapList.find(x=>x.soTaiKhoanNhan == this.itemEdit.idKhachHang)
            if(tl){
                this.itemEdit.tenGoiNho = "tài khoản đã lưu"
                this.isExists = false
                return;
            }

            const accessToken = await this.getToken();
            const res = await axios.get(`/taikhoannganhang/${this.itemEdit.idKhachHang}`,{
                    headers: {
                    "x-access-token": accessToken
                    }},)
            if(res.data)
            {
                this.itemEdit.tenGoiNho = res.data.tenDangKy
                this.isExists = true
            }
            else{
                this.itemEdit.tenGoiNho = "không tìm thấy tài khoản"
                this.isExists = false
            }
        },
        async save(){
            const accessToken = await this.getToken();
            const data = { tenGoiNho: this.itemEdit.tenGoiNho }
            if(this.isEdit){
                const res = await axios.patch(`/thietlapnguoinhan/${this.itemEdit.id}`,data, {
                    headers: {
                    "x-access-token": accessToken
                    },
                })
                this.$swal("lưu thành công")
            }
            else{
                if(!this.isExists){
                    this.$swal("không tìm thấy tài khoản")
                    return;
                }
                const data = { 
                    tenGoiNho: this.itemEdit.tenGoiNho,
                    soTaiKhoanNhan: this.itemEdit.idKhachHang,
                }
                const res = await axios.post(`/thietlapnguoinhan`,data, {
                    headers: {
                    "x-access-token": accessToken
                    },
                })
                this.$swal("lưu thành công")
                this.$refs.mytable.refresh();
            }
        },
        async Delete(item){
            const cfm = confirm("Xác nhận xóa!"); 
            if(!cfm) return;
            const accessToken = await this.getToken();
            const res = await axios.delete(`/thietlapnguoinhan/${item.id}`,{
                headers: {
                "x-access-token": accessToken
                },
            })
            this.$swal("xóa thành công")
            this.$refs.mytable.refresh();
        }
    },
    directives: {
        money: VMoney
    }
};
</script>
<style scoped>
    .paging-right{
        margin-right: 0px!important;
    }
</style>