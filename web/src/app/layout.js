import "./globals.css";

export const metadata = {
  title: "AOFA Template App",
  description: "A production-ready app built with the AOFA stack",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen bg-gray-50 dark:bg-gray-900">
        {children}
      </body>
    </html>
  );
}

