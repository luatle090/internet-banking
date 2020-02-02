<template>
  <div class="content">
    <div class="md-layout">
      <div
        class="md-layout-item md-medium-size-100 md-xsmall-size-100 md-size-100"
      >
        <md-card>
          <md-card-header data-background-color="green">
            <h4 class="title">tài khoản thanh toán</h4>
          </md-card-header>
          <md-card-content>
            <div>
              <md-table :table-header-color="tableHeaderColor">
                <md-table-row slot="md-table-row">
                  <md-table-head>Số tài khoản</md-table-head>
                  <md-table-head>Số dư</md-table-head>
                </md-table-row>
                <md-table-row slot="md-table-row">
                  <md-table-cell md-label="Name">{{
                    taikhoanthanhtoan.soTK
                  }}</md-table-cell>
                  <md-table-cell md-label="Country">{{
                    taikhoanthanhtoan.soDu
                  }}</md-table-cell>
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
                  <md-table-cell md-label="Số dư">{{
                    item.soDu
                  }}</md-table-cell>
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
// import { SimpleTable, OrderedTable } from "@/components";
import axios from "axios";

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
      taikhoantietkiem: []
    };
  },
  mounted() {
    axios
      .get("http://localhost:3000/api/taikhoannganhang/danhsachtaikhoan", {
        headers: {
          "x-access-token":
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTU4MDMxMzQxNywiZXhwIjoxNTgwOTEzNDE3fQ.sxzU6q8NH1dIAA2UllsYEdenSSYxYhJV8jMwxEEpgtY"
        }
      })
      .then(res => {
        console.log(res.data.tkng);
        this.taikhoanthanhtoan = res.data.tkng;
        this.taikhoantietkiem = res.data.tktk;
      })
      .catch(err => {
        console.error(err);
      });
  }
};
</script>
