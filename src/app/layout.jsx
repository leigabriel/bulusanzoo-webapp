import './globals.css';
import 'react-toastify/dist/ReactToastify.css';

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://bulusanzoo.vercel.app'),
  title: 'Bulusan Zoo',
  description: 'Explore Bulusan Zoo in Calapan. Discover animals, plants, and educational exhibits focused on wildlife conservation and environmental awareness.',
  keywords: ['Bulusan Zoo', 'Calapan Zoo', 'wildlife', 'animals', 'conservation', 'zoo Philippines'],
  authors: [{ name: 'Bulusan Zoo' }],
  icons: { icon: '/bz-url-logo.png', apple: '/bz-url-logo.png' },
  openGraph: {
    type: 'website',
    siteName: 'Bulusan Zoo',
    title: 'Bulusan Zoo',
    description: 'Explore Bulusan Zoo in Calapan. Discover animals, plants, and conservation exhibits.',
    images: ['/bulusan.webp']
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Bulusan Zoo',
    description: 'Explore Bulusan Zoo in Calapan. Discover animals, plants, and conservation exhibits.',
    images: ['/bulusan.webp']
  }
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#05df72'
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css" crossOrigin="anonymous" referrerPolicy="no-referrer" />
        <meta name="msapplication-navbutton-color" content="#05df72" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
      </head>
      <body>{children}</body>
    </html>
  );
}
