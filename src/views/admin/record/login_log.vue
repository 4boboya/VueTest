<template>
  <div>
    <nav-bar @sidebar="opensidebar" />
    <div class="row content">
      <side
        id="side"
        class="col"
        style="max-width: 218px; margin-left: -14rem"
      />
      <div id="cont" class="col-md-auto" style="width: 90%; margin: 0 auto">
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
</style>

<script>
export default {
  methods:{
    opensidebar(){
      var sidebar = document.getElementById('side');
      var con = document.getElementById('cont');
      if (sidebar.style.marginLeft == '-14rem'){
        sidebar.style.marginLeft = '0rem'
        con.style.width = "calc(100% - 215px)"
        con.style.margin = '0 auto'
      }else{
        sidebar.style.marginLeft = '-14rem'
        con.style.width = "90%"
        con.style.margin = '0 auto'
      }
    }
  }
};
</script>