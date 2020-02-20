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
                            <md-table :table-header-color="tableHeaderColor">
                                <md-table-row slot="md-table-row">
                                    <md-table-head>Ngày</md-table-head>
                                    <md-table-head>Nhận từ TK</md-table-head>
                                    <md-table-head>Giao Dịch</md-table-head>
                                    <md-table-head>Nội dung</md-table-head>
                                    <md-table-head>Nhận từ Ngân Hàng</md-table-head>
                                </md-table-row>
                                <md-table-row slot="md-table-row" :key="item.id" v-for="item in lichSuList">
                                    <md-table-cell md-label="Name">{{item.ngay}}</md-table-cell>
                                    <md-table-cell md-label="Name">{{item.soTaiKhoanGui}}</md-table-cell>
                                    <md-table-cell md-label="Name">
                                        <input type="hidden" v-model.lazy="item.giaoDich" v-money="money" />
                                        {{item.giaoDich}} 
                                    </md-table-cell>
                                    <md-table-cell md-label="Name">
                                        {{item.noiDungChuyen}}
                                    </md-table-cell>
                                    <md-table-cell md-label="Name">
                                        {{item.nganHangGui}}
                                    </md-table-cell>
                                </md-table-row>
                            </md-table>
                        </div>
                        <!-- <simple-table table-header-color="green"></simple-table> -->
                    </md-card-content>
                </md-card>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
import {VMoney} from 'v-money';
export default {
    data() {
        return {
            lichSuList: [],
            money: {
                thousands: ',',
                precision: 0,
                masked: false
            }
        };
    },

    mounted() {
        axios
            .get('http://localhost:3000/api/lichsunhantien', {
                headers: {
                "x-access-token": localStorage.getItem('accessToken')
                }
            })
            .then(res => {
                this.lichSuList = res.data;
            })
            .catch(err => {
                console.log(err);
            });
    },
    directives: {
        money: VMoney
    }
}
</script>