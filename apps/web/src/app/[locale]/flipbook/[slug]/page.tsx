"use client";
import { gql, useQuery } from "@apollo/client";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import PageFlipper from "@/components/PageFlipper";
import styles from "./flipbook.module.css";

const FLIPBOOK_BY_SLUG = gql`
  query FlipBookBySlug($slug: String!) {
    flipBookBySlug(slug: $slug) {
      id
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

interface Translation {
  locale: string;
  title?: string;
  description?: string;
  images?: string[];
}

interface FlipBook {
  id: string;
  slug: string;
  translations: Translation[];
  settings?: {
    width?: number;
    height?: number;
    backgroundColor?: string;
    showPageNumbers?: boolean;
  };
}

export default function FlipBookDetail() {
  const { slug, locale } = useParams() as { slug: string; locale: string };
  const { data, loading, error } = useQuery<{ flipBookBySlug: FlipBook }>(
    FLIPBOOK_BY_SLUG,
    {
      variables: { slug },
      skip: !slug,
    }
  );

  if (loading) return <p>Loading flipbook…</p>;
  if (error) return <p>Error: {error.message}</p>;

  const fb = data?.flipBookBySlug;
  if (!fb) return <p>Not found</p>;

  const t =
    fb?.translations.find((tr) => tr.locale === locale) || fb.translations[0];

  return (
    <main className={styles.container}>
      {/* Hero */}
      <motion.div
        className={styles.hero}
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}>
        <h1>{t.title}</h1>
        <p>{t.description}</p>
      </motion.div>

      {/* Flipbook Viewer */}
      <motion.div
        className={styles.viewer}
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}>
        <PageFlipper
          images={t.images ?? []}
          width={fb.settings?.width || 400}
          height={fb.settings?.height || 600}
          backgroundColor={fb.settings?.backgroundColor || "#fff"}
          showPageNumbers={fb.settings?.showPageNumbers ?? true}
        />
      </motion.div>

      {/* Meta info */}
      <div className={styles.meta}>
        <p>
          <strong>Dimensions:</strong> {fb.settings?.width} ×{" "}
          {fb.settings?.height}
        </p>
        <p>
          <strong>Page Numbers:</strong>{" "}
          {fb.settings?.showPageNumbers ? "Yes" : "No"}
        </p>
      </div>
    </main>
  );
}
