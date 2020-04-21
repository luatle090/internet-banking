<template>
    <div class="content">
        <div class="md-layout">
            <div class="md-layout-item md-medium-size-100 md-xsmall-size-100 md-size-100" >
                <md-card>
                    <md-card-header data-background-color="green">
                        <h4 class="title">Lịch sử chuyển khoản</h4>
                    </md-card-header>
                    <md-card-content>
                        <div>
                            <b-table id="my-table" striped hover 
                                :items="getHistory" 
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
                { key: 'ngayCK', label: 'Ngày' },
                { key: 'soTaiKhoanNhan', label: 'TK nhận' },
                { key: 'giaoDich', label: 'Giao dịch' },
                { key: 'noiDungChuyen', label: 'Nội dung' },
                { key: 'nganHangNhan', label: 'Ngân hàng nhận' }
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
        async getHistory() {
            const accessToken = await this.getToken();

            return axios.get("/lichsuchuyenkhoan", {
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
                return this.lichSuList;
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