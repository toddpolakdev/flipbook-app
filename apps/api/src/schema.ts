import { gql } from "apollo-server-micro";

export const typeDefs = gql`
  type FlipBook {
    id: ID!
    slug: String!
    status: String!
    tags: [String!]!
    translations: [FlipBookTranslation!]!
    settings: FlipBookSettings
  }

  type FlipBookTranslation {
    locale: String!
    title: String!
    description: String
    images: [String!]!
  }

  type FlipBookSettings {
    width: Int
    height: Int
    backgroundColor: String
    showPageNumbers: Boolean
  }

  input FlipBookInput {
    slug: String!
    status: String!
    tags: [String!]!
    translations: [FlipBookTranslationInput!]!
    settings: FlipBookSettingsInput
  }

  input FlipBookTranslationInput {
    locale: String!
    title: String!
    description: String
    images: [String!]!
  }

  input FlipBookSettingsInput {
    width: Int
    height: Int
    backgroundColor: String
    showPageNumbers: Boolean
  }

  type Query {
    flipBooks: [FlipBook!]!
    flipBookBySlug(slug: String!): FlipBook
  }

  type Mutation {
    createFlipBook(input: FlipBookInput!): ID!
    updateFlipBook(id: ID!, input: FlipBookInput!): Boolean!
    publishFlipBook(id: ID!): Boolean!
  }
`;
