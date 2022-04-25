

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