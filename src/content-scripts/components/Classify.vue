<template>

    <div class="classify">
      <div class="tryClassifying">
        <p class="text_area">아이템을 버킷에 분류해보세요</p>
        <div class="thumbwrap">
          <a href="#"><img ></a>
        </div>
      </div>
      <div className="selectBucket">
        <Bucket/>
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

</style>