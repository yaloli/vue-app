

<script>
import Toggle from "@vueform/toggle";
export default {
  name: "Newbucket",
  components:{
    Toggle
  },
  data(){
    return {
      createdBucket : ""
    }
  },
  props: {
    cancelButton: {
      type: Function,
      default: "",
    },
    addtonewbucket: {
      type: Function,
      default: "",
    },
    isClose:{
      type:Boolean,
      default:true
    }
  }
};
</script>

<template>
  <div>
    <div class="paddinglayer">
      <div class="newBucket"><p>새 버킷 만들기</p></div>
      <div class="newBucketName"><p>새 버킷 이름</p></div>
      <div class="input"><input v-model="createdBucket" spellcheck="false" /></div>
      <div class="isOpen">
        <p>비공개 버킷</p>
        <Toggle
          v-model="isClose"
          on-label="Yes"
          off-label="No"
          on-background="#7F50FF"
          :width="80"
          :height="30"
        />
      </div>
      <div class="bottonButtons">
        <button @click="cancelButton" class="bottomButton cancel">
          취소
        </button>
        <button @click="addtonewbucket(createdBucket, isClose)" class="bottomButton toBucket">새 버킷에 담기</button>
      </div>
    </div>
  </div>
</template>

<style>

</style>