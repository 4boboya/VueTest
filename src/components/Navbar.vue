<template>
  <div class="nav" style="margin-left: 0;">
    <b-navbar class="navbar w-100" toggleable="lg" variant="light" style="height:45px;border-bottom:solid;border-width:1px;border-color:#BEBEBE">
      <!-- <side v-if="this.status" /> -->
      <b-navbar-nav>
        <b-button @click="opensidebar" v-b-toggle.sidebar>
          <b-icon icon="hdd-stack-fill"/>
        </b-button>
      </b-navbar-nav>
      <b-navbar-nav class="brand-center">
        <b-navbar-brand href="/">管理平台</b-navbar-brand>
      </b-navbar-nav>
      <b-navbar-nav>
        <b-nav-item @click="logoutbutton" v-if="active"
          >登出 <font-awesome-icon icon="sign-out-alt"
        /></b-nav-item>
        <b-nav-item href="/login" v-else>
          登入 <font-awesome-icon icon="sign-in-alt"
        /></b-nav-item>
      </b-navbar-nav>
    </b-navbar>
      <b-breadcrumb class="w-100" style="height:45px;border-bottom:solid;border-width:1px;border-color:#BEBEBE">
        <b-breadcrumb-item :active="!home" href="/"> Home </b-breadcrumb-item>
        <b-breadcrumb-item active v-if="home"> {{path}} </b-breadcrumb-item>
      </b-breadcrumb>
  </div>
</template>

<style lang="scss" scoped>
.btn-secondary {
  color: #777;
  background-color: transparent;
  border-color: transparent;
}
.breadcrumb{
  background-color:#f8f9fa
}
.nav{
  height: 90px !important;
}
.navbar-brand {
  font-weight: bold;
}
.navbar-light .navbar-toggler {
  color: #777;
  border-color: transparent;
}
.brand-center {
  margin-left: auto;
  margin-right: auto;
}
.nav {
  border-bottom: 1px solid #eee;
  position: sticky !important;
  top: 0;
  height: 56px;
  z-index: 1;
}
</style>

<script>
export default {
  data() {
    return {
      active: this.status,
      path:"",
      home:false
    };
  },
  created: async function () {
    if (this.$route.path == "/"){
      this.home = false
    }else{
      this.home = true
    }
    this.path = this.$route.path.replace(this.reEn, "")
    console.log(this.path)
    if (sessionStorage.getItem("status") == null) {
      await this.checklogin();
    }
    if (Number(sessionStorage.getItem("status")) === 200) {
      this.active = true;
      this.status = true;
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
    opensidebar(){
      this.$emit('sidebar',"0")
    }
  },
};
</script>
