import Link from 'next/link';
import { Camera, ShieldCheck, Map } from 'lucide-react';

export default function Navbar() {
  return (
    <nav className="bg-slate-900 text-white p-4 shadow-md sticky top-0 z-50">
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
        <span className="font-bold font-mono text-lg text-blue-400">
          SISTEMA NGR - AUX
        </span>
        <div className="flex gap-4 text-sm font-medium">
          <Link href="/camara" className="flex items-center gap-1 hover:text-blue-400 transition-colors">
            <Camera className="w-4 h-4" /> Fotos ZIP
          </Link>
          <Link href="/qr-supervision" className="flex items-center gap-1 hover:text-blue-400 transition-colors">
            <ShieldCheck className="w-4 h-4" /> Alertas QR
          </Link>
          <Link href="/mapa-taller" className="flex items-center gap-1 hover:text-blue-400 transition-colors">
            <Map className="w-4 h-4" /> Mapa Taller
          </Link>
        </div>
      </div>
    </nav>
  );
}