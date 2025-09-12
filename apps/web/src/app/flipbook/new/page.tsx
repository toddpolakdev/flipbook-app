"use client";
import { useState } from "react";
import { gql, useMutation } from "@apollo/client";
import { useRouter } from "next/navigation";
import styles from "./new.module.css";
import FlipbookForm, {
  defaultFlipbookValues,
  FlipbookFormValues,
} from "@/components/FlipbookForm/FlipbookForm";

const CREATE_FLIPBOOK = gql`
  mutation CreateFlipBook($input: FlipBookInput!) {
    createFlipBook(input: $input)
  }
`;

export default function NewFlipBookPage() {
  const router = useRouter();
  const [showToast, setShowToast] = useState(false);

  const [createFlipBook] = useMutation(CREATE_FLIPBOOK, {
    refetchQueries: ["FlipBooks"],
  });

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
          backgroundColor: values.settings.backgroundColor,
          showPageNumbers: values.settings.showPageNumbers,
          swipeDistance: values.settings.swipeDistance,
          showPageCorners: values.settings.showPageCorners,
          disableFlipByClick: values.settings.disableFlipByClick,
          useMouseEvents: values.settings.useMouseEvents,
        }
      : undefined;

    const res = await createFlipBook({
      variables: {
        input: {
          slug: values.slug,
          title: values.title,
          description: values.description,
          images: values.images,
          status: "draft",
          tags: [],
          settings: cleanSettings,
        },
      },
    });

    // Show success toast
    setShowToast(true);

    // Navigate to edit page after showing toast
    setTimeout(() => {
      setShowToast(false);
      router.push(`/flipbook/${values.slug}/edit`);
    }, 2000);
  };

  return (
    <main className={styles.container}>
      {/* Toast Message */}
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
          ✅ Flipbook created successfully!
        </div>
      )}

      <h1>New Flipbook</h1>
      <FlipbookForm
        initialValues={defaultFlipbookValues}
        onSubmit={handleSubmit}
      />
    </main>
  );
}
