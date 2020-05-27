<template>
    <div class="content">
        <div class="md-layout">
            <div class="md-layout-item md-medium-size-100 md-xsmall-size-100 md-size-100" >
                <b-alert v-model="show" :variant="erro ? 'danger' : 'success'"  dismissible>{{ message }}</b-alert>
                <md-card>
                    <md-card-header data-background-color="green">
                        <h4 class="title">{{ title }}</h4>
                    </md-card-header>
                    <md-card-content>
                        <div>
                            <b-form-group >
                                <b-form-radio v-model="selected" value="1">Chưa trả nợ</b-form-radio>
                                <b-form-radio v-model="selected" value="2">Đã trả nợ</b-form-radio>
                            </b-form-group>
                        </div>
                        <div>
                            <b-table id="my-table" striped hover 
                                :items="dsNhacNo"
                                :fields="headers"
                                :per-page="perPage"
                                responsive
                                :busy="isBusy"
                            >
                            <template v-slot:table-busy>
                                <div class="text-center text-danger my-2">
                                <b-spinner class="align-middle"></b-spinner>
                                <strong>Loading...</strong>
                                </div>
                            </template>
                            <template v-slot:cell(actions)="row">
                                <div class="md-table-cell-container">
                                    <button title="Chi tiết" type="button" @click="xemThanhToanNo(row, false)" 
                                        class="md-button md-just-icon md-theme-default md-info md-simple"
                                    >
                                        <div class="md-ripple"> <div class="md-button-content">
                                        <md-icon>info</md-icon>
                                        </div></div>
                                    </button>
                                    <button v-if="selected==1" type="button" title="Thanh toán" @click="xemThanhToanNo(row, true)" 
                                        class="md-button md-just-icon md-theme-default md-danger md-simple"
                                    >
                                        <div class="md-ripple"> <div class="md-button-content">
                                        <md-icon>attach_money</md-icon>
                                        </div></div>
                                    </button>
                                </div>
                            </template>
                            
                            </b-table>
                            <div class="paging-right md-card-actions md-alignment-space-between">
                                <div></div>
                                <b-pagination class="pagination-success "
                                    v-model="currentPage"
                                    :total-rows="totalRows"
                                    :per-page="perPage"
                                    @input="getNhacNo"
                                    aria-controls="my-table"
                                ></b-pagination>
                            </div>
                            <div style="display: none;" :key="item.id" v-for="item in dsNhacNo">
                                <input type="hidden" v-model.lazy="item.tienNo" v-money="money" /> 
                            </div>
                        </div>
                        <!-- <simple-table table-header-color="green"></simple-table> -->
                    </md-card-content>
                </md-card>
            </div>
        </div>

        <!-- Detail nợ-->
        <md-dialog :md-active.sync="showDialog" :md-click-outside-to-close="false">
            <md-dialog-title>Thông tin nợ</md-dialog-title>

            <md-card-content>
                <div class="md-layout primary">
                <div v-if="!showThanhToan" class="md-layout-item md-size-90">
                    <div class="md-layout">
                        <div class="md-layout-item md-small-size-100 md-size-100">
                            <md-field>
                                <label>Số tài khoản nợ</label>
                                <md-input v-model="soTK" disabled type="text"></md-input>
                            </md-field>
                        </div>
                        <div class="md-layout-item md-small-size-100 md-size-100">
                            <md-field>
                                <label>Họ tên chủ nợ</label>
                                <md-input v-model="hoTen" disabled type="text"></md-input>
                            </md-field>
                        </div>
                        <div class="md-layout-item md-small-size-100 md-size-100">
                             <md-field>
                                <label>Số tiền trả nợ</label>
                                <md-input v-model="giaoDich" disabled type="text"></md-input>
                            </md-field>
                        </div>
                        <div class="md-layout-item md-small-size-100 md-size-100">
                             <md-field>
                                <label>noiDung</label>
                                <md-input v-model="noiDung" disabled type="text"></md-input>
                            </md-field>
                        </div>
                        <div class="md-layout-item md-small-size-100 md-size-100">
                             <md-field>
                                <label>Tình trạng</label>
                                <md-input v-model="tinhTrangContent" disabled type="text"></md-input>
                            </md-field>
                        </div>
                    </div>
                </div>
                <div v-else class="md-layout-item md-size-90">
                    <div class="md-layout">
                        <div class="md-layout-item md-small-size-100 md-size-100">
                            <md-field>
                                <label>Nhập Mã OTP</label>
                                <md-input v-model="otp" type="text"></md-input>
                            </md-field>
                        </div>
                    </div>
                </div>
                </div>
            </md-card-content>

            <md-dialog-actions>
                <md-button class="md-light" @click="Reset">Close</md-button>
                <md-button v-show="showBtnOTP" class="md-success" @click="getOTP">Gửi mã OTP</md-button>
                <md-button v-show="showThanhToan" class="md-success" @click="ThanhToanNo">Thanh toán nợ</md-button>
            </md-dialog-actions>
        </md-dialog>
    </div>
