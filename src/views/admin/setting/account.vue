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
          <b-modal id="create" centered title="新增帳戶">
            <form style="font-size: 14px">
              <b-form-group label="遊戲ID" size="sm">
                <b-form-input v-model="createdata.gid" />
              </b-form-group>
              <b-form-group label="名稱" size="sm">
                <b-form-input v-model="createdata.name" />
              </b-form-group>
              <b-form-group label="Profile" size="sm">
                <b-form-input v-model="createdata.profile" />
              </b-form-group>
              <b-form-group label="Token" size="sm">
                <b-form-input v-model="createdata.token" />
              </b-form-group>
              <b-form-group label="Value" size="sm">
                <b-form-input v-model="createdata.value" />
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
          :items="player"
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
                style="display: none"
                type="text"
                v-model="data.item.name"
                :id="`inputname_${data.item.gid}`"
              />
              <b-form-text style="display: block" :id="`name_${data.item.gid}`">
                {{ data.item.name }}
              </b-form-text>
            </b-input-group>
          </template>
          <template #cell(profile)="data">
            <b-input-group size="sm">
              <b-form-input
                style="display: none"
                type="text"
                v-model="data.item.profile"
                :id="`inputprofile_${data.item.gid}`"
              />
              <b-form-text
                style="display: block"
                :id="`profile_${data.item.gid}`"
              >
                {{ data.item.profile }}
              </b-form-text>
            </b-input-group>
          </template>
          <template #cell(token)="data">
            <b-input-group size="sm">
              <b-form-input
                style="display: none"
                type="text"
                v-model="data.item.token"
                :id="`inputtoken_${data.item.gid}`"
              />
              <b-form-text
                style="display: block"
                :id="`token_${data.item.gid}`"
              >
                {{ data.item.token }}
              </b-form-text>
            </b-input-group>
          </template>
          <template #cell(value)="data">
            <b-input-group size="sm">
              <b-form-input
                style="display: none"
                type="text"
                v-model="data.item.value"
                :id="`inputvalue_${data.item.gid}`"
              />
              <b-form-text
                style="display: block"
                :id="`value_${data.item.gid}`"
              >
                {{ data.item.value }}
              </b-form-text>
            </b-input-group>
          </template>
          <template #cell(updata)="data">
            <span v-b-tooltip.top title="權限不足">
              <b-button
                size="sm"
                style="width: 60px; display: none"
                variant="success "
                :id="`subbtn_${data.item.gid}`"
                @click="submit(data)"
                >送出</b-button
              >
              <b-button
                size="sm"
                style="width: 60px; display: none; margin-top: 5px"
                variant="danger "
                :id="`cancel_${data.item.gid}`"
                @click="cancel(data)"
              >
                取消
              </b-button>
              <b-button
                size="sm"
                style="width: 60px; display: block"
                :id="`updbtn_${data.item.gid}`"
                :disabled="chmod"
                @click="update(data.item.gid)"
              >
                修改
              </b-button>
            </span>
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
import { blocks } from "js-md5";

