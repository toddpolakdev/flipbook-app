import ApolloWrapper from "../../components/ApolloProvider";
import { MantineProvider, createTheme } from "@mantine/core";
import "@mantine/core/styles.css";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import NavBar from "@/components/Navbar/Navbar";
import { Toaster } from "sonner";
import Providers from "../../components/SessionProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Flipbook",
  description: "Create and share page-flip flipbooks.",
};

const flipbookTheme = createTheme({
  fontFamily:
    "system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif",

  headings: {
    fontFamily:
      "system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif",
    fontWeight: "600",
  },

  primaryColor: "flipbookBlue", // used by buttons, switches, highlights
  defaultRadius: "md", // consistent rounded corners

  colors: {
    // Accent — muted slate indigo (toned down from the old bright blue)
    flipbookBlue: [
      "#eef0f6", // 0 – lightest
      "#d9deea",
      "#b6c0d5",
      "#909ebd",
      "#7181a4",
      "#556791", // 5 – main
      "#47587f",
      "#3a4867",
      "#2f3a52",
      "#252d3f", // 9 – darkest
    ],

    // Neutral palette (matches your current gray backgrounds/borders)
    softGray: [
      "#f9fafb", // background
      "#f3f4f6", // panels
      "#e5e7eb", // borders
      "#d1d5db",
      "#9ca3af", // muted text
      "#6b7280",
      "#4b5563",
      "#374151",
      "#1f2937",
      "#111827", // darkest text
    ],
  },

  // Default props for consistent look
  components: {
    Button: {
      defaultProps: {
        radius: "md",
        size: "sm",
      },
    },
    Card: {
      defaultProps: {
        shadow: "sm",
        radius: "md",
        padding: "md",
        withBorder: true,
      },
    },
    TextInput: {
      defaultProps: {
        radius: "md",
        size: "sm",
      },
    },
    NumberInput: {
      defaultProps: {
        radius: "md",
        size: "sm",
      },
    },
    Select: {
      defaultProps: {
        radius: "md",
        size: "sm",
      },
    },
    Textarea: {
      defaultProps: {
        radius: "md",
        size: "sm",
        autosize: true,
        minRows: 3,
      },
    },
    Switch: {
      defaultProps: {
        radius: "xl",
        size: "lg",
        color: "flipbookBlue",
      },
    },
    Accordion: {
      defaultProps: {
        radius: "md",
        variant: "contained",
      },
    },
  },
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <ApolloWrapper>
          <MantineProvider defaultColorScheme="light" theme={flipbookTheme}>
            <Providers>
              <NavBar />
              {children}
            </Providers>
            <Toaster position="top-right" richColors closeButton />
          </MantineProvider>
        </ApolloWrapper>
      </body>
    </html>
  );
}
