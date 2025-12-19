export const metadata = {
  title: "Cartoonify",
  description: "Turn photos into realistic cartoon images"
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: "system-ui" }}>
        {children}
      </body>
    </html>
  );
}
