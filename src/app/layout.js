"use client";
import { ApolloWrapper } from "@/providers";
import { AuthProvider } from "./context/AuthContext";
import { theme } from "../../theme/theme";
import "./globals.css";

import { ThemeProvider } from "styled-components";
import AlertMessage from "./components/AlertMessage/AlertMessage";
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ApolloWrapper>
            <AuthProvider>
            <AlertMessage />
            <ThemeProvider theme={theme}>{children}</ThemeProvider>
          </AuthProvider>
        </ApolloWrapper>
      </body>
    </html>
  );
}
