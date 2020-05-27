<template>
  <div class="content">
    <div class="md-layout">
      <div
        class="md-layout-item md-medium-size-100 md-xsmall-size-100 md-size-100"
      >
      <b-alert v-model="show" :variant="isError ? 'danger' : 'success'"  dismissible>{{ message }}</b-alert>
        <md-card>
          <md-card-header data-background-color="green">
            <h4 class="title">tài khoản thanh toán</h4>
          </md-card-header>
          <md-card-content>
            <div>
              <md-table >
                <md-table-row slot="md-table-row">
                  <md-table-head>Số tài khoản</md-table-head>
                  <md-table-head>Số dư</md-table-head>
                  <md-table-head>Tình trạng</md-table-head>
                  <md-table-head>Thao tác</md-table-head>
                </md-table-row>
                <md-table-row slot="md-table-row">
                  <md-table-cell md-label="Name">{{ taikhoanthanhtoan.soTK }}</md-table-cell>
                  <md-table-cell md-label="Country">
                    <input type="hidden" v-model.lazy="taikhoanthanhtoan.soDu" v-money="money" />
                    {{ taikhoanthanhtoan.soDu }}
                  </md-table-cell>
                  <md-table-cell md-label="Name">{{ taikhoanthanhtoan.tinhTrang === 1 ? 'Hoạt động' : 'Hết hoạt động'}}</md-table-cell>
                  <md-table-cell md-label="Name">   
                    <md-button class="md-just-icon md-simple md-primary" @click="showDialog = true">
                      <div v-if="taikhoanthanhtoan.tinhTrang === 1"> 
                      <md-icon>toggle_off</md-icon>
                      <md-tooltip md-direction="top">Đóng tài khoản</md-tooltip>
                      </div>
                      <div v-else>
                      <md-icon>toggle_on</md-icon>
                      <md-tooltip md-direction="top">Mở tài khoản</md-tooltip>
                      </div>
                    </md-button>
                  </md-table-cell>
                </md-table-row>
              </md-table>
            </div>
            <!-- <simple-table table-header-color="green"></simple-table> -->
          </md-card-content>
        </md-card>
      </div>

      <div
        class="md-layout-item md-medium-size-100 md-xsmall-size-100 md-size-100"
      >
        <md-card>
          <md-card-header data-background-color="green">
            <h4 class="title">tài khoản tiết kiệm</h4>
          </md-card-header>
          <md-card-content>
            <div>
              <md-table
                v-model="taikhoantietkiem"
                :table-header-color="tableHeaderColor"
              >
                <md-table-row slot="md-table-row" slot-scope="{ item }">
                  <md-table-cell md-label="Số tài khoản">{{
                    item.id
                  }}</md-table-cell>
                  <md-table-cell md-label="Số dư">
                    <input type="hidden" v-model.lazy="item.soDu" v-money="money" />
                    {{ item.soDu }}
                  </md-table-cell>
                </md-table-row>
              </md-table>
            </div>
            <!-- <simple-table table-header-color="green"></simple-table> -->
          </md-card-content>
        </md-card>
      </div>
    </div>

    <md-dialog :md-active.sync="showDialog">

        <md-card-content>
          <div class="md-layout primary">
          <div class="md-layout-item md-size-90">
              <div class="md-layout">
                  <div class="md-layout-item md-small-size-100 md-size-100">
                    <label v-if="taikhoanthanhtoan.tinhTrang === 1">Đóng tài khoản sẽ không thể làm bất kỳ thao tác khác. Bạn có muốn tiếp tục?</label>
                    <label v-else>Bạn có muốn mở lại tài khoản?</label>
                  </div>
              </div>
          </div>
          </div>
        </md-card-content>

        <md-dialog-actions>
            <md-button class="md-light" @click="showDialog = false">Close</md-button>
            <md-button v-if="taikhoanthanhtoan.tinhTrang === 1" class="md-success" @click="DongTaiKhoan">Đóng tài khoản</md-button>
            <md-button v-else class="md-success" @click="DongTaiKhoan">Mở tài khoản</md-button>
        </md-dialog-actions>
    </md-dialog>
  </div>
</template>

<script>
// import { SimpleTable, OrderedTable } from "@/components";
import axios from "axios";
import { VMoney } from "v-money";
import { mapActions } from 'vuex';

export default {
  components: {
    // OrderedTable,
    // SimpleTable
  },
  props: {
    tableHeaderColor: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      taikhoanthanhtoan: {},
      taikhoantietkiem: [],
      message: "",
      show: false,
      isError: false,
      showDialog: false,
      money: {
        thousands: ",",
        precision: 0,
        masked: false
      }
    };
  },
  directives: {
    money: VMoney
  },
  methods: {
    ...mapActions(["getToken"]),
    async getDanhSachTaiKhoan(){
      const accessToken = await this.getToken();
      axios.get("/taikhoannganhang/danhsachtaikhoan", {
        headers: {
          "x-access-token": accessToken
        }
      })
      .then(res => {
        console.log(res.data.tkng);
        this.taikhoanthanhtoan = res.data.tkng;
        this.taikhoantietkiem = res.data.tktk;
      })
      .catch(err => {
        console.log(err);
      });
    },
    async DongTaiKhoan(){
      const accessToken = await this.getToken();
      this.showDialog = false;
      axios({
        method: "patch",
        url: "/taikhoannganhang/dongtaikhoan",
        headers:{
            "x-access-token" : accessToken
        }
      })
      .then(res => {
        this.taikhoanthanhtoan.tinhTrang = this.taikhoanthanhtoan.tinhTrang === 1 ? 0 : 1;
        if(this.taikhoanthanhtoan.tinhTrang === 0)
          this.message = 'Tài khoản thanh toán đã đóng';
        else
          this.message = 'Tài khoản thanh toán đã mở lại';
        this.isError = false;
        this.show = true;
      })
      .catch(err => {
        this.isError = true;
        this.show = true;
        if(err.status === 401){
          this.message = 'Không thể đóng tài khoản'
        }
        else{
          this.message = 'Có lỗi xảy ra, vui lòng liên hệ quản trị viên'
        }
      });
    }
  },
  mounted() {
    this.getDanhSachTaiKhoan();
  }
};
</script>