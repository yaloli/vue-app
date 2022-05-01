<template>

  <div class='wishfooter'>
    <a><img :src="gear"/></a>
  </div> 

</template>

<script>

export default {
    name: 'Footer',
    props:{
      gear:{
        type:String,
        default:"chrome-extension://dhgdkccoiadplgiocidlhgadfdkdmaaa/gear.png"
      }
    }
}

</script>

<style>
#wishbucket-root .wishfooter {
  width: 328px;
  height: 45px;
}
#wishbucket-root .wishfooter > a {
  width: 328px;
  height: 45px;
  float: right;
}

#wishbucket-root div.wishfooter img {
  width: 30px;
  height: 30px;
  float: right;
  margin-right: 20px;
  filter: none;
}


</style>