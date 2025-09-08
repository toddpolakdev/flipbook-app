/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { gql, useQuery, useMutation } from "@apollo/client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import styles from "./edit.module.css";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import PageFlipper from "@/components/PageFlipper";

const FLIPBOOK_BY_ID = gql`
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

const UPDATE_FLIPBOOK = gql`
  mutation UpdateFlipBook($id: ID!, $input: FlipBookInput!) {
    updateFlipBook(id: $id, input: $input)
  }
`;

export default function EditFlipBookPage() {
  // const params = useParams() as { id: string; locale: string; slug: string };

  const { slug, locale } = useParams() as { slug: string; locale: string };

  console.log("slug:", slug);
  console.log("locale:", locale);

  // const slug = params.id;
  // const locale = params.locale;

  const {
    data,
    loading,
    error: flipbookError,
  } = useQuery(FLIPBOOK_BY_ID, {
    variables: { slug },
  });

  console.log("flipbookError: ", flipbookError);
  console.log("data: ", data);

  const [updateFlipBook, { loading: saving, error, data: updated }] =
    useMutation(UPDATE_FLIPBOOK);

  const [form, setForm] = useState<any>(null);

  useEffect(() => {
    if (data?.flipBookBySlug) {
      const fb = data.flipBookBySlug;
      const t = fb.translations.find((t: any) => t.locale === locale) || {};
      setForm({
        slug: fb.slug,
        title: t.title || "",
        description: t.description || "",
        locale: t.locale || "en",
        images: t.images || [],
        width: fb.settings?.width || 400,
        height: fb.settings?.height || 600,
        backgroundColor: fb.settings?.backgroundColor || "#ffffff",
        showPageNumbers: fb.settings?.showPageNumbers ?? true,
      });
    }
  }, [data, locale]);

  if (loading || !form) return <p>Loading…</p>;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleImageAdd = () =>
    setForm({ ...form, images: [...form.images, ""] });

  // const handleImageChange = (i: number, value: string) => {
  //   const updated = [...form.images];
  //   updated[i] = value;
  //   setForm({ ...form, images: updated });
  // };

  // const handleImageRemove = (i: number) =>
  //   setForm({
  //     ...form,
  //     images: form.images.filter((_: any, idx: number) => idx !== i),
  //   });

  // const handleReorder = (i: number, direction: "up" | "down") => {
  //   const updated = [...form.images];
  //   if (direction === "up" && i > 0) {
  //     [updated[i - 1], updated[i]] = [updated[i], updated[i - 1]];
  //   } else if (direction === "down" && i < updated.length - 1) {
  //     [updated[i + 1], updated[i]] = [updated[i], updated[i + 1]];
  //   }
  //   setForm({ ...form, images: updated });
  // };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateFlipBook({
      variables: {
        id: data.flipBookBySlug.id,
        input: {
          slug: form.slug,
          status: "draft",
          tags: [],
          translations: [
            {
              locale: form.locale,
              title: form.title,
              description: form.description,
              images: form.images,
            },
          ],
          settings: {
            width: Number(form.width),
            height: Number(form.height),
            backgroundColor: form.backgroundColor,
            showPageNumbers: form.showPageNumbers,
          },
        },
      },
      refetchQueries: ["FlipBooks"],
    });
  };

  return (
    <main className={styles.container}>
      <h1>Edit Flipbook</h1>

      <div className={styles.editorLayout}>
        <form onSubmit={handleSubmit} className={styles.form}>
          <label>
            Slug
            <input name="slug" value={form.slug} onChange={handleChange} />
          </label>
          <label>
            Title
            <input name="title" value={form.title} onChange={handleChange} />
          </label>
          <label>
            Description
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
            />
          </label>

          <label>
            Width
            <input
              type="number"
              name="width"
              value={form.width}
              onChange={handleChange}
            />
          </label>
          <label>
            Height
            <input
              type="number"
              name="height"
              value={form.height}
              onChange={handleChange}
            />
          </label>
          <label>
            Background Color
            <input
              type="color"
              name="backgroundColor"
              value={form.backgroundColor}
              onChange={handleChange}
            />
          </label>
          <label>
            <input
              type="checkbox"
              name="showPageNumbers"
              checked={form.showPageNumbers}
              onChange={(e) =>
                setForm({ ...form, showPageNumbers: e.target.checked })
              }
            />
            Show Page Numbers
          </label>

          <h2>Pages</h2>
          <DragDropContext
            onDragEnd={(result) => {
              if (!result.destination) return;
              const updated = Array.from(form.images);
              const [moved] = updated.splice(result.source.index, 1);
              updated.splice(result.destination.index, 0, moved);
              setForm({ ...form, images: updated });
            }}>
            <Droppable droppableId="images">
              {(provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef}>
                  {form.images.map((img: string, i: number) => (
                    <Draggable key={i} draggableId={`img-${i}`} index={i}>
                      {(provided) => (
                        <div
                          className={styles.imageRow}
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}>
                          <input
                            type="text"
                            value={img}
                            onChange={(e) => {
                              const updated = [...form.images];
                              updated[i] = e.target.value;
                              setForm({ ...form, images: updated });
                            }}
                            placeholder={`Image URL for page ${i + 1}`}
                          />

                          {img && (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={img}
                              alt={`Page ${i + 1}`}
                              className={styles.thumbnail}
                              onError={(e) => {
                                (
                                  e.currentTarget as HTMLImageElement
                                ).style.display = "none";
                              }}
                            />
                          )}

                          <button
                            type="button"
                            onClick={() =>
                              setForm({
                                ...form,
                                images: form.images.filter(
                                  (_: string, idx: number) => idx !== i
                                ),
                              })
                            }>
                            Remove
                          </button>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
          <button type="button" onClick={handleImageAdd}>
            Add Page
          </button>

          <button type="submit" disabled={saving}>
            {saving ? "Saving…" : "Update Flipbook"}
          </button>
        </form>

        {error && <p className={styles.error}>Error: {error.message}</p>}
        {updated && <p className={styles.success}>✅ Flipbook updated!</p>}

        <aside className={styles.preview}>
          <h2>Preview</h2>
          <PageFlipper
            images={form.images}
            width={Number(form.width)}
            height={Number(form.height)}
            backgroundColor={form.backgroundColor}
            showPageNumbers={form.showPageNumbers}
          />
        </aside>
      </div>
    </main>
  );
}
