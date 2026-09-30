import "./globals.css";
import Link from "next/link";

export const metadata = {
  title: "sixtieth — the hour on the desk",
  description: "A living desk that turns over every hour. Public notes stay on the wall."
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600&family=IBM+Plex+Sans:wght@400;500&family=Source+Serif+4:opsz,wght@8..60,400;8..60,500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <div className="grain" />
        <div className="wrap">
          <header className="top">
            <Link href="/" className="mark">
              sixtieth
              <small>the hour, held open</small>
            </Link>
            <nav className="links">
              <Link href="/">Hour</Link>
              <Link href="/wall">Wall</Link>
              <Link href="/desk">Desk</Link>
              <Link href="/login">Enter</Link>
            </nav>
          </header>
          {children}
          <footer>Printed for the current hour. Drafts stay yours. Public slips go on the wall.</footer>
        </div>
      </body>
    </html>
  );
}
