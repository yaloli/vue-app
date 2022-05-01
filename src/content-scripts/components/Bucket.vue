

<script>
export default {
  data() {
    return {
      on : this.check
    };
  },
  name: "Bucket",
  props: {
    bucketname: {
      type: String,
      default: "",
    },
    check: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    BucketClick() {
      this.on = true;
    },
  },
};
</script>

<template>
  <button @click="BucketClick">
    <div class="buckets" :class="{ischecked:on}">
      <p>{{ bucketname }}</p>
    </div>
  </button>
</template>

<style>
#wishbucket-root div.selectBucket > button {
  float: left;
  margin: 0px;
  border: 0px;
  padding: 0px;
  color: transparent;
  background-color: transparent;
}
#wishbucket-root div.buckets {
  float: left;
  margin: 0px 7px 9px 0px;
  border: 1px solid #9a9a9a;
  box-sizing: border-box;
  border-radius: 14px;
  padding: 7px 12px 7px 12px;
  font-style: normal;
  font-weight: 700;
  line-height: 21px;
  /* identical to box height */
  text-align: center;
  color: #9a9a9a;
}
#wishbucket-root div.buckets p {
  font-family: "Noto Sans KR";
  margin: 0px;
  font-size: 14px;
}
#wishbucket-root .ischecked {
  background: #7f50ff !important;
  border-radius: 14px !important;
  color: #ffffff !important;
  border: 0px !important;
  padding: 8px 13px 8px 13px !important;
}
#wishbucket-root .ischecked p {
  color: #ffffff !important;
  border: 0px !important;
}
</style>