<template>
<div>
    <div class="card bookcard">
        <div class="bookcard-header">
            <button @click="delClick">X</button>
        </div>
        <div class="bookcard-middle">{{book.title}}</div>
        <div class="bookcard-bottom">created by {{book.author}}</div>
    </div>
</div>
</template>

<script>
export default {
    name: 'BookCard',
    props: {
        book: {
            type: Object,
            defulat: {}
        }
    },
    methods: {
        delClick () {
            this.$emit('del', this.book.id)
        }
    },
}
</script>