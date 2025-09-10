"use client";
import { gql, useQuery, useMutation } from "@apollo/client";
import { useParams } from "next/navigation";
import styles from "./edit.module.css";

import FlipbookForm, {
  defaultFlipbookValues,
  FlipbookFormValues,
} from "@/components/FlipbookForm/FlipbookForm";

const FLIPBOOK_BY_SLUG = gql`
  query FlipBookBySlug($slug: String!) {
    flipBookBySlug(slug: $slug) {
      id
      slug
      title
      description
      images
      settings {
        width
        height
        backgroundColor
        showPageNumbers
      }
    }
  }
`;

const UPDATE_FLIPBOOK = gql`
  mutation UpdateFlipBook($id: ID!, $input: FlipBookInput!) {
    updateFlipBook(id: $id, input: $input) {
      id
      slug
      title
      description
      images
      settings {
        width
        height
        backgroundColor
        showPageNumbers
      }
    }
  }
`;

export default function EditFlipBookPage() {
  const { slug } = useParams() as { slug: string };

  const { data, loading, error } = useQuery(FLIPBOOK_BY_SLUG, {
    variables: { slug },
  });

  const [updateFlipBook] = useMutation(UPDATE_FLIPBOOK, {
    refetchQueries: ["FlipBooks"],
  });

  const handleSubmit = async (values: FlipbookFormValues) => {
    await updateFlipBook({
      variables: {
        id: flipBook.id,
        input: {
          slug: values.slug,
          status: "draft",
          tags: [],
          title: values.title,
          description: values.description,
          images: [...values.images],
          settings: {
            width: values.settings.width,
            height: values.settings.height,
            backgroundColor: values.settings.backgroundColor,
            showPageNumbers: values.settings.showPageNumbers,
          },
        },
      },
    });
  };

  if (loading) return <p>Loading…</p>;
  if (error) return <p>Error: {error.message}</p>;

  const flipBook = data.flipBookBySlug;

  console.log("flipbook", flipBook);

  return (
    <main className={styles.container}>
      <h1>{flipBook.title}</h1>
      <FlipbookForm
        initialValues={{
          slug: flipBook.slug,
          title: flipBook.title,
          description: flipBook.description || "",
          images: flipBook.images || [],
          settings: flipBook.settings || defaultFlipbookValues.settings,
        }}
        onSubmit={handleSubmit}
      />
    </main>
  );
}
