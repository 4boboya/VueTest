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
        <b-input-group prepend="名稱" style="margin-top: 15px" size="sm">
          <b-form-input
            v-model="filter"
            id="filter-input"
            type="search"
            placeholder="Search"
          />
          <b-button v-b-modal.create size="sm" variant="primary">
            新增
          </b-button>
          <b-modal id="create" centered title="新增遊戲資訊">
            <form style="font-size: 14px">
              <b-form-group label="名稱(繁中)" size="sm">
                <b-form-input
                  v-model="createdata.name"
                  placeholder="限輸入中英數"
                />
              </b-form-group>
              <b-form-group label="名稱(簡中)" size="sm">
                <b-form-input
                  v-model="createdata.name_cn"
                  placeholder="限輸入中英數"
                />
              </b-form-group>
              <b-form-group label="名稱(英文)" size="sm">
                <b-form-input
                  v-model="createdata.name_en"
                  placeholder="限輸入英數"
                />
              </b-form-group>
              <b-form-group label="名稱(日文)" size="sm">
                <b-form-input
                  v-model="createdata.name_jp"
                  placeholder="限輸入日英數"
                />
              </b-form-group>
              <b-form-group label="Server位置" size="sm">
                <b-form-input v-model="createdata.server_host" />
              </b-form-group>
              <b-form-group label="Server路徑" size="sm">
                <b-form-input v-model="createdata.server_path" />
              </b-form-group>
              <b-form-group label="Port" size="sm">
                <b-form-input v-model="createdata.server_port" />
              </b-form-group>
              <b-form-group label="測試Port" size="sm">
                <b-form-input v-model="createdata.server_demo_port" />
              </b-form-group>
              <b-form-group label="前端放置目錄" size="sm">
                <b-form-input v-model="createdata.client_dir_name" />
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
          :filter-included-fields="['name']"
          class="my-3"
          responsive
          striped
          hover
        >
          <template #cell(name)="data">
            <b-input-group size="sm">
              <b-form-input
                type="text"
                v-model="data.item.name"
                :id="`inputname_${data.item.info_id}`"
                placeholder="限輸入中英數"
                style="display: none"
              />
              <b-form-text
                style="display: block"
                :id="`name_${data.item.info_id}`"
              >
                {{ data.item.name }}
              </b-form-text>
            </b-input-group>
          </template>
          <template #cell(name_cn)="data">
            <b-input-group size="sm">
              <b-form-input
                type="text"
                v-model="data.item.name_cn"
                :id="`inputname_cn_${data.item.info_id}`"
                placeholder="限輸入中英數"
                style="display: none"
              />
              <b-form-text
                style="display: block"
                :id="`name_cn_${data.item.info_id}`"
              >
                {{ data.item.name_cn }}
              </b-form-text>
            </b-input-group>
          </template>
          <template #cell(name_en)="data">
            <b-input-group size="sm">
              <b-form-input
                type="text"
                v-model="data.item.name_en"
                :id="`inputname_en_${data.item.info_id}`"
                placeholder="限輸入英數"
                style="display: none"
              />
              <b-form-text
                style="display: block"
                :id="`name_en_${data.item.info_id}`"
              >
                {{ data.item.name_en }}
              </b-form-text>
            </b-input-group>
          </template>
          <template #cell(name_jp)="data">
            <b-input-group size="sm">
              <b-form-input
                type="text"
                v-model="data.item.name_jp"
                :id="`inputname_jp_${data.item.info_id}`"
                placeholder="限輸入日英數"
                style="display: none"
              />
              <b-form-text
                style="display: block"
                :id="`name_jp_${data.item.info_id}`"
              >
                {{ data.item.name_jp }}
              </b-form-text>
            </b-input-group>
          </template>
          <template #cell(more)="row">
            <b-button
              style="width: 75px"
              size="sm"
              :disabled="chmod"
              @click="row.toggleDetails"
            >
              詳細資料
            </b-button>
          </template>
          <template #row-details="row">
            <b-card>
              <b-row class="mb-2">
                <b-col sm="3" class="text-sm-right">Server位置</b-col>
                <b-col>
                  <b-input-group size="sm">
                    <b-form-input
                      v-model="row.item.server_host"
                      :id="`inputserver_host_${row.item.info_id}`"
                      style="display: none"
                      >{{ row.item.server_host }}</b-form-input
                    >
                    <b-form-text
                      style="display: block"
                      :id="`server_host_${row.item.info_id}`"
                    >
                      {{ row.item.server_host }}
                    </b-form-text>
                  </b-input-group>
                </b-col>
              </b-row>
              <b-row class="mb-2">
                <b-col sm="3" class="text-sm-right">Server路徑</b-col>
                <b-col>
                  <b-input-group size="sm">
                    <b-form-input
                      v-model="row.item.server_path"
                      :id="`inputserver_path_${row.item.info_id}`"
                      style="display: none"
                      >{{ row.item.server_path }}</b-form-input
                    >
                    <b-form-text
                      style="display: block"
                      :id="`server_path_${row.item.info_id}`"
                    >
                      {{ row.item.server_path }}
                    </b-form-text>
                  </b-input-group>
                </b-col>
              </b-row>
              <b-row class="mb-2">
                <b-col sm="3" class="text-sm-right">Port</b-col>
                <b-col>
                  <b-input-group size="sm">
                    <b-form-input
                      v-model="row.item.server_port"
                      :id="`inputserver_port_${row.item.info_id}`"
                      style="display: none"
                      >{{ row.item.server_port }}</b-form-input
                    >
                    <b-form-text
                      style="display: block"
                      :id="`server_port_${row.item.info_id}`"
                    >
                      {{ row.item.server_port }}
                    </b-form-text>
                  </b-input-group>
                </b-col>
              </b-row>
              <b-row class="mb-2">
                <b-col sm="3" class="text-sm-right">測試Port</b-col>
                <b-col>
                  <b-input-group size="sm">
                    <b-form-input
                      v-model="row.item.server_demo_port"
                      :id="`inputserver_demo_port_${row.item.info_id}`"
                      style="display: none"
                      >{{ row.item.server_demo_port }}</b-form-input
                    >
                    <b-form-text
                      style="display: block"
                      :id="`server_demo_port_${row.item.info_id}`"
                    >
                      {{ row.item.server_demo_port }}
                    </b-form-text>
                  </b-input-group>
                </b-col>
              </b-row>
              <b-row class="mb-2">
                <b-col sm="3" class="text-sm-right">前端放置目錄</b-col>
                <b-col>
                  <b-input-group size="sm">
                    <b-form-input
                      v-model="row.item.client_dir_name"
                      :id="`inputclient_dir_name_${row.item.info_id}`"
                      style="display: none"
                      >{{ row.item.client_dir_name }}</b-form-input
                    >
                    <b-form-text
                      style="display: block"
                      :id="`client_dir_name_${row.item.info_id}`"
                    >
                      {{ row.item.client_dir_name }}
                    </b-form-text>
                  </b-input-group>
                </b-col>
              </b-row>
              <b-button
                size="sm"
                style="width: 60px; display: block"
                :id="`updbtn_${row.item.info_id}`"
                :disabled="chmod"
                @click="update(row.item.info_id)"
              >
                修改
              </b-button>
              <b-button
                size="sm"
                style="width: 60px; display: none"
                variant="success"
                :id="`subbtn_${row.item.info_id}`"
                @click="submit(row)"
              >
                送出
              </b-button>
              <b-button
                size="sm"
                style="width: 60px; display: none; margin-top: 5px"
                variant="danger"
                :id="`cancel_${row.item.info_id}`"
                @click="cancel(row)"
              >
                取消
              </b-button>
            </b-card>
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
  margin: 0 0 -247px;
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
      chmod: true,
      filter: null,
      createdata: [
        {
          name: null,
          name_cn: null,
          name_en: null,
          name_jp: null,
          server_host: null,
          server_path: null,
          server_port: null,
          server_demo_port: null,
          client_dir_name: null,
        },
      ],
      game: [],
      fields: [
        {
          key: "info_id",
          label: "遊戲資訊ID",
          thStyle: "min-width:85px",
        },
        {
          key: "name",
          label: "名稱(繁中)",
          thStyle: "min-width:130px",
          sortable: true,
        },
        {
          key: "name_cn",
          label: "名稱(簡中)",
          thStyle: "min-width:130px",
          sortable: true,
        },
        {
          key: "name_en",
          label: "名稱(英文)",
          thStyle: "min-width:130px",
          sortable: true,
        },
        {
          key: "name_jp",
          label: "名稱(日文)",
          thStyle: "min-width:130px",
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
          label: "創建時間",
          thStyle: "min-width:106px",
          sortable: true,
        },
        {
          key: "more",
          label: "詳細資料",
        },
      ],
      target_array :[
                    "name",
                    "name_cn",
                    "name_en",
                    "name_jp",
                    "server_host",
                    "server_path",
                    "server_port",
                    "server_demo_port",
                    "client_dir_name",
                    "inputname",
                    "inputname_cn",
                    "inputname_en",
                    "inputname_jp",
                    "inputserver_host",
                    "inputserver_path",
                    "inputserver_port",
                    "inputserver_demo_port",
                    "inputclient_dir_name",
                    "subbtn",
                    "updbtn",
                    "cancel",
                  ]
    };
  },
  created: async function () {
    this.createdata.name = "";
    this.createdata.name_cn = "";
    this.createdata.name_en = "";
    this.createdata.name_jp = "";
    this.createdata.server_host = "";
    this.createdata.server_path = "";
    this.createdata.server_port = "";
    this.createdata.server_demo_port = "";
    this.createdata.client_dir_name = "";
    this.loading = await true;
    await axios
      .post(`${this.api}/gameinfo`, {
        api_token: VueCookies.get("token"),
        id: sessionStorage.getItem("id"),
      })
      .then((res) => {
        this.loading = false;
        this.game = res.data.result.game_info;
        console.log(this.game);
      });
    if (this.game.length != 0) {
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
          item == "name" ||
          item == "name_cn" ||
          item == "name_en" ||
          item == "name_jp" ||
          item == "server_host" ||
          item == "server_path" ||
          item == "server_port" ||
          item == "server_demo_port" ||
          item == "client_dir_name" ||
          item == "updbtn"
        ) {
          document.getElementById(`${item}_${id}`).style.display = "none";
        } else {
          document.getElementById(`${item}_${id}`).style.display = "block";
        }
      });
    },
    submit(data) {
      var name = String(data.item.name);
      var name_cn = String(data.item.name_cn);
      var name_en = String(data.item.name_en);
      var name_jp = String(data.item.name_jp);
      var server_demo_port = String(data.item.server_demo_port);
      var server_host = String(data.item.server_host);
      var server_path = String(data.item.server_path);
      var server_port = String(data.item.server_port);
      var client_dir_name = String(data.item.client_dir_name);
      if (
        name == "" ||
        name_cn == "" ||
        name_en == "" ||
        name_jp == "" ||
        server_demo_port == "" ||
        server_host == "" ||
        server_path == "" ||
        server_port == "" ||
        client_dir_name == ""
      ) {
        this.$swal({
          title: "修改失敗！",
          text: "更改內容不可為空",
          icon: "error",
        });
      } else if (
        name != name.replace(this.reCn, "") ||
        name_cn != name_cn.replace(this.reCn, "") ||
        name_en != name_en.replace(this.reEn, "") ||
        name_jp != name_jp.replace(this.reJp, "") ||
        server_host != server_host.replace(this.reHs, "") ||
        server_path != server_path.replace(this.reHs, "") ||
        server_port != server_port.replace(this.reMt, "") ||
        server_demo_port != server_demo_port.replace(this.reMt, "") ||
        client_dir_name != client_dir_name.replace(this.reEn, "")
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
              .post(`${api}/gameinfo/u`, {
                api_token: VueCookies.get("token"),
                id: sessionStorage.getItem("id"),
                info_id: data.item.info_id,
                name: data.item.name,
                name_cn: data.item.name_cn,
                name_en: data.item.name_en,
                name_jp: data.item.name_jp,
                server_host: data.item.server_host,
                server_path: data.item.server_path,
                server_port: data.item.server_port,
                server_demo_port: data.item.server_demo_port,
                client_dir_name: data.item.client_dir_name,
              })
              .then((res) => {
                this.loading = false;
                console.log(res);
                if (res.data.status == 200) {
                  this.target_array.forEach((item, index) => {
                    if (
                      item == "name" ||
                      item == "name_cn" ||
                      item == "name_en" ||
                      item == "name_jp" ||
                      item == "server_host" ||
                      item == "server_path" ||
                      item == "server_port" ||
                      item == "server_demo_port" ||
                      item == "client_dir_name" ||
                      item == "updbtn"
                    ) {
                      document.getElementById(
                        `${item}_${data.item.info_id}`
                      ).style.display = "block";
                    } else {
                      document.getElementById(
                        `${item}_${data.item.info_id}`
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
    cancel(data) {
      axios
        .post(`${this.api}/gameinfo`, {
          api_token: VueCookies.get("token"),
          id: sessionStorage.getItem("id"),
        })
        .then((res) => {
          console.log(res);
          this.loading = false;
          this.game = res.data.result.game_info;
        });
      this.target_array.forEach((item, index) => {
        console.log(`${item}_${data.item.info_id}`)
        if (
          item == "name" ||
          item == "name_cn" ||
          item == "name_en" ||
          item == "name_jp" ||
          item == "server_host" ||
          item == "server_path" ||
          item == "server_port" ||
          item == "server_demo_port" ||
          item == "client_dir_name" ||
          item == "updbtn"
        ) {
          document.getElementById(
            `${item}_${data.item.info_id}`
          ).style.display = "block";
        } else {
          document.getElementById(
            `${item}_${data.item.info_id}`
          ).style.display = "none";
        }
      });
    },
    create() {
      var name = String(this.createdata.name);
      var name_cn = String(this.createdata.name_cn);
      var name_en = String(this.createdata.name_en);
      var name_jp = String(this.createdata.name_jp);
      var server_demo_port = String(this.createdata.server_demo_port);
      var server_host = String(this.createdata.server_host);
      var server_path = String(this.createdata.server_path);
      var server_port = String(this.createdata.server_port);
      var client_dir_name = String(this.createdata.client_dir_name);
      if (
        name == "" ||
        name_cn == "" ||
        name_en == "" ||
        name_jp == "" ||
        server_demo_port == "" ||
        server_host == "" ||
        server_path == "" ||
        server_port == "" ||
        client_dir_name == ""
      ) {
        this.$swal({
          title: "新增失敗！",
          text: "新增內容不可為空",
          icon: "error",
        });
      } else if (
        name != name.replace(this.reCn, "") ||
        name_cn != name_cn.replace(this.reCn, "") ||
        name_en != name_en.replace(this.reEn, "") ||
        name_jp != name_jp.replace(this.reJp, "") ||
        server_host != server_host.replace(this.reHs, "") ||
        server_path != server_path.replace(this.reHs, "") ||
        server_port != server_port.replace(this.reMt, "") ||
        server_demo_port != server_demo_port.replace(this.reMt, "") ||
        client_dir_name != client_dir_name.replace(this.reEn, "")
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
          .post(`${this.api}/gameinfo/c`, {
            api_token: VueCookies.get("token"),
            id: sessionStorage.getItem("id"),
            info_id: this.createdata.info_id,
            name: this.createdata.name,
            name_cn: this.createdata.name_cn,
            name_en: this.createdata.name_en,
            name_jp: this.createdata.name_jp,
            server_host: this.createdata.server_host,
            server_path: this.createdata.server_path,
            server_port: this.createdata.server_port,
            server_demo_port: this.createdata.server_demo_port,
            client_dir_name: this.createdata.client_dir_name,
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
                .post(`${this.api}/gameinfo`, {
                  api_token: VueCookies.get("token"),
                  id: sessionStorage.getItem("id"),
                })
                .then(async (res) => {
                  console.log(res);
                  this.loading = false;
                  this.game = res.data.result.game_info;
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