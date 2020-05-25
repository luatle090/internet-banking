<template>
  <div class="content pt-0 h-100">
    <md-dialog :md-active.sync="showDialog">
      <md-dialog-title>Thông tin nhân viên</md-dialog-title>

      <md-card-content>
        <div class="md-layout primary">
          <div :class="`md-layout-item md-size-${this.CusInfo.id ? '45' : '90'}`">
            <div class="md-layout">
              <div class="md-layout-item md-small-size-100 md-size-100">
                <md-field>
                  <label>Tên tài khoản*</label>
                  <md-input v-model="CusInfo.username" type="text"></md-input>
                </md-field>
              </div>
              <div class="md-layout-item md-small-size-100 md-size-100">
                <md-field>
                  <label>Họ tên*</label>
                  <md-input v-model="CusInfo.hoTen"></md-input>
                </md-field>
              </div>
              <div class="md-layout-item md-small-size-100 md-size-100">
                <md-field>
                  <label>Địa chỉ*</label>
                  <md-input v-model="CusInfo.diaChi" type="text"></md-input>
                </md-field>
              </div>
              <div class="md-layout-item md-small-size-100 md-size-100">
                <md-field>
                  <label>Email*</label>
                  <md-input v-model="CusInfo.email" type="text"></md-input>
                </md-field>
              </div>
              <div class="md-layout-item md-small-size-100 md-size-100">
                <md-field>
                  <label>Vai trò*</label>
                  <md-input v-model="CusInfo.idVaiTro" type="text"></md-input>
                </md-field>
              </div>
            </div>
          </div>
          <div class="md-layout-item md-size-10">
            <table style="height:100%">
              <td class="align-middle">
                <md-button
                  class="md-just-icon md-warning"
                  :disabled="this.CusInfo.id ? true : false"
                  @click="GenerateInfo"
                >
                  <md-icon>keyboard_arrow_right</md-icon>
                  <md-tooltip md-direction="top">Generate thông tin khởi tạo</md-tooltip>
                </md-button>
              </td>
            </table>
          </div>
          <div class="md-layout-item md-size-45" v-if="this.CusInfo.id ? true : false">
            <div class="md-layout">
              <div class="md-layout-item md-small-size-100 md-size-100">
                <md-field>
                  <label>Id</label>
                  <md-input v-model="CusInfo.id" disabled type="text"></md-input>
                </md-field>
              </div>
              <div class="md-layout-item md-small-size-100 md-size-100">
                <md-field>
                  <label>Họ tên</label>
                  <md-input v-model="CusInfo.hoTen" type="text"></md-input>
                </md-field>
              </div>
              <div class="md-layout-item md-small-size-100 md-size-100">
                <md-field>
                  <label>username</label>
                  <md-input v-model="CusInfo.username" type="text"></md-input>
                </md-field>
              </div>
              <div class="md-layout-item md-small-size-100 md-size-100">
                <md-field>
                  <label>Địa chỉ</label>
                  <md-input v-model="CusInfo.diaChi" type="text"></md-input>
                </md-field>
              </div>
              <md-dialog-actions>
                <md-button class="md-primary" @click="showDialog = false">Close</md-button>
                <md-button class="md-primary" @click="Submit">Save</md-button>
              </md-dialog-actions>
            </div>
          </div>
        </div>
      </md-card-content>
    </md-dialog>
    <md-dialog :md-active.sync="showDeleteDialog">
      <md-dialog-title>Xóa nhân viên</md-dialog-title>

      <md-card-content>
        <div class="md-layout primary">
          <div class="md-layout-item md-small-size-100 md-size-100 wight-500">
            <md-field>
              <label>ID</label>
              <md-input v-model="CusInfo.id" type="text"></md-input>
            </md-field>
            <md-field>
              <label>Tên tài khoản*</label>
              <md-input v-model="CusInfo.username" type="text"></md-input>
            </md-field>
            <md-field>
              <label>Họ tên*</label>
              <md-input v-model="CusInfo.hoTen"></md-input>
            </md-field>
            <md-field>
              <label>Vai trò*</label>
              <md-input v-model="CusInfo.idVaiTro" type="text"></md-input>
            </md-field>
          </div>
        </div>
      </md-card-content>

      <md-dialog-actions>
        <md-button class="md-primary" @click="showDeleteDialog = false">Close</md-button>
        <md-button class="md-primary" @click="submitDelete">Xán nhận</md-button>
      </md-dialog-actions>
    </md-dialog>
    <div class="md-layout">
      <div class="md-layout-item md-medium-size-100 md-xsmall-size-100 md-size-100">
        <md-card>
          <md-card-header data-background-color="green">
            <h4 class="title">Danh sách nhân viên</h4>
          </md-card-header>
          <md-card-content>
            <div class="md-layout">
              <div class="md-layout-item md-small-size-100 md-size-25">
                <md-field>
                  <label>Tên đăng nhập</label>
                  <md-input v-model="filter.Username" type="text"></md-input>
                </md-field>
              </div>
              <div class="md-layout-item md-small-size-100 md-size-25">
                <md-field>
                  <label>Họ tên</label>
                  <md-input v-model="filter.HoTen" type="text"></md-input>
                </md-field>
              </div>
              <div class="md-layout-item md-small-size-100 md-size-25">
                <md-field>
                  <label>Email</label>
                  <md-input v-model="filter.Email"></md-input>
                </md-field>
              </div>
              <div class="md-layout-item md-small-size-100 md-size-25">
                <md-field>
                  <label>Id</label>
                  <md-input v-model="filter.id" type="number"></md-input>
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
              <md-table v-model="dsnhanvien" :table-header-color="tableHeaderColor">
                <md-table-row slot="md-table-row" slot-scope="{ item }">
                  <md-table-cell md-label="STT">{{ item.RowIndex }}</md-table-cell>
                  <md-table-cell md-label="Họ tên">{{ item.hoTen }}</md-table-cell>
                  <md-table-cell v-show="{id}" md-label="id">{{ item.id }}</md-table-cell>
                  <md-table-cell md-label="Email">{{ item.email }}</md-table-cell>
                  <md-table-cell md-label="Tên tài khoản">{{ item.username }}</md-table-cell>
                  <md-table-cell md-label="Địa chỉ">{{ item.diaChi }}</md-table-cell>

                  <md-table-cell md-label="Vai trò" v-if="item.idVaiTro ===1">Nhân viên</md-table-cell>
                  <md-table-cell md-label="Vai trò" v-else>Quản lý</md-table-cell>

                  <md-table-cell md-label="Thao tác">
                    <md-button class="md-just-icon md-simple md-primary" @click="Edit(item)">
                      <md-icon>edit</md-icon>
                      <md-tooltip md-direction="top">Edit</md-tooltip>
                    </md-button>
                    <md-button class="md-just-icon md-simple md-primary" @click="Delete(item)">
                      <md-icon>delete</md-icon>
                      <md-tooltip md-direction="top">Xóa</md-tooltip>
                    </md-button>
                    <!-- <md-button class="md-just-icon md-simple md-danger">
                      <md-icon>close</md-icon>
                      <md-tooltip md-direction="top">Close</md-tooltip>
                    </md-button>-->
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
import { mapActions } from "vuex";

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
      dsnhanvien: [],
      filter: {
        Email: "",
        id: "",
        Username: "",
        HoTen: ""
      },
      rows: 100,
      perPage: 50,
      currentPage: 1,

      showDialog: false,
      isEdit: false,
      CusInfo: {
        hoTen: "",
        email: "",
        diachi: "",
        username: "",
        id: "",
        idvaitro: ""
      },
      showDeleteDialog: false,
      rechargeValue: 0
    };
  },
  computed: {
    calrecharge() {
      return (
        parseFloat(this.CusInfo.soDu || 0) + parseFloat(this.rechargeValue || 0)
      );
    }
  },
  mounted() {
    this.fetchDSNhanVien();
  },
  methods: {
    ...mapActions(["getToken"]),
    async fetchDSNhanVien() {
      const accessToken = await this.getToken();
      axios
        .get(
          `/nhanvien/getlist/${this.currentPage}?Email=${this.filter.Email}&HoTen=${this.filter.HoTen}&Username=${this.filter.Username}&Id=${this.filter.id}`,
          {
            headers: {
              "x-access-token": accessToken
            }
          }
        )
        .then(res => {
          this.dsnhanvien = res.data[1];
          this.rows = res.data[0].affectedRows;
        })
        .catch(err => {
          console.error(err);
        });
    },
    Search() {
      this.fetchDSNhanVien();
    },
    Create() {
      this.CusInfo = {};
      this.showDialog = true;
      this.isEdit = false;
    },
    Edit(Customer) {
      this.CusInfo = Customer;
      this.showDialog = true;
      this.isEdit = true;
    },
    Delete(item) {
      this.rechargeValue = 0;
      this.showDeleteDialog = true;
      this.CusInfo = item;
    },
    async submitDelete() {
      const info = {
        id: this.CusInfo.id
      };
      const accessToken = await this.getToken();
      const res = axios({
        method: "delete",
        url: `/nhanvien/${info.id}`,
        info,
        headers: {
          "Content-Type": "application/json",
          "x-access-token": accessToken
        }
      }).catch(err => {
        console.error(err);
      });
      if (res) { 
        this.dsnhanvien.pop({ ...this.CusInfo });
        await this.$swal({
          icon: "success",
          text: "xóa thành công"
        });
        this.showDeleteDialog = false;
      }
    },
    GenerateInfo() {
      if (!this.CusInfo.hoTen || !this.CusInfo.username) {
        this.$swal({
          icon: "question",
          text: "Vui lòng điền đủ đủ thông tin (họ tên, email, số điện thoại  )"
        });
        return;
      }
      const tenDangKy = this.CusInfo.hoTen;
      const username = this.CusInfo.username;
      const id = "hiển thị khi hoàn tất";
      const idTK = -1;
      this.CusInfo = { ...this.CusInfo, tenDangKy, username, id };
    },
    Submit() {
      if (this.isEdit) this.EditSubmit();
      else this.CreateSubmit();
    },
    async CreateSubmit() {
      const nhanVien = {
        hoTen: this.CusInfo.hoTen,
        email: this.CusInfo.email,
        username: this.CusInfo.username,
        idVaiTro: this.CusInfo.idVaiTro,
        diaChi: this.CusInfo.diaChi,
        password: "123"
      };
      const accessToken = await this.getToken();
      const submitKH = axios({
        method: "post",
        url: `/nhanvien`,
        headers: {
          "Content-Type": "application/json",
          "x-access-token": accessToken
        },
        data: nhanVien
      })
        .then(res => {
          this.CusInfo.id = res.data.id;
          this.showDialog = false;
          console.log(this.CusInfo);
          this.dsnhanvien.push({ ...this.CusInfo });
          this.$swal({
            icon: "success",
            text: "thêm thành công"
          });
        })
        .catch(err => {
          console.error(err);
        });
    },
    async EditSubmit() {
      console.log(this.CusInfo);
      const nhanVien = {
        hoTen: this.CusInfo.hoTen,
        email: this.CusInfo.email,
        username: this.CusInfo.username,
        idVaiTro: this.CusInfo.idVaiTro,
        diaChi: this.CusInfo.diaChi
      };
      const accessToken = await this.getToken();
      const submitKH = axios({
        method: "patch",
        url: `/nhanvien/${this.CusInfo.id}`,
        headers: {
          "Content-Type": "application/json",
          "x-access-token": accessToken
        },
        data: nhanVien
      });
      let request = [submitKH];
      axios
        .all(request)
        .then(
          axios.spread((...responses) => {
            this.$swal({
              icon: "success",
              text: "lưu thành công"
            });
          })
        )
        .catch(errors => {
          // react on errors.
        });
    }
  },
  watch: {
    currentPage(to) {
      this.fetchDSNhanVien();
    }
  }
};
</script>
