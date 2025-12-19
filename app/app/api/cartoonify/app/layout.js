export const metadata = {
  title: "Cartoonify",
  description: "Turn photos into realistic cartoon portraits"
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ margin: 0 }}>{children}</body>
    </html>
  );
}
