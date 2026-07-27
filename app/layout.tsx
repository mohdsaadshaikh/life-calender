import type React from "react";
import type { Metadata } from "next";
import { Outfit, Fredoka, Space_Mono } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "@/components/ui/toaster";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-sans",
});

const fredoka = Fredoka({
  subsets: ["latin"],
  variable: "--font-display",
});

const spaceMono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "Life Calendar | Visualize Your Life Week by Week",
  description:
    "Map your milestones and moments in a unique timeline. Start your visual journey through time.",
  generator: "v0.app",
};

const clerkAppearance = {
  variables: {
    colorPrimary: "#FF9100",
    colorBackground: "#FAF5E6",
    colorText: "#1a1a1a",
    colorTextSecondary: "#555555",
    colorInputBackground: "#FFFFFF",
    colorInputText: "#000000",
    colorDanger: "#EF4444",
    borderRadius: "12px",
    fontFamily: "'Outfit', sans-serif",
    fontSize: "14px",
  },
  elements: {
    // ── Cards & Containers ──
    card: {
      border: "3px solid #000000",
      // borderRadius: "20px",
      boxShadow: "4px 4px 0px 0px #000000",
      backgroundColor: "#FAF5E6",
    },
    userButtonPopoverCard: {
      border: "3px solid #000000",
      // borderRadius: "20px",
      boxShadow: "4px 4px 0px 0px #000000",
      backgroundColor: "#FAF5E6",
    },
    userProfileCard: {
      border: "3px solid #000000",
      borderRadius: "0",
      boxShadow: "6px 6px 0px 0px #000000",
      backgroundColor: "#FAF5E6",
    },

    // ── Buttons ──
    formButtonPrimary: {
      backgroundColor: "#FF9100",
      color: "#000000",
      border: "3px solid #000000",
      borderRadius: "16px",
      boxShadow: "3px 3px 0px 0px #000000",
      fontWeight: "700",
      transition: "transform 0.1s ease, box-shadow 0.1s ease",
    },
    userButtonPopoverActionButton: {
      // borderRadius: "12px",
      fontWeight: "600",
    },
    userButtonPopoverActionButtonIcon: {
      color: "#FF9100",
    },

    // ── Navigation (UserProfile sidebar) ──
    navbar: {
      // borderRight: "3px solid #000000",
      backgroundColor: "#FAF5E6",
      borderRadius: "0",
    },
    navbarButton: {
      fontWeight: "600",
      // borderRadius: "12px",
    },

    // ── Inputs ──
    formFieldInput: {
      border: "3px solid #000000",
      // borderRadius: "12px",
      backgroundColor: "#FFFFFF",
    },

    // ── Headers ──
    headerTitle: {
      fontWeight: "800",
      fontFamily: "'Fredoka', 'Outfit', sans-serif",
    },
    headerSubtitle: {
      color: "#555555",
    },

    // ── Profile section ──
    profileSectionTitle: {
      // fontWeight: "700",
      // borderBottom: "2px solid #000000",
      // paddingBottom: "8px",
    },
    profileSectionPrimaryButton: {
      color: "#FF9100",
      fontWeight: "700",
    },

    // ── Modal backdrop ──
    modalBackdrop: {
      backgroundColor: "rgba(0, 0, 0, 0.5)",
    },

    // ── Avatar ──
    avatarBox: {
      border: "3px solid #000000",
      boxShadow: "2px 2px 0px 0px #000000",
    },

    // ── Footer ──
    footerAction: {
      fontWeight: "600",
    },
    footerActionLink: {
      color: "#FF9100",
      fontWeight: "700",
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${outfit.variable} ${fredoka.variable} ${spaceMono.variable} font-sans antialiased`}
      >
        <ClerkProvider afterSignOutUrl="/" appearance={clerkAppearance}>
          {children}
          <Toaster />
        </ClerkProvider>
      </body>
    </html>
  );
}
