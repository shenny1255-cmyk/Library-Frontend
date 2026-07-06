import { gql } from "@apollo/client";

export const ADD_BOOK = gql`
  mutation AddBook(
    $title: String!
    $authorId: ID!
    $category: String!
    $publishedYear: Int
    $quantity: Int!
  ) {
    addBook(
      title: $title
      authorId: $authorId
      category: $category
      publishedYear: $publishedYear
      quantity: $quantity
    ) {
      id
    }
  }
`;

export const UPDATE_BOOK = gql`
  mutation UpdateBook($id: ID!, $title: String, $category: String, $publishedYear: Int, $quantity: Int) {
    updateBook(id: $id, title: $title, category: $category, publishedYear: $publishedYear, quantity: $quantity) {
      id
    }
  }
`;

export const DELETE_BOOK = gql`
  mutation DeleteBook($id: ID!) {
    deleteBook(id: $id)
  }
`;

export const ADD_AUTHOR = gql`
  mutation AddAuthor($name: String!, $bio: String) {
    addAuthor(name: $name, bio: $bio) {
      id
    }
  }
`;

export const ADD_MEMBER = gql`
  mutation AddMember($name: String!, $email: String!, $phone: String) {
    addMember(name: $name, email: $email, phone: $phone) {
      id
    }
  }
`;

export const DELETE_MEMBER = gql`
  mutation DeleteMember($id: ID!) {
    deleteMember(id: $id)
  }
`;

export const BORROW_BOOK = gql`
  mutation BorrowBook($bookId: ID!, $memberId: ID!, $dueDate: String!) {
    borrowBook(bookId: $bookId, memberId: $memberId, dueDate: $dueDate) {
      id
    }
  }
`;

export const RETURN_BOOK = gql`
  mutation ReturnBook($recordId: ID!) {
    returnBook(recordId: $recordId) {
      id
    }
  }
`;
export const REGISTER = gql`
  mutation Register($name: String!, $email: String!, $password: String!) {
    register(name: $name, email: $email, password: $password) {
      token
      user {
        id
        name
        email
        memberId
      }
    }
  }
`;

export const LOGIN = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        id
        name
        email
        memberId
      }
    }
  }
`;

export const BORROW_BOOK_FOR_ME = gql`
  mutation BorrowBookForMe($bookId: ID!, $dueDate: String!) {
    borrowBookForMe(bookId: $bookId, dueDate: $dueDate) {
      id
    }
  }
`;

export const RETURN_BOOK_FOR_ME = gql`
  mutation ReturnBookForMe($recordId: ID!) {
    returnBookForMe(recordId: $recordId) {
      id
    }
  }
`;