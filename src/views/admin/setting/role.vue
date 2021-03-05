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
        <b-input-group prepend="帳號" style="margin-top: 15px" size="sm">
          <b-form-input
            v-model="filter"
            id="filter-input"
            type="search"
            placeholder="Search"
          />
          <b-button v-b-modal.create size="sm" variant="primary">
            新增
          </b-button>
          <b-modal id="create" centered title="新增角色">
            <form style="font-size: 14px">
              <b-form-group label="名稱" size="sm">
                <b-form-input v-model="createdata.name" />
              </b-form-group>
              <b-form-group label="Provider_Id" size="sm">
                <b-form-input
                  v-model="createdata.provider_id"
                  placeholder="限輸入數字"
                />
              </b-form-group>
              <b-form-group label="Uniq_Id" size="sm">
                <b-form-input v-model="createdata.uniq_id" />
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
          id="role_table"
          :items="player"
          :fields="fields"
          :filter="filter"
          :filter-included-fields="['id']"
          :per-page="perPage"
          :current-page="currentPage"
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
          <template #cell(provider_id)="data">
            <b-input-group size="sm">
              <b-form-input
                style="display: none"
                type="text"
                v-model="data.item.provider_id"
                :id="`inputprovider_${data.item.id}`"
                placeholder="限輸入數字"
              />
              <b-form-text
                style="display: block"
                :id="`provider_${data.item.id}`"
              >
                {{ data.item.provider_id }}
              </b-form-text>
            </b-input-group>
          </template>
          <template #cell(uniq_id)="data">
            <b-input-group size="sm">
              <b-form-input
                style="display: none"
                type="text"
                v-model="data.item.uniq_id"
                :id="`inputuniq_${data.item.id}`"
              />
              <b-form-text style="display: block" :id="`uniq_${data.item.id}`">
                {{ data.item.uniq_id }}
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
            >
              送出
            </b-button>
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
        <div class="row">
          <div class="col-sm">
            <b-input-group prepend="Per Page" size="sm" style="max-width: 50%">
              <b-form-select v-model="perPage" :options="per" />
            </b-input-group>
          </div>
          <div class="col-sm">
            <b-pagination
              v-model="currentPage"
              :total-rows="rows"
              :per-page="perPage"
              style="margin: auto"
              align="center"
              aria-controls="role_table"
            />
          </div>
          <div class="col-sm">
            <b-input-group
              prepend="前往"
              append="頁"
              size="sm"
              style="max-width: 50%; margin-left: auto"
            >
              <b-form-input
                type="number"
                min="1"
                :max="totalpage"
                v-model="currentPage"
              />
            </b-input-group>
          </div>
        </div>
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
      btn: false,
      perPage: 2,
      currentPage: 1,
      loading: false,
      chmod: true,
      filter: null,
      totalpage: "",
      createdata: [
        {
          name: null,
          provider_id: null,
          uniq_id: null,
        },
      ],
      player: [],
      per: [
        { text: "10", value: 10 },
        { text: "3", value: 3 },
        { text: "2", value: 2 },
      ],
      fields: [
        {
          key: "id",
          label: "帳號",
          thStyle: "min-width:61px",
        },
        {
          key: "name",
          label: "名稱",
          thStyle: "min-width:218px",
          sortable: true,
        },
        {
          key: "provider_id",
          label: "Provider_Id",
          thStyle: "min-width:150px",
        },
        {
          key: "uniq_id",
          label: "Uniq_Id",
          thStyle: "min-width:150px",
        },
        {
          key: "last_at",
          thStyle: "min-width:106px",
          label: "更新時間",
          sortable: true,
        },
        {
          key: "updata",
          label: "修改",
        },
      ],
      target_array: [
        "inputname",
        "inputprovider",
        "inputuniq",
        "name",
        "provider",
        "uniq",
        "subbtn",
        "updbtn",
        "cancel",
      ],
    };
  },
  computed: {
    rows() {
      return this.player.length;
    },
  },
  created: async function () {
    this.createdata.name = "";
    this.createdata.provider_id = "";
    this.createdata.uniq_id = "";
    this.loading = await true;
    await axios
      .post(`${this.api}/player`, {
        api_token: VueCookies.get("token"),
        id: sessionStorage.getItem("id"),
      })
      .then((res) => {
        this.loading = false;
        this.player = res.data.result.player;
        console.log(this.player.length);
        this.totalpage = Math.ceil(this.player.length / this.perPage);
        console.log(this.totalpage);
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
  watch: {
    perPage: function () {
      this.totalpage = Math.ceil(this.player.length / this.perPage);
    },
  },
  methods: {
    update(id) {
      this.target_array.forEach((item, index) => {
        if (
          item == "updbtn" ||
          item == "name" ||
          item == "provider" ||
          item == "uniq"
        ) {
          document.getElementById(`${item}_${id}`).style.display = "none";
        } else {
          document.getElementById(`${item}_${id}`).style.display = "block";
        }
      });
    },
    async submit(data) {
      var name = String(data.item.name);
      var provider_id = String(data.item.provider_id);
      var uniq_id = String(data.item.uniq_id);
      if (name == "" || uniq_id == "" || provider_id == "") {
        this.$swal({
          title: "修改失敗！",
          text: "更改內容不可為空",
          icon: "error",
        });
      } else if (
        name != name.replace(this.reCn, "") ||
        uniq_id != uniq_id.replace(this.reEn, "") ||
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
              .post(`${api}/player/u`, {
                api_token: VueCookies.get("token"),
                id: sessionStorage.getItem("id"),
                update_id: data.item.id,
                name: data.item.name,
                provider_id: data.item.provider_id,
                uniq_id: data.item.uniq_id,
              })
              .then((res) => {
                this.loading = false;
                console.log(res);
                if (res.data.status == 200) {
                  this.target_array.forEach((item, index) => {
                    if (
                      item == "updbtn" ||
                      item == "name" ||
                      item == "provider" ||
                      item == "uniq"
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
        .post(`${this.api}/player`, {
          api_token: VueCookies.get("token"),
          id: sessionStorage.getItem("id"),
        })
        .then(async (res) => {
          console.log(res);
          this.loading = false;
          this.player = res.data.result.player;
        });
      this.target_array.forEach((item, index) => {
        if (
          item == "updbtn" ||
          item == "name" ||
          item == "provider" ||
          item == "uniq"
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
      var provider_id = this.createdata.provider_id;
      var uniq_id = this.createdata.uniq_id;
      console.log(name);
      console.log(provider_id);
      console.log(uniq_id);
      if (name == "" || provider_id == "" || uniq_id == "") {
        this.$swal({
          title: "新增失敗！",
          text: "新增內容不可為空",
          icon: "error",
        });
      } else if (
        name != name.replace(this.reCn, "") ||
        provider_id != provider_id.replace(this.reMt, "") ||
        uniq_id != uniq_id.replace(this.reEn, "")
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
          .post(`${this.api}/player/c`, {
            api_token: VueCookies.get("token"),
            id: sessionStorage.getItem("id"),
            name: this.createdata.name,
            provider_id: this.createdata.provider_id,
            uniq_id: this.createdata.uniq_id,
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
                .post(`${this.api}/player`, {
                  api_token: VueCookies.get("token"),
                  id: sessionStorage.getItem("id"),
                })
                .then(async (res) => {
                  console.log(res);
                  this.loading = false;
                  this.player = res.data.result.player;
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