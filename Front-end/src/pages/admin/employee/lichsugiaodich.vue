<template>
    <div class="content pt-0">
        <div class="md-layout">

            <div class="md-layout-item md-medium-size-100 md-xsmall-size-100 md-size-100" >
                <md-card class="mt-0">
                    <md-card-content>
                        <div class="md-layout">
                            <div class="md-layout-item md-small-size-100 md-size-25">
                                <md-field>
                                <label>Số tài khoản</label>
                                <md-input v-model="filter.soTK" type="number"></md-input>
                                </md-field>
                            </div>
                        </div>
                        <div class="md-layout">
                            <div class="md-layout-item md-size-50 text-left">
                                <md-button class="md-raised md-success" @click="search" >Search</md-button>
                            </div>
                        </div>
                    </md-card-content>
                </md-card>
            </div>

            <div class="md-layout-item md-medium-size-100 md-xsmall-size-100 md-size-100" >
                <md-card>
                    <md-card-header data-background-color="green">
                        <h4 class="title">Lịch sử chuyển khoản</h4>
                    </md-card-header>
                    <md-card-content>
                        <div>
                            <b-table ref="tablechuyen" id="my-table-chuyen" striped hover 
                                :items="getTransfer" 
                                :fields="headers"
                                :per-page="perPage"
                                :current-page="currentPage"
                            ></b-table>
                            <div class="paging-right md-card-actions md-alignment-space-between">
                                <div></div>
                                <b-pagination class="pagination-success "
                                    v-model="currentPage"
                                    :total-rows="rows"
                                    :per-page="perPage"
                                    aria-controls="my-table"
                                ></b-pagination>
                            </div>
                            <div style="display: none;" :key="item.id" v-for="item in lichSuList">
                                <input type="hidden" v-model.lazy="item.giaoDich" v-money="money" /> 
                            </div>
                        </div>
                        <!-- <simple-table table-header-color="green"></simple-table> -->
                    </md-card-content>
                </md-card>
            </div>

            <div class="md-layout-item md-medium-size-100 md-xsmall-size-100 md-size-100" >
                <md-card>
                    <md-card-header data-background-color="green">
                        <h4 class="title">Lịch sử nhận tiền</h4>
                    </md-card-header>
                    <md-card-content>
                        <div>
                            <b-table ref="tablenhan" id="my-table-chuyen" striped hover 
                                :items="getReceive" 
                                :fields="reciveheaders"
                                :per-page="perPage"
                                :current-page="currentPage"
                            ></b-table>
                            <div class="paging-right md-card-actions md-alignment-space-between">
                                <div></div>
                                <b-pagination class="pagination-success "
                                    v-model="currentPage"
                                    :total-rows="rows"
                                    :per-page="perPage"
                                    aria-controls="my-table"
                                ></b-pagination>
                            </div>
                            <div style="display: none;" :key="item.id" v-for="item in lichSuList">
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
                soTK: null,
            },
            currentPage: 1,
            perPage: 10,
            rows: 0,
            headers: [
                { key: 'ngayCK', label: 'Ngày' },
                { key: 'soTaiKhoanNhan', label: 'TK nhận' },
                { key: 'giaoDich', label: 'Giao dịch' },
                { key: 'noiDungChuyen', label: 'Nội dung' },
                { key: 'nganHangNhan', label: 'Ngân hàng nhận' }
            ],
            reciveheaders: [
                { key: 'ngayNhan', label: 'Ngày' },
                { key: 'soTaiKhoanGui', label: 'TK gửi' },
                { key: 'giaoDich', label: 'Giao dịch' },
                { key: 'noiDungNhan', label: 'Nội dung' },
                { key: 'nganHangGui', label: 'Ngân hàng gửi' }
            ],
            lichSuList: [],
            money: {
                thousands: ",",
                precision: 0,
                masked: false
            }
        };
    },
    methods: {
        ...mapActions(["getToken"]),
        search(){
            this.$refs.tablechuyen.refresh();
            this.$refs.tablenhan.refresh();
        },
        async getTransfer() {
            if(!this.filter.soTK) return;
            const accessToken = await this.getToken();

            return axios.post("/lichsuchuyenkhoan/nhanvien",{soTK: this.filter.soTK}, {
                headers: {
                    "x-access-token": accessToken
                },
                params:{
                    limit: this.perPage,
                    offset: this.currentPage - 1
                }
            })
            .then(res => {
                this.rows = res.data.totalItems;
                this.lichSuList = res.data.listResult;
                return [...this.lichSuList];
            })
            .catch(err => {
                console.log(err);
            });    
        },
        async getReceive() {
            if(!this.filter.soTK) return;
            const accessToken = await this.getToken();

            return axios.post("/lichsunhantien/nhanvien",{soTK: this.filter.soTK}, {
                headers: {
                    "x-access-token": accessToken
                },
                params:{
                    limit: this.perPage,
                    offset: this.currentPage - 1
                }
            })
            .then(res => {
                this.rows = res.data.totalItems;
                this.lichSuList = res.data.listResult;
                return [...this.lichSuList];
            })
            .catch(err => {
                console.log(err);
            });    
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