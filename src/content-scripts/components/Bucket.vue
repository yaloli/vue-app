

<script>

export default {
    name: 'Bucket',
}

</script>
<template>
    <label class='buckets'>
        <p>props.name</p>
    </label> 
</template>

<style>
#wishbucket-root label.buckets {
  float: left;
  margin: 0px 7px 9px 0px;
  border: 1px solid #9a9a9a;
  box-sizing: border-box;
  border-radius: 14px;
  padding: 7px 12px 7px 12px;
  font-family: "Noto Sans CJK KR";
  font-style: normal;
  font-weight: 700;
  font-size: 14px;
  line-height: 21px;
  /* identical to box height */
  text-align: center;
  color: #9a9a9a;
}
#wishbucket-root label.buckets p {
  margin: 0px;
}
#wishbucket-root .ischecked {
  background: #7f50ff !important;
  border-radius: 14px !important;
  color: #ffffff !important;
  border: 0px !important;
  padding: 8px 13px 8px 13px !important;
}
</style>