<template>
  <footer class="text-white bg-color mt-auto">
    <div class="container-fluid py-3" style="width: 40%">
      <h3>CONTACT US</h3>
      <div>
        <a href="#">
          <b-icon font-scale="1.5" icon="facebook" />
        </a>
        <a href="#">
          <b-icon style="margin: 0 10%" font-scale="1.5" icon="instagram" />
        </a>
        <a href="#">
          <b-icon font-scale="1.5" icon="twitter" />
        </a>
      </div>
      <ul>
        <li>週一至週五</li>
        <li>
          09:00~12:30
          <b-icon
            class="align"
            font-scale="0.3"
            icon="circle-fill"
          />13:30~18:30
        </li>
        <li>ooxx@gmail.com</li>
        <li>(04)ooxx-xxoo</li>
      </ul>
    </div>
  </footer>
</template>

<script>
export default {};
</script>

<style scoped>
a {
  color: white;
}
.align {
  vertical-align: middle;
}
ul {
  text-align: left;
  font-size: 0.75rem;
  line-height: 3em;
  margin: 0 auto;
  padding-inline-start: 0 !important;
}
li {
  border-bottom: 0.1em solid #828282;
  color: #989898;
  list-style: none;
}
footer {
  width: 100%;
  text-align: center;
}
.bg-color {
  background-color: rgba(74, 77, 81, 1);
}
</style>