"use client";
import { useState } from "react";
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
        size
        minWidth
        maxWidth
        minHeight
        maxHeight
        drawShadow
        flippingTime
        usePortrait
        startZIndex
        autoSize
        maxShadowOpacity
        showCover
        mobileScrollSupport
        backgroundColor
        showPageNumbers
        swipeDistance
        showPageCorners
        disableFlipByClick
        useMouseEvents
      }
    }
  }
`;

const UPDATE_FLIPBOOK = gql`
  mutation UpdateFlipBook($id: ID!, $input: FlipBookInput!) {
    updateFlipBook(id: $id, input: $input)
  }
`;

export default function EditFlipBookPage() {
  const { slug } = useParams() as { slug: string };
  const [showToast, setShowToast] = useState(false);

  const { data, loading, error } = useQuery(FLIPBOOK_BY_SLUG, {
    variables: { slug },
    fetchPolicy: "cache-and-network",
    notifyOnNetworkStatusChange: true,
  });

  const [updateFlipBook] = useMutation(UPDATE_FLIPBOOK);

  const handleSubmit = async (values: FlipbookFormValues) => {
    const cleanSettings = values.settings
      ? {
          width: values.settings.width,
          height: values.settings.height,
          size: values.settings.size,
          minWidth: values.settings.minWidth,
          maxWidth: values.settings.maxWidth,
          minHeight: values.settings.minHeight,
          maxHeight: values.settings.maxHeight,
          drawShadow: values.settings.drawShadow,
          flippingTime: values.settings.flippingTime,
          usePortrait: values.settings.usePortrait,
          startZIndex: values.settings.startZIndex,
          autoSize: values.settings.autoSize,
          maxShadowOpacity: values.settings.maxShadowOpacity,
          showCover: values.settings.showCover,
          mobileScrollSupport: values.settings.mobileScrollSupport,
          showPageNumbers: values.settings.showPageNumbers,
          swipeDistance: values.settings.swipeDistance,
          showPageCorners: values.settings.showPageCorners,
          disableFlipByClick: values.settings.disableFlipByClick,
          useMouseEvents: values.settings.useMouseEvents,
        }
      : undefined;

    await updateFlipBook({
      variables: {
        id: flipBook.id,
        input: {
          slug: values.slug,
          title: values.title,
          description: values.description,
          images: [...values.images],
          status: "draft",
          tags: [],
          settings: cleanSettings,
        },
      },
    });
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 2500);
  };

  if (loading) return <p>Loading…</p>;
  if (error) return <p>Error: {error.message}</p>;

  const flipBook = data.flipBookBySlug;

  if (!flipBook) return <p>Flipbook not found</p>;

  return (
    <main className={styles.container}>
      {showToast && (
        <div
          style={{
            position: "fixed",
            top: "20px",
            right: "20px",
            background: "#10b981",
            color: "white",
            padding: "12px 24px",
            borderRadius: "8px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            zIndex: 1000,
            fontWeight: "600",
          }}>
          ✅ Flipbook saved successfully!
        </div>
      )}

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
