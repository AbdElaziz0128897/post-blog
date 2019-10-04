<template>
  <section class="featured-posts">
    <PostPreview
        v-for="post in posts"
        v-bind:key="post.id" 
        v-bind:id="post.id"
        v-bind:is-admin="isAdmin"
        v-bind:thumbnail="post.thumbnail"
        v-bind:title="post.title"
        v-bind:previewText="post.previewText"/>
  </section>
</template>
<script>
    import PostPreview from '~/components/posts/PostPreview.vue'
    export default {
        components:{
            PostPreview
        },
        props:{
            isAdmin:{
                type:Boolean,
                default: false
            },
            posts:{
                type:Array,
                required: true
            }
        }
    }
</script>
<style scoped>
.featured-posts {
  display: flex;
  padding: 20px;
  box-sizing: border-box;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
}   
</style>