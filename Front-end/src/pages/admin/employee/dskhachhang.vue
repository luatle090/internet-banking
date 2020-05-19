<template>
  <div class="content">
    <md-dialog :md-active.sync="showDialog">
      <md-dialog-title>Thông tin khách hàng</md-dialog-title>

      <md-card-content>
        <div class="md-layout primary">
          <div :class="`md-layout-item md-size-${this.CusInfo.idTK ? '45' : '90'}`">
            <div class="md-layout">
              <div class="md-layout-item md-small-size-100 md-size-100">
                <md-field>
                  <label>Họ tên*</label>
                  <md-input v-model="CusInfo.hoTen" type="text"></md-input>
                </md-field>
              </div>
              <div class="md-layout-item md-small-size-100 md-size-100">
                <md-field>
                  <label>Email*</label>
                  <md-input v-model="CusInfo.email"></md-input>
                </md-field>
              </div>
              <div class="md-layout-item md-small-size-100 md-size-100">
                <md-field>
                  <label>Số điện thoại*</label>
                  <md-input v-model="CusInfo.phone" type="number"></md-input>
                </md-field>
              </div>
            </div>
          </div>
          <div class="md-layout-item md-size-10">
            <table style="height:100%">
              <td class="align-middle">
              <md-button class="md-just-icon md-warning" :disabled="this.CusInfo.idTK ? true : false" @click="GenerateInfo">
                <md-icon>keyboard_arrow_right</md-icon>
                <md-tooltip md-direction="top">Generate thông tin thanh toán</md-tooltip>
              </md-button>
              </td>
            </table>
          </div>
          <div class="md-layout-item md-size-45" v-if="this.CusInfo.idTK ? true : false">
            <div class="md-layout">
              <div class="md-layout-item md-small-size-100 md-size-100">
                <md-field>
                  <label>Số tài khoản</label>
                  <md-input v-model="CusInfo.soTK" disabled type="text"></md-input>
                </md-field>
              </div>
              <div class="md-layout-item md-small-size-100 md-size-100">
                <md-field>
                  <label>Tên đăng ký</label>
                  <md-input v-model="CusInfo.tenDangKy" type="text"></md-input>
                </md-field>
              </div>
              <div class="md-layout-item md-small-size-100 md-size-100">
                <md-field>
                  <label>username</label>
                  <md-input v-model="CusInfo.username" :disabled="this.CusInfo.idTK > 0 ? true : false" type="text"></md-input>
                </md-field>
              </div>
            </div>
          </div>
        </div>
      </md-card-content>

      <md-dialog-actions>
        <md-button class="md-primary" @click="showDialog = false">Close</md-button>
        <md-button class="md-primary" @click="Submit">Save</md-button>
      </md-dialog-actions>
    </md-dialog>

    <md-dialog :md-active.sync="showRechargeDialog">
      <md-dialog-title>Thông tin khách hàng</md-dialog-title>

      <md-card-content>
        <div class="md-layout primary">
          <div class="md-layout-item md-small-size-100 md-size-100">
            <md-field>
              <label>số tiên nạp*</label>
              <md-input v-model="rechargeValue" type="number"></md-input>
            </md-field>
            <md-field>
              <label>tài khoản sau khi nạp tiền*</label>
              <md-input :value="calrecharge" type="text" disabled></md-input>
            </md-field>
          </div>
        </div>
      </md-card-content>

      <md-dialog-actions>
        <md-button class="md-primary" @click="showRechargeDialog = false">Close</md-button>
        <md-button class="md-primary" @click="SaveRecharge">Xán nhận</md-button>
      </md-dialog-actions>
    </md-dialog>

    <div class="md-layout">
      <div class="md-layout-item md-medium-size-100 md-xsmall-size-100 md-size-100">
        <md-card>
          <md-card-header data-background-color="green">
            <h4 class="title">Danh sách khách hàng</h4>
          </md-card-header>
          <md-card-content>
            <div class="md-layout">
              <div class="md-layout-item md-small-size-100 md-size-25">
                <md-field>
                  <label>Email</label>
                  <md-input v-model="filter.Email"></md-input>
                </md-field>
              </div>
              <div class="md-layout-item md-small-size-100 md-size-25">
                <md-field>
                  <label>Phone</label>
                  <md-input v-model="filter.Phone" type="text"></md-input>
                </md-field>
              </div>
              <div class="md-layout-item md-small-size-100 md-size-25">
                <md-field>
                  <label>tên đăng nhập</label>
                  <md-input v-model="filter.Username" type="text"></md-input>
                </md-field>
              </div>
              <div class="md-layout-item md-small-size-100 md-size-25">
                <md-field>
                  <label>số tài khoản</label>
                  <md-input v-model="filter.SoTK" type="text"></md-input>
                </md-field>
              </div>
            </div>

            <div class="md-layout">
              <div class="md-layout-item md-size-50 text-left">
                <md-button class="md-raised md-success" @click="this.Search">Search</md-button>
              </div>
              <div class="md-layout-item md-size-50 text-right">
                <md-button class="md-raised md-primary" @click="this.Create">Create</md-button>
              </div>
            </div>
          </md-card-content>
        </md-card>

        <md-card>
          <md-card-content>
            <div class="overflow-auto">
              <b-pagination
                v-model="currentPage"
                :total-rows="rows"
                :per-page="perPage"
                aria-controls="my-table"
                align="center"
              ></b-pagination>
            </div>
            <div>
              <md-table v-model="dskhachhang" :table-header-color="tableHeaderColor">
                <md-table-row slot="md-table-row" slot-scope="{ item }">
                  <md-table-cell md-label="STT">
                    {{ item.RowIndex }}
                  </md-table-cell>
                  <md-table-cell md-label="họ tên">
                    {{ item.hoTen }}
                  </md-table-cell>
                  <md-table-cell md-label="email">
                    {{ item.email }}
                  </md-table-cell>
                  <md-table-cell md-label="phone">
                    {{ item.phone }}
                  </md-table-cell>
                  <md-table-cell md-label="Số tài khoản">
                    {{ item.soTK }}
                  </md-table-cell>
                  
                  <md-table-cell md-label="Thao tác">
                    <md-button class="md-just-icon md-simple md-primary" @click="Edit(item)">
                      <md-icon>edit</md-icon>
                      <md-tooltip md-direction="top">Edit</md-tooltip>
                    </md-button>
                    <md-button class="md-just-icon md-simple md-primary" @click="showrecharge(item)" v-if="item.soTK">
                      <md-icon>attach_money</md-icon>
                      <md-tooltip md-direction="top">Nạp tiền</md-tooltip>
                    </md-button>
                    <!-- <md-button class="md-just-icon md-simple md-danger">
                      <md-icon>close</md-icon>
                      <md-tooltip md-direction="top">Close</md-tooltip>
                    </md-button> -->
                  </md-table-cell>
                </md-table-row>
              </md-table>
            </div>

            <div class="overflow-auto">
              <b-pagination
                v-model="currentPage"
                :total-rows="rows"
                :per-page="perPage"
                aria-controls="my-table"
                align="center"
              ></b-pagination>
            </div>
            <!-- <simple-table table-header-color="green"></simple-table> -->
          </md-card-content>
        </md-card>
      </div>
    </div>
  </div>
