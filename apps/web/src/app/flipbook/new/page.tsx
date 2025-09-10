"use client";
import { gql, useMutation } from "@apollo/client";
import { useRouter } from "next/navigation";
import styles from "./new.module.css";
import FlipbookForm, {
  defaultFlipbookValues,
  FlipbookFormValues,
} from "@/components/FlipbookForm/FlipbookForm";

const CREATE_FLIPBOOK = gql`
  mutation CreateFlipBook($input: FlipBookInput!) {
    createFlipBook(input: $input) {
      id
      slug
    }
  }
`;

export default function NewFlipBookPage() {
  const router = useRouter();

  const [createFlipBook] = useMutation(CREATE_FLIPBOOK);

  const handleSubmit = async (values: FlipbookFormValues) => {
    const res = await createFlipBook({
      variables: {
        input: {
          slug: values.slug,
          status: "draft",
          tags: [],
          title: values.title,
          description: values.description,
          images: values.images,
          settings: values.settings,
        },
      },
    });

    const newSlug = res.data?.createFlipBook.slug;

    if (newSlug) {
      router.push(`/flipbook/${newSlug}/edit`);
    } else {
      router.push(`/`);
    }
  };

  return (
    <main className={styles.container}>
      <h1>New Flipbook</h1>
      <FlipbookForm
        initialValues={defaultFlipbookValues}
        onSubmit={handleSubmit}
      />
    </main>
  );
}
