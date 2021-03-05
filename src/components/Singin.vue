<template>
  <b-container>
    <b-card class="container" bg-variant="light" style="max-width: 540px">
      <b-col>
        <b-img
          rounded
          src="https://www.cup.com.hk/wp-content/uploads/2017/08/379547776_1600.jpg"
          fluid
          alt="Fluid image"
        />
        <h4>登入</h4>
        <b-form @keyup.enter="onSubmit">
          <b-form-group id="name" label="帳號:" label-for="account-1">
            <b-form-input
              id="account-1"
              v-model="form.name"
              placeholder="輸入帳號"
              required
            />
          </b-form-group>

          <b-form-group id="password" label="密碼:" label-for="password-1">
            <b-form-input
              id="password-1"
              v-model="form.password"
              type="password"
              placeholder="輸入密碼"
              required
            />
          </b-form-group>

          <b-button variant="secondary" @click="onSubmit">登入</b-button>
        </b-form>
      </b-col>
    </b-card>
  </b-container>
</template>

<script>
import axios from "axios";
import md5 from "js-md5";
import VueCookies from "vue-cookies";

export default {
  data() {
    return {
      form: {
        name: "",
        password: "",
        unixtime: "",
        salt: "iamsalt",
        sign: "",
      },
    };
  },
  created: async function () {
    (this.form.name = ""),
      (this.form.password = ""),
      setInterval(() => {
        this.UpdateTime();
      });
    await this.checklogin();
    console.log(this.status);
  },
  methods: {
    UpdateTime() {
      this.form.unixtime = new Date().getTime();
    },
    async onSubmit() {
      if (this.form.name == "" || this.form.password == "") {
        this.$swal("登入失敗", "帳號或密碼不可空白", "error");
      } else {
        this.form.sign = md5(
          this.form.name +
            this.form.unixtime +
            this.form.salt +
            this.form.password
        );
        await axios
          .post(`${this.api}/login`, {
            name: this.form.name,
            password: this.form.password,
            unixtime: this.form.unixtime,
            sign: this.form.sign,
          })
          .then(async (response) => {
            console.log(response);
            if (response.data.status == 200) {
              await VueCookies.set("token", response.data.result.api_token);
              await sessionStorage.setItem(
                "cellphone",
                response.data.result.cellphone
              );
              await sessionStorage.setItem("chmod", response.data.result.chmod);
              await sessionStorage.setItem(
                "gender",
                response.data.result.gender
              );
              await sessionStorage.setItem("id", response.data.result.id);
              await sessionStorage.setItem("level", response.data.result.level);
              await sessionStorage.setItem("status", response.data.status);
              this.$swal({
                title: "登入成功",
                text: "歡迎回來",
                icon: "success",
                timer: 3000,
                confirmButtonText: "確認",
              }).then(function () {
                if (sessionStorage.getItem("chmod") == "administrator") {
                  window.location.href = "/main";
                } else {
                  window.location.href = "/";
                }
              });
            } else {
              this.$swal("登入失敗", "帳號或密碼錯誤", "error");
            }
          });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.card {
  position: unset !important;
}
.col {
  position: unset !important;
}
.container {
  margin-top: 10px;
}
</style>