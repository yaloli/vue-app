<template>

    <div class="classify">
      <div class="tryClassifying">
        <p class="text_area">아이템을 버킷에 분류해보세요</p>
        <div class="thumbwrap">
          <a href="#"><img ></a>
        </div>
      </div>
      <div class="selectBucket">
        <Bucket/><Bucket/><Bucket/>
      </div>
    </div>

</template>

<script>
import Bucket from './Bucket.vue'
export default {
    name: 'Classify',
    components:{Bucket}
}

</script>

<style>
#wishbucket-root .classify {
  width: 328px;
  height: auto;
  margin:0px;
  padding: 0px;
  border: 0px;
  text-align: center;
}
#wishbucket-root .classify p {
  margin:12px 0px 0px 0px;
  padding: 0px;
  border: 0px;
}
#wishbucket-root .tryClassifying {
  display: inline-block;
  height: 52px;
  width: 284px;
  border-top: 1px solid #e6e6e6;
}
#wishbucket-root .thumbwrap {
  vertical-align: auto;
  float: left;
  width: 30px;
  height: 30px;
  margin-top: 11px;
  margin-bottom: 11px;
}
#wishbucket-root div.thumbwrap img {
  width: 28px;
  height: 28px;
}
#wishbucket-root .selectBucket {
  display: inline-block;
  height: auto;
  width: 284px;
}
</style>