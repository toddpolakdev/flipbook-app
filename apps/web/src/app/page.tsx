"use client";
import { gql, useQuery, useMutation } from "@apollo/client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import styles from "./home.module.css";
import { FlipBook } from "@/types/flipbook";
import FlipbookCard from "@/components/FlipbookCard/FlipbookCard";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { ALL_FLIPBOOKS, MY_FLIPBOOKS } from "./graphql/queries";

const REORDER_FLIPBOOKS = gql`
  mutation ReorderFlipBooks($ids: [ID!]!) {
    reorderFlipBooks(ids: $ids)
  }
`;

export default function HomePage() {
  const { data: session } = useSession();

  console.log("session", session);

  const { data } = useQuery(session ? MY_FLIPBOOKS : ALL_FLIPBOOKS, {
    fetchPolicy: "no-cache",
  });

  console.log("data", data);

  const [flipbooks, setFlipbooks] = useState<FlipBook[]>([]);

  const [reorderFlipBooks] = useMutation(REORDER_FLIPBOOKS);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleDragEnd = async (result: any) => {
    if (!result.destination) return;

    const reordered = Array.from(flipbooks);
    const [moved] = reordered.splice(result.source.index, 1);
    reordered.splice(result.destination.index, 0, moved);

    setFlipbooks(reordered);

    await reorderFlipBooks({
      variables: { ids: reordered.map((fb) => fb.id) },
    });
  };

  useEffect(() => {
    if (session) {
      if (data?.myFlipbooks) {
        setFlipbooks(data.myFlipbooks);
      }
    } else {
      if (data?.flipBooks) {
        setFlipbooks(data.flipBooks);
      }
    }
  }, [data, session]);

  return (
    <main className={styles.container}>
      <h1 className={styles.heading}></h1>
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="flipbooks" direction="horizontal">
          {(provided) => (
            <div
              className={styles.grid}
              ref={provided.innerRef}
              {...provided.droppableProps}>
              {flipbooks.map((fb: FlipBook, i: number) => (
                <Draggable key={fb.id} draggableId={fb.id} index={i}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}>
                      <FlipbookCard key={fb.id} index={i}>
                        {fb.images?.[0] ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={fb.images[0]}
                            alt={fb.title}
                            className={styles.thumbnail}
                          />
                        ) : (
                          <div className={styles.placeholder}>No image</div>
                        )}

                        <h2>{fb.title || fb.slug}</h2>
                        <p>{fb.description || "No description available."}</p>

                        <div className={styles.actions}>
                          <Link href={`/flipbook/${fb.slug}`}>View</Link>
                          <Link href={`/flipbook/${fb.slug}/edit`}>Edit</Link>
                        </div>
                      </FlipbookCard>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </main>
  );
}
