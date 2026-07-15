import './globals.css';
import { QueryProvider } from '../components/providers/query-provider';

export const metadata = {
  title: 'Crypto-Pro-AI',
  description: 'Professional cryptocurrency analysis and trading intelligence.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en"><body><QueryProvider>{children}</QueryProvider></body></html>;
}
