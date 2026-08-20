import type { Metadata, Viewport } from 'next';
import './styles.css';

export const metadata: Metadata = {
  title: {
    default: 'Mizant | Real assets. Clear rights. Ethical access.',
    template: '%s | Mizant',
  },
  description:
    'A governance-first platform for understandable, fractional and Shariah-aligned real-asset investment opportunities.',
};

export const viewport: Viewport = {
  themeColor: '#0B2B3C',
  colorScheme: 'light',
};

export default function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
