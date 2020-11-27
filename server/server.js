const express = require('express');
const { ApolloServer, gql } = require('apollo-server-express');

 
 const typeDefs = gql`
  type Author {
    id: ID
    name: String
    books: [Book]
  }
  type Book {
    id: ID
    title: String
    author: String
  }
  type Query {
    allAuthor: [Author]
    allBook: [Book]
    findAuthor(id: String!): Author
    findBook(id: String!): Book
  }
  type Mutation {
    createAuthor(name: String!): Author
    createBook(title: String!, author: String!): Book
    deleteAuthor(id: ID!): Author
    deleteBook(id: ID!): Book
  }
`;

var authorList = [];
var bookList = [];
var authorCnt = 0, bookCnt = 0;
var resolvers  = {
    Query: {
        // 저자 목록 검색
        allAuthor: () => authorList,
        // 책 목록 검색
        allBook: () => bookList,
        findAuthor: ({id}) => authorList.find((author) => {author.id == id}),
        findBook: ({id}) => bookList.find((book) => {book.id == id})
    },
    Mutation: {
        // 저자 추가
        createAuthor (parent, {name}) {
            const author = {id: authorCnt++, name}
            authorList.push(author);
            return author;
        },
        // 책 추가
        createBook (parent, {title, author}) {
            const book = {id: bookCnt++, title, author};
            bookList.push(book);
            return book;
        },
        // 저자 삭제
        deleteAuthor (parent, {id}) {
            const idx = authorList.findIndex((author) => author.id == id);
            let author = {};
            if (idx>=0) {
                author = authorList[idx];
                authorList.splice(idx, 1);
            }
            return author;
        },
        // 책 삭제
        deleteBook (parent, {id}) {
            const idx = bookList.findIndex((book) => book.id == id);
            let book = {};
            if (idx>=0) {
                book = bookList[idx];
                bookList.splice(idx, 1);
            }
            return book;
        }
    },
    // 연쇄 리졸버
    Author: {
        // 저자의 books 정보를 검색
        books (parent) {
            const list = []
            bookList.forEach((book) => {
                if (book.author === parent.name) list.push(book);
            })
            return list;
        }
    }
};

const server = new ApolloServer({ typeDefs, resolvers });
const app = express();
server.applyMiddleware({app});

app.listen({port: 4000}, () => console.log('Now browse to localhost:4000/graphql'));
