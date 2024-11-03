import './globals.css'

export const metadata = {
  title: 'AI Portfolio - Abhishek Panigrahi',
  description: 'Data Scientist & AI Engineer Portfolio',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-black overflow-hidden">{children}</body>
    </html>
  )
}