</template>

<script>
// import { SimpleTable, OrderedTable } from "@/components";
import axios from "axios";
import { mapActions} from "vuex";

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
      dskhachhang: [],
      filter: {
        Email: "",
        Phone: "",
        Username: "",
        SoTK: "",
      },
      rows: 100,
      perPage: 50,
      currentPage: 1,

      showDialog: false,
      isEdit: false,
      CusInfo:{
        hoTen: "",
        email: "",
        phone: ""
      },
      showRechargeDialog: false,
      rechargeValue: 0,
    };
  },
  computed: {
    calrecharge() {
      return parseFloat(this.CusInfo.soDu || 0) + parseFloat(this.rechargeValue || 0);
    }
  },
  mounted() {
    this.fetchDSKhachHang();
  },
  methods: {
    ...mapActions(["getToken"]),
    async fetchDSKhachHang() {
      const accessToken = await this.getToken();
      axios
        .get(
          `/khachhang/getlist/${this.currentPage}?Email=${this.filter.Email}&Phone=${this.filter.Phone}&Username=${this.filter.Username}&SoTK=${this.filter.SoTK}`,
          {
            headers: {
              "x-access-token": accessToken
            }
          }
        )
        .then(res => {
          this.dskhachhang = res.data[1];
          this.rows = res.data[0].affectedRows;
        })
        .catch(err => {
          console.error(err);
        });
    },
    Search() {
      this.fetchDSKhachHang();
    },
    Create() {
      this.CusInfo = {};
      this.showDialog = true;
      this.isEdit = false;
    },
    Edit(Customer){
      this.CusInfo = Customer;
      this.showDialog = true;
      this.isEdit = true;
    },
    showrecharge(item){
      this.rechargeValue = 0;
      this.showRechargeDialog = true;
      this.CusInfo = item;
    },
    async SaveRecharge(){
      this.CusInfo.soDu = parseFloat(this.CusInfo.soDu || 0) + parseFloat(this.rechargeValue || 0);
      const info = {
        Id : this.CusInfo.idTK,
        SoDu : this.CusInfo.soDu,
      }
      const res = await axios.patch(`/taikhoannganhang/${info.Id}`,info,{
        headers:{
          "Content-Type": "application/json",
          "x-access-token": localStorage.getItem("accessToken")
        }
      });
      if(res){
        await this.$swal({
          icon: "success",
          text: "nạp tiền thành công"
        })
        this.showRechargeDialog = false;
      }
    },
    GenerateInfo(){
      if(!this.CusInfo.hoTen || !this.CusInfo.phone){
        this.$swal({
          icon: 'question',
          text: 'Vui lòng điền đủ đủ thông tin (họ tên, email, số điện thoại  )',
        });
        return;
      }
      const tenDangKy = this.CusInfo.hoTen;
      const username = this.CusInfo.phone;
      const soTK = "hiển thị khi hoàn tất";
      const idTK = -1;
      this.CusInfo = {...this.CusInfo, tenDangKy, username,soTK,idTK };
    },
    Submit(){
      if(this.isEdit)
        this.EditSubmit();
      else
        this.CreateSubmit();
    },
    async CreateSubmit(){
      const khachHang = {
        hoTen: this.CusInfo.hoTen,
        email: this.CusInfo.email,
        phone: this.CusInfo.phone
      };
      const accessToken = await this.getToken();
      const submitKH = axios({
        method: 'post',
        url: `/khachhang`,
        headers:{
          "Content-Type": "application/json",
          "x-access-token": accessToken
        },
        data: khachHang
      }).then(res => {
        this.CusInfo.id = res.data.id;
        if(this.CusInfo.idTK){
          const tkNganHang = {
            idKhachHang: res.data.id,
            tenDangKy: this.CusInfo.tenDangKy,
            username: this.CusInfo.username,
            password: '123456'
          };
          const submitTkNganHang = axios({
            method: "post",
            url: `/taikhoannganhang`,
            headers:{
              "Content-Type": "application/json",
              "x-access-token": accessToken
            },
            data: tkNganHang
          })
          .then(res =>{
            this.CusInfo = {...this.CusInfo, idKhachHang : res.data.id, soTK : res.data.id};
            this.dskhachhang.push(this.CusInfo);
            this.showDialog = false;
            this.$swal({
              icon: "success",
              text: "thêm thành công"
            })
          });
        }
        else{
          this.showDialog = false;
          console.log(this.CusInfo)
          this.dskhachhang.push({...this.CusInfo});
          this.$swal({
            icon: "success",
            text: "thêm thành công"
          })
        }
      })
      .catch(err => {
        console.error(err); 
      });
    },
    async EditSubmit(){
      console.log(this.CusInfo)
      const khachHang = {
        hoTen: this.CusInfo.hoTen,
        email: this.CusInfo.email,
        phone: this.CusInfo.phone
      };
      const accessToken = await this.getToken();
      const submitKH = axios({
        method: 'patch',
        url: `/khachhang/${this.CusInfo.id}`,
        headers:{
          "Content-Type": "application/json",
          "x-access-token": accessToken
        },
        data: khachHang
      });
      let request = [submitKH];
      if(this.CusInfo.idTK){
        const method = this.CusInfo.idTK != -1 ? "patch" : "post"
        const tkNganHang = {
          idKhachHang: this.CusInfo.id,
          tenDangKy: this.CusInfo.tenDangKy,
          username: this.CusInfo.username,
          password: '123456'
        };
        const submitTkNganHang = axios({
          method: method,
          url: `/taikhoannganhang/${this.CusInfo.idTK != -1 ? this.CusInfo.idTK : ""}`,
          headers:{
            "Content-Type": "application/json",
            "x-access-token": accessToken
          },
          data: tkNganHang
        });
        request.push(submitTkNganHang);
      };
      axios.all(request)
      .then(axios.spread((...responses) => {
        const resKH = responses[0];
        if(responses.length>1 && this.CusInfo.idTK == -1){
          const resTKKH = responses[1];
          this.CusInfo.idTK = resTKKH.data.id;
          this.CusInfo.soTK = resTKKH.data.soTK;
          this.dskhachhang.forEach(element => {
            if(element.id == this.CusInfo.id){
              element.idTK = this.CusInfo.idTK;
              element.soTK = this.CusInfo.soTK;
              element.tenDangKy = this.CusInfo.tenDangKy;
              element.username = this.CusInfo.username;
            }
          });
        }
        this.$swal({
          icon: "success",
          text: "lưu thành công"
        })
      })).catch(errors => {
        // react on errors.
      })
    }
  },
  watch: {
    currentPage(to) {
      this.fetchDSKhachHang();
    },
  }
};
</script>
