"use client";

import { useRef, useState } from "react";
import { Upload, X, GripVertical, ImagePlus } from "lucide-react";

type ImageItem = { url: string; alt: string };

interface Props {
  initial: ImageItem[];
}

export function ImageUploader({ initial }: Props) {
  const [images, setImages] = useState<ImageItem[]>(initial);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  async function uploadFile(file: File) {
    setUploading(true);
    setError(null);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Error al subir");
      const alt = file.name.replace(/\.[^.]+$/, "").replace(/[-_]/g, " ");
      setImages((prev) => [...prev, { url: data.url, alt }]);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Error desconocido");
    } finally {
      setUploading(false);
    }
  }

  async function handleFiles(files: FileList | null) {
    if (!files) return;
    for (const file of Array.from(files)) {
      await uploadFile(file);
    }
  }

  function removeImage(idx: number) {
    setImages((prev) => prev.filter((_, i) => i !== idx));
  }

  function updateAlt(idx: number, alt: string) {
    setImages((prev) => prev.map((img, i) => (i === idx ? { ...img, alt } : img)));
  }

  function moveImage(from: number, to: number) {
    setImages((prev) => {
      const arr = [...prev];
      const [item] = arr.splice(from, 1);
      arr.splice(to, 0, item);
      return arr;
    });
  }

  // Serializar para el form hidden
  const serialized = images.map((i) => `${i.url} | ${i.alt}`).join("\n");

  return (
    <div className="space-y-3">
      {/* Hidden field que el form ya lee */}
      <input type="hidden" name="images" value={serialized} />

      {/* Zona de drop */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => { e.preventDefault(); setDragOver(false); handleFiles(e.dataTransfer.files); }}
        onClick={() => fileRef.current?.click()}
        className={`flex cursor-pointer flex-col items-center gap-2 rounded-xl border-2 border-dashed p-6 text-center transition-colors ${
          dragOver ? "border-ink-800 bg-sand-50" : "border-sand-200 hover:border-sand-400"
        }`}
      >
        <ImagePlus className="h-7 w-7 text-sand-400" />
        <span className="text-[13.5px] text-sand-500">
          {uploading ? "Subiendo…" : "Arrastrá imágenes o hacé click para seleccionar"}
        </span>
        <span className="text-[11.5px] text-sand-400">JPG, PNG, WebP · máx. 5 MB por imagen</span>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
      </div>

      {error && <p className="text-[12.5px] text-red-500">{error}</p>}

      {/* Lista de imágenes */}
      {images.length > 0 && (
        <ul className="space-y-2">
          {images.map((img, idx) => (
            <li key={img.url + idx} className="flex items-center gap-3 rounded-xl border border-sand-200 bg-white p-2">
              {/* Drag handle (simple up/down) */}
              <div className="flex flex-col gap-0.5">
                <button
                  type="button"
                  disabled={idx === 0}
                  onClick={() => moveImage(idx, idx - 1)}
                  className="rounded px-1 text-sand-400 hover:text-ink-800 disabled:opacity-20"
                  title="Mover arriba"
                >
                  ▲
                </button>
                <button
                  type="button"
                  disabled={idx === images.length - 1}
                  onClick={() => moveImage(idx, idx + 1)}
                  className="rounded px-1 text-sand-400 hover:text-ink-800 disabled:opacity-20"
                  title="Mover abajo"
                >
                  ▼
                </button>
              </div>

              {/* Preview */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={img.url}
                alt={img.alt}
                className="h-14 w-14 rounded-lg object-cover"
              />

              <div className="flex-1 min-w-0">
                <input
                  type="text"
                  value={img.alt}
                  onChange={(e) => updateAlt(idx, e.target.value)}
                  placeholder="Texto alternativo (Alt)"
                  className="w-full rounded-lg border border-sand-200 px-2 py-1 text-[13px] outline-none focus:border-ink-800"
                />
                <span className="mt-0.5 block truncate text-[11px] text-sand-400">{img.url}</span>
              </div>

              {idx === 0 && (
                <span className="shrink-0 rounded-full bg-volt-100 px-2 py-0.5 text-[11px] font-semibold text-ink-800">
                  Principal
                </span>
              )}

              <button
                type="button"
                onClick={() => removeImage(idx)}
                className="shrink-0 rounded-lg p-1.5 text-sand-400 hover:bg-red-50 hover:text-red-500"
              >
                <X className="h-4 w-4" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
