import { gql } from "@apollo/client";

export const ALL_FLIPBOOKS = gql`
  query GetAllFlipbooks {
    flipBooks {
      id
      slug
      title
      description
      images
      order
      userEmail
    }
  }
`;

export const MY_FLIPBOOKS = gql`
  query GetMyFlipbooks {
    myFlipbooks {
      id
      slug
      title
      description
      images
      order
      userEmail
    }
  }
`;
