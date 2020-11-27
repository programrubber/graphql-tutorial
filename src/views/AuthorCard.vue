<template>
<div>
    <div class="card authorcard">
        <div class="authorcard-header">
            <button @click="delClick">X</button>
        </div>
        <div class="authorcard-middle">
            <div style="text-align: left;"><b>Author</b></div>
            <ul>
                <li>{{author.name}}</li>
            </ul>
        </div>
        <div class="authorcard-bottom" v-if="author.books.length > 0">
            <div><b>books</b></div>
            <ul>
                <li v-for="(book, index) in author.books" :key="index">
                    {{book.title}}
                </li>
            </ul>
        </div>
    </div>
</div>
</template>

<script>
export default {
    name: 'AuthorCard',
    props: {
        id: {
            type: String,
            default: "-1"
        },
        author: {
            type: Object,
            default: {}
        }
    },
    methods: {
        delClick () {
            this.$emit('del', this.author.id)
        }
    },
}
</script>