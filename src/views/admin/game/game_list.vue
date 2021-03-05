<template>
  <div>
    <loading :active.sync="loading" />
    <nav-bar @sidebar="opensidebar" />
    <div class="row content">
      <side
        id="side"
        class="col"
        style="max-width: 218px; margin-left: -14rem"
      />
      <div id="cont" class="col-md-auto" style="width: 90%; margin: 0 auto">
        <b-input-group prepend="遊戲ID" style="margin-top: 15px" size="sm">
          <b-form-input
            v-model="filter"
            id="filter-input"
            type="search"
            placeholder="Search"
          />
          <b-button v-b-modal.create size="sm" variant="primary">
            新增
          </b-button>
          <b-modal id="create" centered title="新增遊戲">
            <form style="font-size: 14px">
              <b-form-group label="遊戲ID" size="sm">
                <b-form-input
                  v-model="createdata.gid"
                  placeholder="限輸入數字"
                />
              </b-form-group>
              <b-form-group label="遊戲資訊ID" size="sm">
                <b-form-input
                  v-model="createdata.info_id"
                  placeholder="限輸入數字"
                />
              </b-form-group>
              <b-form-group label="遊戲商ID" size="sm">
                <b-form-input
                  v-model="createdata.provider_id"
                  placeholder="限輸入數字"
                />
              </b-form-group>
              <b-form-group label="狀態" size="sm">
                <b-form-select :options="status" v-model="createdata.status" />
              </b-form-group>
            </form>
            <template #modal-footer="{ cancel }">
              <b-button variant="success" @click="create()" size="sm"
                >新增</b-button
              >
              <b-button variant="danger" @click="cancel()" size="sm"
                >取消</b-button
              >
            </template>
          </b-modal>
        </b-input-group>
        <b-table
          style="font-size: 10px"
          :items="game"
          :fields="fields"
          :filter="filter"
          :filter-included-fields="['gid']"
          class="my-3"
          responsive
          striped
          hover
        >
          <template #cell(gid)="data">
            <b-input-group size="sm">
              <b-form-text style="display: block" :id="`gid_${data.item.id}`">
                {{ data.item.gid }}
              </b-form-text>
            </b-input-group>
          </template>
          <template #cell(game_with_gameinfo)="data">
            <b-input-group size="sm">
              <b-form-text style="display: block" :id="`gid_${data.item.id}`">
                {{ data.item.game_with_gameinfo.name }}
              </b-form-text>
            </b-input-group>
          </template>
          <template #cell(info_id)="data">
            <b-input-group size="sm">
              <b-form-input
                type="text"
                v-model="data.item.info_id"
                :id="`inputinfo_${data.item.id}`"
                placeholder="限輸入數字"
                style="display: none"
              />
              <b-form-text style="display: block" :id="`info_${data.item.id}`">
                {{ data.item.info_id }}
              </b-form-text>
            </b-input-group>
          </template>
          <template #cell(provider_id)="data">
            <b-input-group size="sm">
              <b-form-input
                type="text"
                v-model="data.item.provider_id"
                :id="`inputprovider_${data.item.id}`"
                placeholder="限輸入數字"
                style="display: none"
              />
              <b-form-text
                style="display: block"
                :id="`provider_${data.item.id}`"
              >
                {{ data.item.provider_id }}
              </b-form-text>
            </b-input-group>
          </template>
          <template #cell(status)="data">
            <b-input-group size="sm">
              <b-form-select
                v-model="data.item.status"
                :options="status"
                :id="`inputstatus_${data.item.id}`"
                style="display: none"
              />
              <b-form-text
                :style="`display: block;color:${
                  data.item.status == 1 ? '#00BB00' : '#FF0000'
                }!important`"
                :id="`status_${data.item.id}`"
              >
                {{ data.item.status == 1 ? "啟用" : "下架" }}
              </b-form-text>
            </b-input-group>
          </template>
          <template #cell(updata)="data" class="row">
            <b-button
              size="sm"
              style="width: 60px; display: none"
              variant="success "
              :id="`subbtn_${data.item.id}`"
              @click="submit(data)"
            >
              送出
            </b-button>
            <b-button
              size="sm"
              style="width: 60px; display: none;margin-top:5px"
              variant="danger "
              :id="`cancel_${data.item.id}`"
              @click="cancel(data)"
            >
              取消
            </b-button>
            <b-button
              size="sm"
              style="width: 60px; display: block"
              :id="`updbtn_${data.item.id}`"
              :disabled="chmod"
              @click="update(data.item.id)"
            >
              修改
            </b-button>
          </template>
        </b-table>
      </div>
    </div>
    <footer- />
  </div>
</template>

<style lang="scss" scoped>
#side {
  transition: margin-left 0.5s;
}
#cont {
  transition: all 0.5s;
}
.content {
  min-height: 100vh;
  height: auto;
  margin: 0 auto -247px;
  padding-bottom: 247px;
  width: 100%;
}
.table-responsive {
  overflow-y: hidden;
}
</style>

<script>
import axios from "axios";
import VueCookies from "vue-cookies";

export default {
  data() {
    return {
      loading: false,
      datalength: false,
      chmod: true,
      filter: null,
      createdata: [
        {
          gid: null,
          info_id: null,
          provider_id: null,
          status: null,
        },
      ],
      game: [],
      status: [
        { text: "下架", value: 0 },
        { text: "啟用", value: 1 },
      ],
      fields: [
        {
          key: "gid",
          label: "遊戲ID",
          thStyle: "min-width:100px",
        },
        {
          key: "game_with_gameinfo",
          label: "遊戲名稱",
          thStyle: "min-width:100px",
        },
        {
          key: "info_id",
          label: "遊戲資訊ID",
          thStyle: "min-width:100px",
        },
        {
          key: "provider_id",
          label: "遊戲商ID",
          thStyle: "min-width:100px",
          sortable: true,
        },
        {
          key: "status",
          label: "狀態",
          thStyle: "min-width:100px",
          sortable: true,
        },
        {
          key: "updated_at",
          label: "更新時間",
          thStyle: "min-width:106px",
          sortable: true,
        },
        {
          key: "created_at",
          label: "建立時間",
          thStyle: "min-width:106px",
          sortable: true,
        },
        {
          key: "updata",
          label: "修改",
        },
      ],
      target_array : [
        "inputinfo",
        "inputprovider",
        "inputstatus",
        "info",
        "provider",
        "status",
        "subbtn",
        "updbtn",
        "cancel",
      ]
    };
  },
  created: async function () {
    this.createdata.gid = "";
    this.createdata.info_id = "";
    this.createdata.provider_id = "";
    this.createdata.status = 1;
    this.loading = await true;
    await axios
      .post(`${this.api}/game`, {
        api_token: VueCookies.get("token"),
        id: sessionStorage.getItem("id"),
      })
      .then((res) => {
        this.loading = false;
        this.game = res.data.result.game;
        console.log(this.game);
      });
    if (this.game.length != 0) {
      this.datalength = true;
    } else {
      this.$swal({
        title: "很抱歉！",
        text: "查無相關資料",
        icon: "warning",
      });
    }
    if (sessionStorage.getItem("chmod") == "user") {
      this.chmod = true;
    } else {
      this.chmod = false;
      this.$root.$emit("bv::disable::tooltip");
    }
  },
  methods: {
    update(id) {
      this.target_array.forEach((item, index) => {
        if (
          item == "info" ||
          item == "provider" ||
          item == "status" ||
          item == "updbtn"
        ) {
          document.getElementById(`${item}_${id}`).style.display = "none";
        } else {
          document.getElementById(`${item}_${id}`).style.display = "block";
        }
      });
    },
    submit(data) {
      var info_id = String(data.item.info_id);
      var provider_id = String(data.item.provider_id);
      var status = String(data.item.status);
      if (info_id == "" || provider_id == "" || status == "") {
        this.$swal({
          title: "修改失敗！",
          text: "更改內容不可為空",
          icon: "error",
        });
      } else if (
        info_id != info_id.replace(this.reMt, "") ||
        provider_id != provider_id.replace(this.reMt, "")
      ) {
        this.$swal({
          title: "修改失敗！",
          text: "更改內容不可含特殊符號",
          icon: "error",
        });
      } else {
        var api = this.api;
        this.$swal({
          title: "是否確定要修改",
          showDenyButton: true,
          confirmButtonText: "確定",
          denyButtonText: "取消",
          icon: "warning",
        }).then((res) => {
          if (res.isConfirmed) {
            this.loading = true;
            axios
              .post(`${api}/game/u`, {
                api_token: VueCookies.get("token"),
                id: sessionStorage.getItem("id"),
                update_id: data.item.id,
                gid: data.item.gid,
                info_id: data.item.info_id,
                provider_id: data.item.provider_id,
                status: data.item.status,
              })
              .then((res) => {
                this.loading = false;
                console.log(res);
                if (res.data.status == 200) {
                  this.target_array.forEach((item, index) => {
                    if (
                      item == "info" ||
                      item == "provider" ||
                      item == "status" ||
                      item == "updbtn"
                    ) {
                      document.getElementById(
                        `${item}_${data.item.id}`
                      ).style.display = "block";
                    } else {
                      document.getElementById(
                        `${item}_${data.item.id}`
                      ).style.display = "none";
                    }
                  });
                  this.$swal({
                    title: "更新成功",
                    icon: "success",
                    timer: 3000,
                    confirmButtonText: "確定",
                  });
                } else {
                  this.$swal({
                    title: "更新失敗",
                    icon: "error",
                    confirmButtonText: "確定",
                  });
                }
              });
          } else if (res.isDenied) {
          }
        });
      }
    },
    async cancel(data) {
      await axios
        .post(`${this.api}/game`, {
          api_token: VueCookies.get("token"),
          id: sessionStorage.getItem("id"),
        })
        .then(async (res) => {
          console.log(res);
          this.loading = false;
          this.game = res.data.result.game;
        });
      this.target_array.forEach((item, index) => {
        if (
          item == "info" ||
          item == "provider" ||
          item == "status" ||
          item == "updbtn"
        ) {
          document.getElementById(`${item}_${data.item.id}`).style.display =
            "block";
        } else {
          document.getElementById(`${item}_${data.item.id}`).style.display =
            "none";
        }
      });
    },
    create() {
      var gid = this.createdata.gid;
      var info_id = this.createdata.info_id;
      var provider_id = this.createdata.provider_id;
      console.log(gid);
      console.log(info_id);
      console.log(provider_id);
      if (gid == "" || info_id == "" || provider_id == "") {
        this.$swal({
          title: "新增失敗！",
          text: "新增內容不可為空",
          icon: "error",
        });
      } else if (
        gid != gid.replace(this.reMt, "") ||
        info_id != info_id.replace(this.reMt, "") ||
        provider_id != provider_id.replace(this.reMt, "")
      ) {
        this.$swal({
          title: "新增失敗！",
          text: "新增內容不可含特殊符號",
          icon: "error",
        });
      } else {
        this.$root.$emit("bv::hide::modal", "create");
        this.loading = true;
        axios
          .post(`${this.api}/game/c`, {
            api_token: VueCookies.get("token"),
            id: sessionStorage.getItem("id"),
            gid: this.createdata.gid,
            info_id: this.createdata.info_id,
            provider_id: this.createdata.provider_id,
            status: this.createdata.status,
          })
          .then((res) => {
            this.loading = false;
            console.log(res);
            if (res.data.status == 200) {
              this.$swal({
                title: "新增成功！",
                icon: "success",
              });
              axios
                .post(`${this.api}/game`, {
                  api_token: VueCookies.get("token"),
                  id: sessionStorage.getItem("id"),
                })
                .then(async (res) => {
                  console.log(res);
                  this.loading = false;
                  this.game = res.data.result.game;
                });
            } else {
              this.$swal({
                title: "新增失敗！",
                icon: "error",
              });
            }
          });
      }
    },
    opensidebar() {
      var sidebar = document.getElementById("side");
      var con = document.getElementById("cont");
      if (sidebar.style.marginLeft == "-14rem") {
        sidebar.style.marginLeft = "0rem";
        con.style.width = "calc(100% - 218px)";
        con.style.margin = "0 auto";
      } else {
        sidebar.style.marginLeft = "-14rem";
        con.style.width = "90%";
        con.style.margin = "0 auto";
      }
    },
  },
};
</script>
