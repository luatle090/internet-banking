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
                        <h4 class="title">Đối soát</h4>
                    </md-card-header>
                    <md-card-content>
                        <div class="md-layout primary">
                            <div class="md-layout-item md-small-size-25 md-size-25">
                                <md-datepicker v-model="filter.tungay">
                                    <label>từ ngày</label>
                                </md-datepicker>
                            </div>
                            <div class="md-layout-item md-small-size-25 md-size-25">
                                <md-datepicker v-model="filter.denngay">
                                    <label>đến ngày</label>
                                </md-datepicker>
                            </div>
                            <div class="md-layout-item md-small-size-25 md-size-25">
                            <md-field>
                                <label>ngân hàng</label>
                                <md-input v-model="filter.nganhang" type="text"></md-input>
                            </md-field>
                            </div>
                        </div>
                        <div class="md-layout primary">
                            <div class="md-layout-item md-small-size-25 md-size-25">
                                <md-button class="md-success" @click="search()">tìm kiếm</md-button>
                            </div>
                        </div>
                    </md-card-content>
                </md-card>

                <md-card>
                    <md-card-header data-background-color="green">
                        <h4 class="title">Đối soát</h4>
                    </md-card-header>
                    <md-card-content>
                        <div>
                            <b-table ref="mytable" striped hover 
                                :items="getDoiSoat" 
                                :fields="headers"
                                :per-page="perPage"
                                :current-page="currentPage"
                            >

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
            filter: {
                tungay: "",
                denngay: "",
                nganhang: "",
            },
            currentPage: 1,
            perPage: 10,
            rows: 0,
            headers: [
                { key: 'ngay', label: 'Ngày' },
                { key: 'idTaiKhoanNHNhan', label: 'Tài khản nhận' },
                { key: 'soTaiKhoanGui', label: 'Tài khoản gửi' },
                { key: 'giaoDich', label: 'Giao dịch' },
                { key: 'nganHangGui', label: 'Ngân hàng gửi' },
                { key: 'noiDungNhan', label: 'Nội dung nhận' },
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
        async getDoiSoat() {
            const accessToken = await this.getToken();

            const res = await axios.get("/doisoat", {
                headers: {
                "x-access-token": accessToken
                },
                params:{
                    tungay: this.filter.tungay,
                    denngay: this.filter.denngay,
                    nganhang: this.filter.nganhang,
                    limit: this.perPage,
                    offset: this.currentPage - 1
                }
            })
            console.log(res)
                this.rows = res.data.totalItems;
                this.thietlapList = res.data.listResult;
                return this.thietlapList;
        },
        search(){
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