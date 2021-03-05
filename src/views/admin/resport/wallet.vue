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
        <b-form-input
          v-model="filter"
          v-if="datalength"
          id="filter-input"
          type="search"
          class="mr-sm-2 my-3"
          placeholder="Search"
        />
        <b-table
          :items="report"
          :fields="fields"
          :filter="filter"
          :filter-included-fields="['name']"
          class="my-3"
          responsive
          striped
          hover
        />
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
      report: [],
      fields: [
        {
          key: "gid",
          label: "Gid",
          sortable: true,
        },
        {
          key: "goods",
          label: "種類",
        },
        {
          key: "id",
          label: "Id",
        },
        {
          key: "in",
          label: "進貨量",
        },
        {
          key: "out",
          label: "出貨量",
        },
        {
          key: "profile",
          label: "保存方式",
        },
        {
          key: "surplus",
          label: "剩餘量",
        },
        {
          key: "token",
          label: "Token",
        },
        {
          key: "wage",
          label: "工資",
        },
        {
          key: "created_at",
          label: "創建時間",
          thStyle: "min-width:106px",
          sortable: true,
        },
      ],
    };
  },
  created: async function () {
    this.loading = await true;
    await axios
      .post(`${this.api}/reportcombine`, {
        api_token: VueCookies.get("token"),
        id: sessionStorage.getItem("id"),
      })
      .then((res) => {
        this.loading = false;
        this.report = res.data.result.report;
        console.log(res);
      });
    if (this.report.length != 0) {
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
      console.log(sessionStorage.getItem("chmod"));
      this.chmod = false;
      this.$root.$emit("bv::disable::tooltip");
    }
  },
  methods: {
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