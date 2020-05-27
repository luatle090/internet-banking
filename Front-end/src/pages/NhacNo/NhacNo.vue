<template>
    <div class="content">
        <div class="md-layout">
            <div class="md-layout-item md-medium-size-100 md-xsmall-size-100 md-size-100" >
                <b-alert v-model="show" variant="success"  dismissible>{{ message }}</b-alert>
                <md-card>
                    <md-card-header data-background-color="green">
                        <h4 class="title">{{ title }}</h4>
                    </md-card-header>
                    <md-card-content>
                         <div class="md-layout-item btn-layout-table md-size-100 text-right">
                            <md-button type="button" to="/taonhacno" class="md-raised md-success btn-size">
                                Tạo nhắc nợ
                            </md-button>
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
                                    <button title="Chi tiết" type="button" @click="detailedNhacNo(row.item.id)" 
                                        class="md-button md-just-icon md-theme-default md-info md-simple"
                                    >
                                        <div class="md-ripple"> <div class="md-button-content">
                                        <md-icon>info</md-icon>
                                        </div></div>
                                    </button>
                                    <button type="button" title="Xóa" @click="deleteNhacNo(row)" 
                                        class="md-button md-just-icon md-theme-default md-danger md-simple"
                                    >
                                        <div class="md-ripple"> <div class="md-button-content">
                                        <md-icon>delete</md-icon>
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
            title: 'Nhắc nợ',
            currentPage: 1,
            perPage: 3,
            loai: 0,
            tinhTrang: '',
            isBusy: false,
            show: false,
            message: 'Tạo nhắc nợ thành công',
            headers: [
                { key: 'ngayTao', label: 'Ngày tạo TB' },
                { key: 'soTK', label: 'Số TK Nợ' },
                { key: 'nguoiNo', label: 'Họ tên người nợ' },
                { key: 'tienNo', label: 'Tiền nợ' },
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

        // async getNhacNo(){
        //     const accessToken = await this.getToken();

        //     return axios.get("/nhacno", {
        //         headers: {
        //         "x-access-token": accessToken
        //         },
        //         params: {
        //             tinhTrang: '',
        //             loai: 0,
        //             limit: this.perPage,
        //             offset: this.currentPage - 1
        //         }
        //     })
        //     .then(res => {
        //         this.nhacNoList = res.data.listResult;
        //         this.rows =res.data.totalItems;
        //         return this.nhacNoList;
        //     })
        //     .catch(err => {
        //         console.log(err);
        //     });    
        // },
        async detailedNhacNo(){
            console.log("event detailed");
        },
        async deleteNhacNo(row){
            const info = {
                idNhacNo: row.item.id,
                tinhTrang: this.tinhTrang,
                loai: this.loai,
                limit: this.perPage,
                offset: this.currentPage - 1
            }
            this.isBusy = !this.isBusy;
            await this.deleteNhacNoAndGetMore(info);
            this.isBusy = !this.isBusy; 
        //     this.dsNhacNo.splice(row.index, 1);
        //     console.log(this.dsNhacNo);

        //     // const accessToken = await this.getToken();
        //     // axios.delete(`/nhacno/${row.item.id}`, {
        //     //     headers: {
        //     //     "x-access-token": accessToken
        //     //     }
        //     // })
        //     // .then(res => {
        //     //     this.nhacNoList = res.data.listResult;
        //     //     this.rows =res.data.totalItems;
        //     //     return this.nhacNoList;
        //     // })
        //     // .catch(err => {
        //     //     console.log(err);
        //     // });
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