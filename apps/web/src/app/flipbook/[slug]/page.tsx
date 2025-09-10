"use client";

import { gql, useQuery } from "@apollo/client";
import { useParams } from "next/navigation";
import PageFlipper from "@/components/PageFlipper";
import styles from "./view.module.css";

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

export default function FlipBookPage() {
  const { slug } = useParams() as { slug: string };

  const { data, loading, error } = useQuery(FLIPBOOK_BY_SLUG, {
    variables: { slug },
  });

  if (loading) return <p>Loading flipbook…</p>;
  if (error) return <p>Error: {error.message}</p>;

  const flipBook = data?.flipBookBySlug;
  if (!flipBook) return <p>Flipbook not found.</p>;

  return (
    <main className={styles.container}>
      <h1 className={styles.heading}>{flipBook.title}</h1>
      <p className={styles.description}>{flipBook.description}</p>

      <PageFlipper
        images={flipBook.images}
        width={flipBook.settings?.width || 400}
        height={flipBook.settings?.height || 600}
        backgroundColor={flipBook.settings?.backgroundColor || "#701919ff"}
        showPageNumbers={flipBook.settings?.showPageNumbers ?? true}
      />
    </main>
  );
}