export default {
  data() {
    return {
      loading: false,
      filter: null,
      chmod: true,
      createdata: [
        {
          gid: null,
          name: null,
          profile: null,
          token: null,
          value: null,
        },
      ],
      player: [],
      fields: [
        {
          key: "gid",
          label: "遊戲ID",
          thStyle: "min-width:61px",
        },
        {
          key: "name",
          label: "Name",
          thStyle: "min-width:100px",
          sortable: true,
        },
        {
          key: "profile",
          label: "Profile",
          thStyle: "min-width:100px",
        },
        {
          key: "token",
          label: "Token",
          thStyle: "min-width:100px",
        },
        {
          key: "value",
          label: "Value",
          thStyle: "min-width:100px",
          sortable: true,
        },
        {
          key: "updata",
          label: "修改",
        },
      ],
      target_array: [
        "inputvalue",
        "inputname",
        "inputprofile",
        "inputtoken",
        "value",
        "name",
        "profile",
        "token",
        "subbtn",
        "updbtn",
        "cancel",
      ],
    };
  },
  created: async function () {
    this.createdata.name = "";
    this.createdata.profile = "";
    this.createdata.token = "";
    this.createdata.value = "";
    this.createdata.gid = "";
    this.loading = await true;
    await axios
      .post(`${this.api}/playersave`, {
        api_token: VueCookies.get("token"),
        id: sessionStorage.getItem("id"),
      })
      .then(async (res) => {
        console.log(res);
        this.loading = false;
        this.player = res.data.result.player_save;
      });
    if (this.player.length != 0) {
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
          item == "value" ||
          item == "profile" ||
          item == "token"
        ) {
          document.getElementById(`${item}_${id}`).style.display = "none";
        } else {
          document.getElementById(`${item}_${id}`).style.display = "block";
        }
      });
    },
    submit(data) {
      console.log(data);
      var value = String(data.item.value);
      var name = String(data.item.name);
      var profile = String(data.item.profile);
      var token = String(data.item.token);
      if (value == "" || name == "" || profile == "" || token == "") {
        this.$swal({
          title: "修改失敗！",
          text: "更改內容不可為空",
          icon: "error",
        });
      } else if (
        value != value.replace(this.reCn, "") ||
        name != name.replace(this.reCn, "") ||
        profile != profile.replace(this.reCn, "") ||
        token != token.replace(this.reEn, "")
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
              .post(`${api}/playersave/u`, {
                api_token: VueCookies.get("token"),
                id: sessionStorage.getItem("id"),
                gid: data.item.gid,
                token: data.item.token,
                name: data.item.name,
                profile: data.item.profile,
                value: data.item.value,
              })
              .then((res) => {
                this.loading = false;
                console.log(res);
                if (res.data.status == 200) {
                  this.target_array.forEach((item, index) => {
                    if (
                      item == "updbtn" ||
                      item == "name" ||
                      item == "value" ||
                      item == "profile" ||
                      item == "token"
                    ) {
                      document.getElementById(
                        `${item}_${data.item.gid}`
                      ).style.display = "block";
                    } else {
                      document.getElementById(
                        `${item}_${data.item.gid}`
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
        .post(`${this.api}/playersave`, {
          api_token: VueCookies.get("token"),
          id: sessionStorage.getItem("id"),
        })
        .then(async (res) => {
          console.log(res);
          this.loading = false;
          this.player = res.data.result.player_save;
        });
      this.target_array.forEach((item, index) => {
        if (
          item == "updbtn" ||
          item == "name" ||
          item == "value" ||
          item == "profile" ||
          item == "token"
        ) {
          document.getElementById(`${item}_${data.item.gid}`).style.display =
            "block";
        } else {
          document.getElementById(`${item}_${data.item.gid}`).style.display =
            "none";
        }
      });
    },
    create() {
      var name = this.createdata.name;
      var gid = this.createdata.gid;
      var profile = this.createdata.profile;
      var token = this.createdata.token;
      var value = this.createdata.value;
      console.log(name);
      console.log(gid);
      console.log(profile);
      console.log(token);
      console.log(value);
      if (
        name == "" ||
        gid == "" ||
        profile == "" ||
        token == "" ||
        value == ""
      ) {
        this.$swal({
          title: "新增失敗！",
          text: "新增內容不可為空",
          icon: "error",
        });
      } else if (
        name != name.replace(this.reCn, "") ||
        gid != gid.replace(this.reMt, "") ||
        profile != profile.replace(this.reCn, "") ||
        token != token.replace(this.reEn, "") ||
        value != value.replace(this.reCn, "")
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
          .post(`${this.api}/playersave/c`, {
            api_token: VueCookies.get("token"),
            id: sessionStorage.getItem("id"),
            name: this.createdata.name,
            gid: this.createdata.gid,
            profile: this.createdata.profile,
            token: this.createdata.token,
            value: this.createdata.value,
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
                .post(`${this.api}/playersave`, {
                  api_token: VueCookies.get("token"),
                  id: sessionStorage.getItem("id"),
                })
                .then(async (res) => {
                  console.log(res);
                  this.loading = false;
                  this.player = res.data.result.player_save;
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
