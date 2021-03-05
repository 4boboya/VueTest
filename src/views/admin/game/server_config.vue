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
        </b-input-group>
        <b-table
          style="font-size: 10px"
          :items="server"
          :fields="fields"
          :filter="filter"
          :filter-included-fields="['name']"
          class="my-3"
          responsive
          hover
        >
          <template #cell(name)="data">
            <b-input-group size="sm">
              <b-form-input
                type="text"
                v-model="data.item.name"
                :id="`inputname_${data.item.gid}`"
                style="display: none"
              />
              <b-form-text style="display: block" :id="`name_${data.item.gid}`">
                {{ data.item.name }}
              </b-form-text>
            </b-input-group>
          </template>
          <template #cell(profile)="data">
            <b-input-group size="sm">
              <b-form-input
                type="text"
                v-model="data.item.profile"
                :id="`inputprofile_${data.item.gid}`"
                style="display: none"
              />
              <b-form-text
                style="display: block"
                :id="`profile_${data.item.gid}`"
              >
                {{ data.item.profile }}
              </b-form-text>
            </b-input-group>
          </template>
          <template #cell(value)="data">
            <b-input-group size="sm">
              <b-form-input
                type="text"
                v-model="data.item.value"
                :id="`inputvalue_${data.item.gid}`"
                style="display: none"
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
            <b-button
              size="sm"
              style="width: 60px; display: none"
              variant="success "
              :id="`subbtn_${data.item.gid}`"
              @click="submit(data)"
            >
              送出
            </b-button>
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
          </template>
          <!-- <template #cell(delete)>
          <b-button> 刪除 </b-button>
        </template> -->
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
      chmod: true,
      filter: null,
      server: [],
      fields: [
        {
          key: "gid",
          label: "Gid",
        },
        {
          key: "name",
          label: "名稱",
          sortable: true,
        },
        {
          key: "profile",
          label: "Profile",
        },
        {
          key: "value",
          label: "Value",
        },
        {
          key: "updated_at",
          label: "更新時間",
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
        "inputprofile",
        "inputvalue",
        "name",
        "profile",
        "value",
        "subbtn",
        "updbtn",
        "cancel",
      ],
    };
  },
  created: async function () {
    this.loading = await true;
    await axios
      .post(`${this.api}/serverconfig`, {
        api_token: VueCookies.get("token"),
        id: sessionStorage.getItem("id"),
      })
      .then((res) => {
        this.loading = false;
        this.server = res.data.result.server_config;
      });
    if (this.server.length != 0) {
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
    update(gid) {
      this.target_array.forEach((item, index) => {
        if (
          item == "name" ||
          item == "profile" ||
          item == "value" ||
          item == "updbtn"
        ) {
          document.getElementById(`${item}_${gid}`).style.display = "none";
        } else {
          document.getElementById(`${item}_${gid}`).style.display = "block";
        }
      });
    },
    submit(data) {
      var name = String(data.item.name);
      var profile = String(data.item.profile);
      var value = String(data.item.value);
      if (name == "" || profile == "" || value == "") {
        this.$swal({
          title: "修改失敗！",
          text: "更改內容不可為空",
          icon: "error",
        });
      } else if (
        name != name.replace(this.reCn, "") ||
        profile != profile.replace(this.reEn, "") ||
        value != value.replace(this.reEn, "")
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
              .post(`${api}/serverconfig/u`, {
                api_token: VueCookies.get("token"),
                id: sessionStorage.getItem("id"),
                gid: data.item.gid,
                name: data.item.name,
                profile: data.item.profile,
                value: data.item.value,
              })
              .then((res) => {
                this.loading = false;
                if (res.data.status == 200) {
                  this.target_array.forEach((item, index) => {
                    if (
                      item == "name" ||
                      item == "profile" ||
                      item == "value" ||
                      item == "updbtn"
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
                console.log(res);
              });
          } else if (res.isDenied) {
          }
        });
      }
    },
    async cancel(data) {
      await axios
        .post(`${this.api}/serverconfig`, {
          api_token: VueCookies.get("token"),
          id: sessionStorage.getItem("id"),
        })
        .then((res) => {
          this.loading = false;
          this.server = res.data.result.server_config;
        });
      this.target_array.forEach((item, index) => {
        if (
          item == "name" ||
          item == "profile" ||
          item == "value" ||
          item == "updbtn"
        ) {
          document.getElementById(`${item}_${data.item.gid}`).style.display =
            "block";
        } else {
          document.getElementById(`${item}_${data.item.gid}`).style.display =
            "none";
        }
      });
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