<template>
  <div class="bg-dark">
    <!-- <b-button v-b-toggle.sidebar class="side_bar"
      ><b-icon icon="hdd-stack-fill"
    /></b-button> -->

    <!-- <b-sidebar
      id="sidebar"
      bg-variant="dark"
      class="side"
      width="200px"
      style="height:100vh;margin-top:90px"
      bgcolor
      no-header
    > -->
      <template>
        <div class="d-flex text-light align-items-center px-3 py-2">
          <b-nav-item style="width: 100%" href="/main">
            <font-awesome-icon icon="arrow-left" /> 管理者介面
          </b-nav-item>
        </div>
      </template>
      <div class=" px-3 py-2 cont">
        <b-form-group>
          <b-nav v-for="(item, index) in sidebararray" :key="index" vertical>
            <p @click="show_collapse(index)">
              <a href="javascript:void(0)">
                {{ item.table }}
              </a>
            </p>
            <b-collapse :id="`collapse${index}`">
              <b-nav-item
                v-for="(item2, item) in item.submain"
                :key="item"
                :href="item2.url"
              >
                <font-awesome-icon :icon="item2.icon2" />
                {{ item2.table }}
              </b-nav-item>
            </b-collapse>
          </b-nav>
        </b-form-group>
      </div>
      <footer>
        <div class="d-flex text-light align-items-center px-3 py-2" style="margin-bottom:0">
          <b-nav-item style="width: 100%" @click="logoutbutton">
            登出 <font-awesome-icon icon="sign-out-alt" />
          </b-nav-item>
        </div>
      </footer>
    <!-- </b-sidebar> -->
  </div>
</template>

<style lang="scss" scoped>
.cont{
  
  min-height: calc(100vh - 247px);
  height: auto;
  margin: 0 auto -60px;
}
::marker{
  color: #343a40 !important;
}
.form-inline {
  flex-flow: inherit;
}
.btn-secondary {
  background-color: transparent;
  border-color: transparent;
}
.form-control {
  background-color: transparent;
  border-color: transparent;
  color: white;
}
.side_bar {
  color: #777 !important;
  background-color: transparent !important;
  border-color: transparent !important;
}
a {
  color: white;
}
p {
  color: white;
  margin-top: 1rem;
}
</style>

<script>
import axios from "axios";
import VueCookies from "vue-cookies";

export default {
  data() {
    return {
      sidebararray: [],
    };
  },
  props: {
    msg: Boolean,
  },
  created: async function () {
    if (sessionStorage.getItem("sidebar") == null) {
      await axios
        .post(`${this.api}/sidebar`, {
          api_token: VueCookies.get("token"),
        })
        .then(async (res) => {
          this.sidebararray = await res.data.result.main;
          await sessionStorage.setItem("sidebar", JSON.stringify(res.data.result.main));
        });
    } else {
      this.sidebararray = JSON.parse(sessionStorage.getItem("sidebar"));
    }
  },
  methods: {
    logoutbutton() {
      this.$swal({
        title: "是否確定要登出",
        showDenyButton: true,
        confirmButtonText: "確定",
        denyButtonText: "取消",
      }).then((res) => {
        if (res.isConfirmed) {
          this.logout();
        } else if (res.isDenied) {
        }
      });
    },
    show_collapse(index) {
      this.$root.$emit("bv::toggle::collapse", `collapse${index}`);
    },
  },
};
</script>


