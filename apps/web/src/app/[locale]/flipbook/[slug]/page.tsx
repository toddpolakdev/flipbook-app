/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React from "react";
import { gql, useQuery } from "@apollo/client";
import Link from "next/link";
import styles from "./flipbook.module.css";
import PageFlipper from "@/components/PageFlipper";

const FLIPBOOK = gql`
  query FlipBookBySlug($slug: String!) {
    flipBookBySlug(slug: $slug) {
      slug
      translations {
        locale
        title
        description
        images
      }
      settings {
        width
        height
        backgroundColor
        showPageNumbers
      }
    }
  }
`;

export default function FlipBookPage({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>;
}) {
  const { slug, locale } = React.use(params);

  const { data, loading, error } = useQuery(FLIPBOOK, { variables: { slug } });

  if (loading) return <p className={styles.message}>Loading…</p>;
  if (error) return <p className={styles.error}>Error: {error.message}</p>;

  const flipBook = data.flipBookBySlug;
  const translation = flipBook.translations.find(
    (t: any) => t.locale === locale
  );

  return (
    <main className={styles.container}>
      <Link href="/" className={styles.back}>
        ← Back to Flipbooks
      </Link>

      <h1 className={styles.title}>{translation?.title}</h1>
      {translation?.description && (
        <p className={styles.description}>{translation.description}</p>
      )}
      <PageFlipper
        images={translation?.images || []}
        width={flipBook.settings?.width || 400}
        height={flipBook.settings?.height || 600}
        backgroundColor={flipBook.settings?.backgroundColor || "#fff"}
        showPageNumbers={flipBook.settings?.showPageNumbers ?? true}
      />
      <Link href={`/${locale}/flipbook/${slug}/edit`}>Edit Flipbook</Link>
    </main>
  );
}
