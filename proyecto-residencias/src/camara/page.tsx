'use client';

import React, { useState } from 'react';
import imageCompression from 'browser-image-compression';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { Camera, Download } from 'lucide-react';

interface FotoCapturada {
  file: File;
  previewUrl: string;
  etapa: '01_Ingreso' | '02_Proceso' | '03_Terminado';
  pesoOriginalKB: number;
  pesoComprimidoKB: number;
}

export default function ModuloCamara() {
  const [numeroEconomico, setNumeroEconomico] = useState('');
  const [etapaActual, setEtapaActual] = useState<'01_Ingreso' | '02_Proceso' | '03_Terminado'>('01_Ingreso');
  const [fotos, setFotos] = useState<FotoCapturada[]>([]);
  const [procesando, setProcesando] = useState(false);

  const capturarYComprimir = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    setProcesando(true);

    const archivoOriginal = e.target.files[0];
    const pesoOriginal = Math.round(archivoOriginal.size / 1024);

    const opciones = {
      maxSizeMB: 0.4,
      maxWidthOrHeight: 1920,
      useWebWorker: true,
    };

    try {
      const archivoComprimido = await imageCompression(archivoOriginal, opciones);
      const pesoComprimido = Math.round(archivoComprimido.size / 1024);

      const nuevaFoto: FotoCapturada = {
        file: archivoComprimido,
        previewUrl: URL.createObjectURL(archivoComprimido),
        etapa: etapaActual,
        pesoOriginalKB: pesoOriginal,
        pesoComprimidoKB: pesoComprimido,
      };

      setFotos((prev) => [...prev, nuevaFoto]);
    } catch (error) {
      console.error('Error al comprimir la imagen:', error);
      alert('Error procesando la imagen');
    } finally {
      setProcesando(false);
    }
  };

  const descargarPaqueteZip = async () => {
    if (!numeroEconomico) {
      alert('Por favor ingresa el Número Económico de la unidad');
      return;
    }

    const zip = new JSZip();
    const carpetaRaiz = zip.folder(numeroEconomico.toUpperCase()) || zip;

    fotos.forEach((foto, index) => {
      const nombreArchivo = `${numeroEconomico}_${foto.etapa}_${index + 1}.jpg`;
      carpetaRaiz.folder(foto.etapa)?.file(nombreArchivo, foto.file);
    });

    const contenidoZip = await zip.generateAsync({ type: 'blob' });
    saveAs(contenidoZip, `EXPEDIENTE_${numeroEconomico.toUpperCase()}.zip`);
  };

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
        <Camera className="text-blue-600" /> Captura y Compresión Fotográfica
      </h1>

      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-4">
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">
            Número Económico / Placas del Tractocamión
          </label>
          <input
            type="text"
            placeholder="Ej. ECO-402"
            value={numeroEconomico}
            onChange={(e) => setNumeroEconomico(e.target.value)}
            className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-slate-800 font-mono"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Etapa Fotográfica Actual
          </label>
          <div className="grid grid-cols-3 gap-2">
            {(['01_Ingreso', '02_Proceso', '03_Terminado'] as const).map((etapa) => (
              <button
                key={etapa}
                type="button"
                onClick={() => setEtapaActual(etapa)}
                className={`p-2.5 text-xs sm:text-sm font-semibold rounded-lg border transition-all ${
                  etapaActual === etapa
                    ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {etapa.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>

        <div className="pt-2">
          <label className="flex flex-col items-center justify-center border-2 border-dashed border-slate-300 rounded-xl p-6 cursor-pointer hover:border-blue-500 hover:bg-blue-50/50 transition-all">
            <Camera className="w-10 h-10 text-slate-400 mb-2" />
            <span className="text-sm font-medium text-slate-700">
              {procesando ? 'Comprimiendo imagen...' : 'Tomar Foto o Seleccionar de Galería'}
            </span>
            <span className="text-xs text-slate-400 mt-1">
              Las fotos se comprimen automáticamente en segundo plano
            </span>
            <input
              type="file"
              accept="image/*"
              capture="environment"
              onChange={capturarYComprimir}
              disabled={procesando}
              className="hidden"
            />
          </label>
        </div>
      </div>

      {fotos.length > 0 && (
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-bold text-slate-800">
              Fotos Procesadas ({fotos.length})
            </h2>
            <button
              onClick={descargarPaqueteZip}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
            >
              <Download className="w-4 h-4" /> Descargar Paquete ZIP
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {fotos.map((foto, idx) => (
              <div key={idx} className="relative border rounded-lg overflow-hidden bg-slate-50">
                <img
                  src={foto.previewUrl}
                  alt={`Foto ${idx}`}
                  className="w-full h-32 object-cover"
                />
                <div className="p-2 text-xs space-y-1">
                  <span className="font-semibold text-blue-600 block">
                    {foto.etapa.replace('_', ' ')}
                  </span>
                  <div className="flex justify-between text-slate-500">
                    <span className="line-through">{foto.pesoOriginalKB} KB</span>
                    <span className="font-bold text-green-600">{foto.pesoComprimidoKB} KB</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}