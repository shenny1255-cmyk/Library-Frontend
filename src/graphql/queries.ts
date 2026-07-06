import { gql } from "@apollo/client";

export const GET_STATS = gql`
  query GetStats {
    stats {
      totalBooks
      totalCopies
      totalMembers
      activeBorrows
      overdueBorrows
    }
  }
`;

export const GET_BOOKS = gql`
  query GetBooks {
    books {
      id
      title
      category
      publishedYear
      quantity
      available
      author {
        id
        name
      }
    }
  }
`;

export const GET_AUTHORS = gql`
  query GetAuthors {
    authors {
      id
      name
      bio
      books {
        id
      }
    }
  }
`;

export const GET_MEMBERS = gql`
  query GetMembers {
    members {
      id
      name
      email
      phone
      borrowRecords {
        id
        status
      }
    }
  }
`;

export const GET_BORROW_RECORDS = gql`
  query GetBorrowRecords {
    borrowRecords {
      id
      borrowDate
      dueDate
      returnDate
      status
      book {
        id
        title
      }
      member {
        id
        name
      }
    }
  }
`;

export const GET_AVAILABLE_BOOKS_AND_MEMBERS = gql`
  query GetAvailableBooksAndMembers {
    books {
      id
      title
      available
    }
    members {
      id
      name
    }
  }
`;
export const GET_MY_BORROW_RECORDS = gql`
  query GetMyBorrowRecords {
    myBorrowRecords {
      id
      borrowDate
      dueDate
      returnDate
      status
      book {
        id
        title
      }
    }
  }
`;