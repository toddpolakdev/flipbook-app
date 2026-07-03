import { gql } from "@apollo/client";

// Public gallery — the backend returns only published flipbooks here.
export const PUBLIC_FLIPBOOKS = gql`
  query GetPublicFlipbooks {
    flipBooks {
      id
      slug
      title
      description
      images
      order
      status
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
      status
      userEmail
    }
  }
`;
