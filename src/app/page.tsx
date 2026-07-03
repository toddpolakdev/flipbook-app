"use client";
import { gql, useQuery, useMutation } from "@apollo/client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { ActionIcon, Badge, Button } from "@mantine/core";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import styles from "./home.module.css";
import { FlipBook } from "@/types/flipbook";
import FlipbookCard from "@/components/FlipbookCard/FlipbookCard";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { PUBLIC_FLIPBOOKS, MY_FLIPBOOKS } from "./graphql/queries";
import Loader from "@/components/Loader/Loader";

const REORDER_FLIPBOOKS = gql`
  mutation ReorderFlipBooks($ids: [ID!]!) {
    reorderFlipBooks(ids: $ids)
  }
`;

const DELETE_FLIPBOOK = gql`
  mutation DeleteFlipBook($id: ID!) {
    deleteFlipBook(id: $id)
  }
`;

export default function HomePage() {
  const { data: session } = useSession();
  const email = session?.user?.email ?? null;

  const { data: publicData, loading: publicLoading } = useQuery(
    PUBLIC_FLIPBOOKS,
    { fetchPolicy: "cache-and-network" },
  );
  const { data: myData, loading: myLoading } = useQuery(MY_FLIPBOOKS, {
    fetchPolicy: "cache-and-network",
    skip: !email,
  });

  const [myFlipbooks, setMyFlipbooks] = useState<FlipBook[]>([]);
  const [reorderFlipBooks] = useMutation(REORDER_FLIPBOOKS);
  const [deleteFlipBook] = useMutation(DELETE_FLIPBOOK);

  useEffect(() => {
    if (myData?.myFlipbooks) setMyFlipbooks(myData.myFlipbooks);
  }, [myData]);

  // Published flipbooks from everyone, minus the ones I own (shown in "yours").
  const publicList: FlipBook[] = (publicData?.flipBooks ?? []).filter(
    (fb: FlipBook) => !email || fb.userEmail !== email,
  );

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleDragEnd = async (result: any) => {
    if (!result.destination) return;

    const reordered = Array.from(myFlipbooks);
    const [moved] = reordered.splice(result.source.index, 1);
    reordered.splice(result.destination.index, 0, moved);
    setMyFlipbooks(reordered);

    await reorderFlipBooks({ variables: { ids: reordered.map((fb) => fb.id) } });
  };

  const handleDelete = async (fb: FlipBook) => {
    if (
      !window.confirm(
        `Delete "${fb.title || fb.slug}"? This permanently removes the flipbook and its uploaded images.`,
      )
    ) {
      return;
    }

    const previous = myFlipbooks;
    setMyFlipbooks((prev) => prev.filter((f) => f.id !== fb.id));

    try {
      await deleteFlipBook({ variables: { id: fb.id } });
      toast.success("Flipbook deleted.");
    } catch (err) {
      setMyFlipbooks(previous);
      const msg = err instanceof Error ? err.message : "";
      toast.error(
        /not authenticated/i.test(msg)
          ? "Please sign in to delete flipbooks."
          : /not authorized/i.test(msg)
            ? "You can only delete flipbooks you created."
            : "Couldn't delete the flipbook. Please try again.",
      );
    }
  };

  const cardMedia = (fb: FlipBook) =>
    fb.images?.[0] ? (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={fb.images[0]} alt={fb.title} className={styles.thumbnail} />
    ) : (
      <div className={styles.placeholder}>No image</div>
    );

  return (
    <main className={styles.container}>
      {session ? (
        <>
          <div className={styles.sectionHeader}>
            <h1 className={styles.heading}>Your flipbooks</h1>
            <Button
              component={Link}
              href="/flipbook/new"
              leftSection={<Plus size={16} />}>
              New flipbook
            </Button>
          </div>

          {myFlipbooks.length === 0 ? (
            <p className={styles.empty}>
              You haven&apos;t created any flipbooks yet. Start one with{" "}
              <strong>New flipbook</strong>.
            </p>
          ) : (
            <DragDropContext onDragEnd={handleDragEnd}>
              <Droppable droppableId="myFlipbooks" direction="horizontal">
                {(provided) => (
                  <div
                    className={styles.grid}
                    ref={provided.innerRef}
                    {...provided.droppableProps}>
                    {myFlipbooks.map((fb, i) => (
                      <Draggable key={fb.id} draggableId={fb.id} index={i}>
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}>
                            <FlipbookCard index={i}>
                              <div className={styles.mediaWrap}>
                                {cardMedia(fb)}
                                <Badge
                                  className={styles.statusBadge}
                                  variant="light"
                                  color={
                                    fb.status === "published" ? "teal" : "gray"
                                  }>
                                  {fb.status === "published"
                                    ? "Public"
                                    : "Draft"}
                                </Badge>
                              </div>
                              <h2>{fb.title || fb.slug}</h2>
                              <p>{fb.description || "No description available."}</p>
                              <div className={styles.actions}>
                                <Link href={`/flipbook/${fb.slug}`}>View</Link>
                                <Link href={`/flipbook/${fb.slug}/edit`}>
                                  Edit
                                </Link>
                                <ActionIcon
                                  variant="light"
                                  color="red"
                                  size="lg"
                                  onClick={() => handleDelete(fb)}
                                  aria-label={`Delete ${fb.title || fb.slug}`}>
                                  <Trash2 size={16} />
                                </ActionIcon>
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
          )}

          {publicList.length > 0 && (
            <>
              <h2 className={styles.subheading}>Published by others</h2>
              <div className={styles.grid}>
                {publicList.map((fb, i) => (
                  <FlipbookCard key={fb.id} index={i}>
                    <div className={styles.mediaWrap}>{cardMedia(fb)}</div>
                    <h2>{fb.title || fb.slug}</h2>
                    <p>{fb.description || "No description available."}</p>
                    <div className={styles.actions}>
                      <Link href={`/flipbook/${fb.slug}`}>View</Link>
                    </div>
                  </FlipbookCard>
                ))}
              </div>
            </>
          )}
        </>
      ) : (
        <>
          <div className={styles.sectionHeader}>
            <h1 className={styles.heading}>Published flipbooks</h1>
          </div>
          {!publicLoading && publicList.length === 0 ? (
            <p className={styles.empty}>No published flipbooks yet.</p>
          ) : (
            <div className={styles.grid}>
              {publicList.map((fb, i) => (
                <FlipbookCard key={fb.id} index={i}>
                  <div className={styles.mediaWrap}>{cardMedia(fb)}</div>
                  <h2>{fb.title || fb.slug}</h2>
                  <p>{fb.description || "No description available."}</p>
                  <div className={styles.actions}>
                    <Link href={`/flipbook/${fb.slug}`}>View</Link>
                  </div>
                </FlipbookCard>
              ))}
            </div>
          )}
        </>
      )}

      {(publicLoading || myLoading) && <Loader />}
    </main>
  );
}
