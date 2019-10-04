<template>
<div class="posts-page">
    <PostList v-bind:posts="loadedPosts"/>
</div>
</template>
<script>
export default {
  middleware:'log',
  computed:{
    loadedPosts() {
      return this.$store.getters.loadedPosts
    }
  }
}
</script>
















<style scoped>
.posts-page{
    display: flex;
    justify-content: center;
    align-items: center
}
.featured-posts {
  display: flex;
  padding: 20px;
  box-sizing: border-box;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
}    
</style>