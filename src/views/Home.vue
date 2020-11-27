<template>
  <div style="text-align: left; font-family: sans-serif; padding: 0 20px;">
    <div style="height:50px"></div>
    <div>
      <div class="flex-container">
        <div>Authors</div>
        <div class="flex-space"/>
        <div class="flex-container">
          <input
            v-model="authorForm.name"
            type="text"
            class="input"
            placeholder="Author Name"
            @keydown.enter="addAuthor"
          />
          <button class="button button4" @click="addAuthor">add</button>
        </div>
      </div>
    </div>
    <div class="flex-container" style="min-height: 80px; margin-bottom: 10px;">
      <author-card 
        v-for="(author, index) in allAuthor"
        :key="index"
        :author="author"
        @del="delAuthor"
      />
    </div>
    <div class="flex-container">
      <div>Books</div>
      <div class="flex-space" />
      <div class="flex-container">
        <input
          v-model="bookForm.title"
          type="text"
          class="input"
          placeholder="Title"
        />
        <input
          v-model="bookForm.author"
          type="text"
          class="input"
          placeholder="Author Name"
          @keydown.enter="addBook"
        />
        <button class="button button4" @click="addBook">add</button>
      </div>
    </div>
    <div class="flex-container" style="hegiht: 80px;">
      <book-card
        v-for="(book, index) in allBook"
        :key="index"
        :book="book"
        @del="delBook"
      />
    </div>
  </div>
</template>

<script>
import gql from 'graphql-tag'
import pjson from '../../package.json'
// Components
import AuthorCard from './AuthorCard'
import BookCard from './BookCard'

export default {
  name: 'Home',
  components: {
    AuthorCard,
    BookCard
  },
  data() {
    return {
      pjson,
      authorList: [
        {id: 0, name: 'Tom', books: []},
        {id: 1, name: 'Jack', books: []}
      ],
      bookList: [
        {id: 0, title: 'Hello World', author: 'Tom'}
      ],
      authorForm: { name: '' },
      bookForm: {title: '', author: ''}
    }
  },
  apollo: {
    allAuthor: gql`query {
      allAuthor {
        id
        name
        books {
          title
          author
        }
      }
    }`,
    allBook: gql`query{
      allBook {
        id
        title
        author
      }
    }`
  },
  methods: {
    // form 비우기
    clearAuthorForm () {
      this.authorForm.name = ''
    },
    clearBookForm () {
      this.bookForm.title = ''
      this.bookForm.author = ''
    },
    // 추가 요청
    async addAuthor () {
      if (this.authorForm.name == '') return
      const {data} = await this.$apollo.mutate({ 
        // mutation
        mutation: gql`mutation ($name: String!) {
          createAuthor(name: $name) {
            id
          }
        }
        `,
        // parameter
        variables: {
          name: this.authorForm.name
        }
      })

      this.$apollo.queries.allAuthor.refetch()
      this.clearAuthorForm()
    },
    async addBook () {
      if (this.bookForm.title == '' || this.bookForm.author == '') return
      const {data} = await this.$apollo.mutate({
        mutation: gql`mutation ($title: String!, $author: String!) {
          createBook(title: $title, author: $author) {
            id
          }
        }`,
        variables: {
          title: this.bookForm.title,
          author: this.bookForm.author
        }
      })
      this.$apollo.queries.allAuthor.refetch()
      this.$apollo.queries.allBook.refetch()
      this.clearBookForm()
    },
    // 제거 요청
    async delAuthor (id) {
      const {data} = await this.$apollo.mutate({
        mutation: gql`mutation ($id: ID!) {
          deleteAuthor(id: $id) {
            id
          }
        }`,
        variables: { id }
      })
      this.$apollo.queries.allAuthor.refetch()
    },
    async delBook (id) {
      const {data} = await this.$apollo.mutate({
        mutation: gql`mutation ($id: ID!) {
          deleteBook(id: $id) {
            id
          }
        }`,
        variables: { id } 
      })
      this.$apollo.queries.allBook.refetch()
      this.$apollo.queries.allAuthor.refetch()
    }
  }
}
</script>