</template>

<script>
import axios from "axios";
import { VMoney } from "v-money";
import { mapActions, mapGetters, mapMutations } from "vuex";
import EventSource from "eventsource";

export default {
    data() {
        return {
            title: 'Thông tin nợ',
            currentPage: 1,
            perPage: 3,
            loai: 1,
            tinhTrang: '',
            selected: "1",
            isBusy: false,
            message: "",
            show: false,
            erro: false,
            showDialog: false,
            showThanhToan: false,
            showBtnOTP: false,

            otp: "",
            soTK: "",
            giaoDich: "",
            hoTen: "",
            noiDung: "",
            tinhTrangContent: "",
            idNhacNo: null,

            headers: [
                { key: 'ngayTao', label: 'Ngày tạo TB' },
                { key: 'soTK', label: 'Số TK Chủ Nợ' },
                { key: 'nguoiTao', label: 'Họ tên Chủ nợ' },
                { key: 'tienNo', label: 'Tiền phải trả nợ' },
                { key: 'noiDung', label: 'Nội dung' },
                { key: 'tinhTrang', label: 'Tình trạng' },
                { key: 'actions', label: 'Thao tác' }
            ],
            money: {
                thousands: ",",
                precision: 0,
                masked: false
            }
        };
    },
    computed: {
        ...mapGetters(["dsNhacNo", "totalRows"])
    },
    watch: {
        selected: function(){
            if(this.selected == "2"){
                this.tinhTrang = 1
            }
            else{
                this.tinhTrang = 0;
            }
            this.getNhacNo();
        }
    },
    created(){
        this.getNhacNo();
        this.setupSSE();
    },
    methods: {
        ...mapActions([
            "getToken", 
            "fetchNhacNo", 
            "deleteNhacNoAndGetMore",
            "addHeadNhacNoList"
        ]),
        getNhacNo(){
           
            const params = {
                tinhTrang: this.tinhTrang,
                loai: this.loai,
                limit: this.perPage,
                offset: this.currentPage - 1
            }
            this.fetchNhacNo(params);
        },
        async setupSSE(){
            
            if (typeof(EventSource) === 'undefined') {
                console.log('not support');
                return;
            }
            const accessToken = await this.getToken();
            var eventSourceInitDict = {headers: {'x-access-token': accessToken}};
            var src = new EventSource('http://localhost:3000/api/nhacNoAddedEvent', eventSourceInitDict);
            
            src.onerror = function(e) {
                if(e.eventPhase == EventSource.CLOSED){
                    src.close();
                    console.log("Event Source Closed");
                }
                else{
                    console.log('error: ' + e);
                }
            }

            src.addEventListener('NHACNO_ADDED', function(e) {
                var data = JSON.parse(e.data);
                //console.log(data);
                this.addHeadNhacNoList(data);
            }.bind(this), false);
        },

        async getOTP(){
            this.showThanhToan = true;
            this.showBtnOTP = false;
            const accessToken = await await this.getToken();
                axios({
                    method: "get",
                    url: "/hkl/chuyenkhoan/getotp",
                    headers:{
                    "x-access-token" : accessToken
                    }
                });
        },
        Reset(){
            this.showDialog = false;
            this.showBtnOTP = false;
            this.showThanhToan = false;
            this.idNhacNo = null;
        },
        xemThanhToanNo(row, btnOTP){
            const info = row.item;

            this.idNhacNo = info.id;
            this.showDialog = true;
            this.soTK = info.soTK;
            this.giaoDich = info.tienNo;
            this.hoTen = info.nguoiTao;
            this.noiDung = info.noiDung;
            this.tinhTrangContent = info.tinhTrang;

            this.showBtnOTP = btnOTP;
        },
        async ThanhToanNo(){
            const data = {
                idNhacNo: this.idNhacNo,
                noiDung: "Thanh toán nợ"
            }
            

            const accessToken = await this.getToken();
            axios({
                method: "post",
                url: "/hkl/chuyenkhoan/thanhtoanno",
                headers:{
                    "x-access-token" : accessToken
                },
                data: data
            }).then(res => {
                if(res.status === 201){
                    this.message = "Thanh toán nợ thành công";
                }
                else if(res.status === 204){
                    this.message = "Không đủ tiền để thanh toán"
                }
            }).catch(err => {
                 if(err.response.status === 404){
                    this.message = "Sai mã OTP";
                }
                else {
                    this.message = "Có lỗi xảy ra. Vui lòng thử lại sau";
                    this.erro = true;
                    this.show = true;
                }
            });
        }
    },
    directives: {
        money: VMoney
    }
};
</script>
<style scoped>
    .md-table-cell-container .md-button{
        margin: 0;
        padding: 5px;
        height: 27px;
        min-width: 27px;
        width: 27px;
        line-height: 27px;
    }
    .btn-layout-table{
        margin: 10px 0 20px 0;
    }
    .btn-size{
        height: 40px;
        width: 125px;
    }
</style>