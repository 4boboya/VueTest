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
        <div class="row">
          <b-input-group
            class="col-sm"
            prepend="名稱"
            style="margin: 15px auto"
            size="sm"
          >
            <b-form-input
              v-model="filterforname"
              id="filter-input"
              type="search"
              placeholder="Search"
            />
          </b-input-group>
          <b-input-group
            class="col-sm"
            prepend="狀態"
            style="margin: 15px auto"
            size="sm"
          >
            <b-form-select v-model="filterforenabled" :options="searchenabled" />
          </b-input-group>
          <b-input-group
            class="col-sm"
            style="margin: 15px auto"
            text-right
          >
            <b-button v-b-modal.create size="sm" variant="primary" style="margin-left:75%"> 
              新增
            </b-button>
            <b-modal id="create" centered title="新增代理商">
              <form style="font-size: 14px">
                <b-form-group label="名稱" size="sm">
                  <b-form-input v-model="createdata.name" />
                </b-form-group>
                <b-form-group label="遊戲網址" size="sm">
                  <b-form-input v-model="createdata.game_url" />
                </b-form-group>
                <b-form-group label="使用者名稱：" size="sm">
                  <b-form-input v-model="createdata.username" />
                </b-form-group>
                <b-form-group label="Private_key" size="sm">
                  <b-form-input v-model="createdata.private_key" />
                </b-form-group>
                <b-form-group label="狀態" size="sm">
                  <b-form-select
                    :options="enabled"
                    v-model="createdata.enabled"
                  />
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
        </div>

        <b-table
          style="font-size: 10px; margin: auto"
          :items="provider"
          :fields="fields"
          :filter="filterforenabled"
          :filter-included-fields="['enabled']"
          class="my-3"
          responsive
          striped
          hover
        >
          <template #cell(name)="data">
            <b-input-group size="sm">
              <b-form-input
                style="display: none"
                type="text"
                v-model="data.item.name"
                :id="`inputname_${data.item.id}`"
              />
              <b-form-text style="display: block" :id="`name_${data.item.id}`">
                {{ data.item.name }}
              </b-form-text>
            </b-input-group>
          </template>
          <template #cell(game_url)="data">
            <b-input-group size="sm">
              <b-form-input
                style="display: none"
                type="text"
                v-model="data.item.game_url"
                :id="`inputgame_url_${data.item.id}`"
              />
              <b-form-text
                style="display: block"
                :id="`game_url_${data.item.id}`"
              >
                {{ data.item.game_url }}
              </b-form-text>
            </b-input-group>
          </template>
          <template #cell(username)="data">
            <b-input-group size="sm">
              <b-form-input
                style="display: none"
                type="text"
                v-model="data.item.username"
                :id="`inputusername_${data.item.id}`"
              />
              <b-form-text
                style="display: block"
                :id="`username_${data.item.id}`"
              >
                {{ data.item.username }}
              </b-form-text>
            </b-input-group>
          </template>
          <template #cell(private_key)="data">
            <b-input-group size="sm">
              <b-form-input
                style="display: none"
                type="text"
                v-model="data.item.private_key"
                :id="`inputprivate_key_${data.item.id}`"
              />
              <b-form-text
                style="display: block"
                :id="`private_key_${data.item.id}`"
              >
                {{ data.item.private_key }}
              </b-form-text>
            </b-input-group>
          </template>
          <template #cell(enabled)="data">
            <b-input-group size="sm">
              <b-form-select
                style="display: none"
                v-model="data.item.enabled"
                :options="searchenabled"
                :id="`inputenabled_${data.item.id}`"
              />
              <b-form-text
                :style="`display: block;color:${
                  data.item.enabled == 1 ? '#00BB00' : '#FF0000'
                }!important`"
                :id="`enabled_${data.item.id}`"
              >
                {{ data.item.enabled == 1 ? "啟用" : "停用" }}
              </b-form-text>
            </b-input-group>
          </template>
          <template #cell(updata)="data">
            <b-button
              size="sm"
              style="width: 60px; display: none"
              variant="success "
              :id="`subbtn_${data.item.id}`"
              @click="submit(data)"
              >送出</b-button
            >
            <b-button
              size="sm"
              style="width: 60px; display: none; margin-top: 5px"
              variant="danger "
              :id="`cancel_${data.item.id}`"
              @click="cancel(data)"
            >
              取消
            </b-button>
            <b-button
              style="width: 60px; display: block"
              :id="`updbtn_${data.item.id}`"
              size="sm"
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
      filterforname: null,
      filterforenabled: null,
      chmod: true,
      searchenabled: [
        { text: "停用", value: "0" },
        { text: "啟用", value: "1" },
        { text: "", value: null },
      ],
      createdata: [
        {
          name: null,
          game_url: null,
          username: null,
          private_key: null,
          enabled: null,
        },
      ],
      enabled: [
        { text: "停用", value: 0 },
        { text: "啟用", value: 1 },
      ],
      provider: [],
      fields: [
        {
          key: "name",
          label: "名稱",
          thStyle: "min-width:100px",
          sortable: true,
        },
        {
          key: "game_url",
          label: "遊戲網址",
          thStyle: "min-width:100px",
        },
        {
          key: "username",
          label: "使用者名稱",
          thStyle: "min-width:100px",
        },
        {
          key: "private_key",
          label: "private_key",
          thStyle: "min-width:100px",
          sortable: true,
        },
        {
          key: "enabled",
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
          label: "創建時間",
          thStyle: "min-width:106px",
          sortable: true,
        },
        {
          key: "updata",
          label: "修改",
        },
      ],
      target_array: [
        "inputname",
        "inputgame_url",
        "inputusername",
        "inputprivate_key",
        "inputenabled",
        "name",
        "game_url",
        "username",
        "private_key",
        "enabled",
        "subbtn",
        "updbtn",
        "cancel",
      ],
    };
  },
  created: async function () {
    this.createdata.name = "";
    this.createdata.game_url = "";
    this.createdata.username = "";
    this.createdata.private_key = "";
    this.createdata.enabled = 1;
    this.loading = await true;
    await axios
      .post(`${this.api}/provider`, {
        api_token: VueCookies.get("token"),
        id: sessionStorage.getItem("id"),
      })
      .then(async (res) => {
        this.loading = false;
        this.provider = res.data.result.provider;
      });
    if (this.provider.length != 0) {
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
          item == "updbtn" ||
          item == "name" ||
          item == "game_url" ||
          item == "private_key" ||
          item == "username" ||
          item == "enabled"
        ) {
          document.getElementById(`${item}_${id}`).style.display = "none";
        } else {
          document.getElementById(`${item}_${id}`).style.display = "block";
        }
      });
    },
    submit(data) {
      console.log(data);
      var name = String(data.item.name);
      var game_url = String(data.item.game_url);
      var username = String(data.item.username);
      var private_key = String(data.item.private_key);
      if (game_url == "" || name == "" || username == "" || private_key == "") {
        this.$swal({
          title: "修改失敗！",
          text: "更改內容不可為空",
          icon: "error",
        });
      } else if (
        game_url != game_url.replace(this.reHs, "") ||
        name != name.replace(this.reCn, "") ||
        username != username.replace(this.reCn, "") ||
        private_key != private_key.replace(this.reEn, "")
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
              .post(`${api}/provider/u`, {
                api_token: VueCookies.get("token"),
                id: sessionStorage.getItem("id"),
                update_id: data.item.id,
                name: data.item.name,
                game_url: data.item.game_url,
                username: data.item.username,
                private_key: data.item.private_key,
                enabled: data.item.enabled,
              })
              .then((res) => {
                this.loading = false;
                console.log(res);
                if (res.data.status == 200) {
                  this.target_array.forEach((item, index) => {
                    if (
                      item == "updbtn" ||
                      item == "name" ||
                      item == "game_url" ||
                      item == "private_key" ||
                      item == "username" ||
                      item == "enabled"
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
        .post(`${this.api}/provider`, {
          api_token: VueCookies.get("token"),
          id: sessionStorage.getItem("id"),
        })
        .then(async (res) => {
          console.log(res);
          this.loading = false;
          this.provider = res.data.result.provider;
        });
      this.target_array.forEach((item, index) => {
        if (
          item == "updbtn" ||
          item == "name" ||
          item == "game_url" ||
          item == "private_key" ||
          item == "username" ||
          item == "enabled"
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
      var name = this.createdata.name;
      var game_url = this.createdata.game_url;
      var username = this.createdata.username;
      var private_key = this.createdata.private_key;
      var enabled = this.createdata.enabled;
      console.log(name);
      console.log(game_url);
      console.log(username);
      console.log(private_key);
      console.log(enabled);
      if (name == "" || game_url == "" || username == "" || private_key == "") {
        this.$swal({
          title: "新增失敗！",
          text: "新增內容不可為空",
          icon: "error",
        });
      } else if (
        name != name.replace(this.reCn, "") ||
        game_url != game_url.replace(this.reHs, "") ||
        username != username.replace(this.reCn, "") ||
        private_key != private_key.replace(this.reEn, "")
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
          .post(`${this.api}/provider/c`, {
            api_token: VueCookies.get("token"),
            id: sessionStorage.getItem("id"),
            name: this.createdata.name,
            game_url: this.createdata.game_url,
            username: this.createdata.username,
            private_key: this.createdata.private_key,
            enabled: this.createdata.enabled,
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
                .post(`${this.api}/provider`, {
                  api_token: VueCookies.get("token"),
                  id: sessionStorage.getItem("id"),
                })
                .then(async (res) => {
                  console.log(res);
                  this.loading = false;
                  this.provider = res.data.result.provider;
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