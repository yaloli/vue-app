<template>

    <div class="classify">
      <div class="tryClassifying">
        <p class="text_area">아이템을 버킷에 분류해보세요</p>
        <div class="thumbwrap">
          <a @click="plusButton"><img :src="plus"/></a>
        </div>
      </div>
      <div class="selectBucket">
        <Bucket v-for="bucket in buckets" v-bind:key="bucket.id" :id="bucket.id" :bucketname="bucket.name" :check="bucket.check" @click="toBucket(bucket.id)"></Bucket>
      </div>
    </div>

</template>

<script>
import Bucket from './Bucket.vue'
export default {
    name: 'Classify',
    components:{Bucket},
    props:{
      plus:{
        type:String,
        default:"chrome-extension://dhgdkccoiadplgiocidlhgadfdkdmaaa/plus.png"
      },
      buckets:{
        type:Array,
        default:["버킷목록을 가져오지 못함"]
      },
      setState:{
        type:Function
      },
      plusButton:{
        type:Function
      },
      toBucket:{
        type:Function
      }
    }
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
  margin-top: 10px;
  margin-bottom: 10px;
}
#wishbucket-root div.thumbwrap img {
  width: 28px;
  height: 28px;
  filter: none;
}
#wishbucket-root .selectBucket {
  display: inline-block;
  height: auto;
  width: 284px;
}
</style>