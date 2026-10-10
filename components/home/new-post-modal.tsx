"use client";

import { useEffect, useRef, useState } from "react";
import { kids } from "@/data/mock/kids";
import type { PostKind } from "@/data/mock/posts";
import { CloseIcon, PlusIcon } from "@/components/shared/icons";

export interface NewPostFormValues {
  kind: PostKind;
  kidIds: number[];
  body: string;
  photos: string[];
}

const MAX_PHOTOS = 5;

const kindOptions: {
  kind: PostKind;
  label: string;
  activeBg: string;
  activeFg: string;
}[] = [
  { kind: "meal", label: "Comida", activeBg: "#9A7B1E", activeFg: "#FFFFFF" },
  { kind: "nap", label: "Siesta", activeBg: "#E7DCF6", activeFg: "#7B5FC0" },
  {
    kind: "activity",
    label: "Actividad",
    activeBg: "#2E89A6",
    activeFg: "#FFFFFF",
  },
  {
    kind: "achievement",
    label: "Logro",
    activeBg: "#CFEBD8",
    activeFg: "#3E9B6C",
  },
  { kind: "mood", label: "Ánimo", activeBg: "#F9D2DE", activeFg: "#C56486" },
  { kind: "photo", label: "Foto", activeBg: "#FBD8CC", activeFg: "#D9684A" },
  {
    kind: "announcement",
    label: "Anuncio",
    activeBg: "#CCD8F4",
    activeFg: "#4E72C8",
  },
];

const chipIdle =
  "border-[1.5px] border-[#ECE0D0] bg-[#FFFDF9] text-[#6E6359]";

const labelClassName =
  "mb-2 text-[12px] font-extrabold tracking-[.7px] text-ink-soft";

export default function NewPostModal({
  onClose,
  onSave,
}: {
  onClose: () => void;
  onSave: (values: NewPostFormValues) => void;
}) {
  const [kind, setKind] = useState<PostKind>("meal");
  const [selectedKidIds, setSelectedKidIds] = useState<number[]>([kids[0].id]);
  const [body, setBody] = useState("");
  const [photos, setPhotos] = useState<string[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  const createdUrlsRef = useRef<string[]>([]);
  const publishedRef = useRef(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
      if (!publishedRef.current) {
        createdUrlsRef.current.forEach((url) => URL.revokeObjectURL(url));
      }
    };
  }, [onClose]);

  const canPublish = body.trim().length > 0 && selectedKidIds.length > 0;
  const allKidsSelected = selectedKidIds.length === kids.length;

  function appendPhotos(files: FileList) {
    const images = Array.from(files).filter((file) =>
      file.type.startsWith("image/"),
    );
    if (images.length === 0) return;
    setPhotos((prev) => {
      const slots = MAX_PHOTOS - prev.length;
      if (slots <= 0) return prev;
      const newUrls = images
        .slice(0, slots)
        .map((file) => URL.createObjectURL(file));
      createdUrlsRef.current.push(...newUrls);
      return [...prev, ...newUrls];
    });
  }

  function removePhoto(url: string) {
    URL.revokeObjectURL(url);
    createdUrlsRef.current = createdUrlsRef.current.filter(
      (item) => item !== url,
    );
    setPhotos((prev) => prev.filter((item) => item !== url));
  }

  function handlePublish() {
    if (!canPublish) return;
    publishedRef.current = true;
    onSave({ kind, kidIds: selectedKidIds, body: body.trim(), photos });
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Nueva publicación"
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-[rgba(63,54,46,.45)] px-6 py-10"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-[580px] overflow-hidden rounded-[24px] border border-[#ECE0D0] bg-[#FBF4EC] shadow-[0_20px_50px_-24px_rgba(63,54,46,.35)]">
        <div className="flex items-center justify-between border-b border-[#ECE0D0] px-[26px] py-5">
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer text-[15px] font-bold text-ink-soft"
          >
            Cancelar
          </button>
          <span className="font-heading text-[18px] font-semibold text-ink">
            Nueva publicación
          </span>
          <button
            type="button"
            onClick={handlePublish}
            disabled={!canPublish}
            className={
              canPublish
                ? "cursor-pointer text-[15px] font-extrabold text-accent-strong"
                : "cursor-default text-[15px] font-extrabold text-[#B6A99B]"
            }
          >
            Publicar
          </button>
        </div>

        <div className="px-[26px] py-6">
          <div className={labelClassName}>PARA</div>
          <div className="mb-[22px] flex flex-wrap gap-[9px]">
            {kids.map((kid) => {
              const isActive = selectedKidIds.includes(kid.id);
              return (
                <button
                  key={kid.id}
                  type="button"
                  onClick={() =>
                    setSelectedKidIds((prev) =>
                      prev.includes(kid.id)
                        ? prev.filter((id) => id !== kid.id)
                        : [...prev, kid.id],
                    )
                  }
                  className={`flex cursor-pointer items-center gap-2 rounded-full px-[14px] py-[6px] pl-[6px] text-[14px] font-bold ${
                    isActive
                      ? "border-[1.5px] border-[#3F362E] bg-[#3F362E] text-white"
                      : chipIdle
                  }`}
                >
                  <span
                    className="flex h-[26px] w-[26px] items-center justify-center rounded-full font-heading text-[13px] font-semibold"
                    style={{
                      background: kid.avatarColor,
                      color: kid.avatarText,
                    }}
                  >
                    {kid.initial}
                  </span>
                  {kid.name.split(" ")[0]}
                </button>
              );
            })}
            <button
              type="button"
              onClick={() =>
                setSelectedKidIds(
                  allKidsSelected ? [] : kids.map((item) => item.id),
                )
              }
              className={`cursor-pointer rounded-full px-[16px] py-[6px] text-[14px] font-bold ${
                allKidsSelected
                  ? "border-[1.5px] border-[#3F362E] bg-[#3F362E] text-white"
                  : chipIdle
              }`}
            >
              Seleccionar todos
            </button>
          </div>

          <div className={labelClassName}>TIPO</div>
          <div className="mb-[22px] flex flex-wrap gap-[9px]">
            {kindOptions.map((option) => {
              const isActive = kind === option.kind;
              return (
                <button
                  key={option.kind}
                  type="button"
                  onClick={() => setKind(option.kind)}
                  className={`cursor-pointer rounded-full px-[16px] py-2 text-[13.5px] font-extrabold ${
                    isActive ? "" : chipIdle
                  }`}
                  style={
                    isActive
                      ? { background: option.activeBg, color: option.activeFg }
                      : undefined
                  }
                >
                  {option.label}
                </button>
              );
            })}
          </div>

          <div className={labelClassName}>DESCRIPCIÓN</div>
          <textarea
            value={body}
            onChange={(event) => setBody(event.target.value)}
            placeholder="Contá cómo le fue hoy…"
            className="mb-[22px] min-h-[120px] w-full resize-y rounded-[14px] border-[1.5px] border-[#EADFD0] bg-white px-4 py-[14px] text-[15px] leading-[1.5] text-ink outline-none placeholder:text-[#B6A99B]"
          />

          <div className={labelClassName}>FOTOS</div>
          <div
            onDragOver={(event) => {
              event.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={(event) => {
              event.preventDefault();
              setIsDragging(false);
              if (event.dataTransfer.files.length > 0) {
                appendPhotos(event.dataTransfer.files);
              }
            }}
            className={`flex gap-3 rounded-[14px] p-1 ${
              isDragging ? "bg-[#F4ECE1] ring-2 ring-[#D9583C]" : ""
            }`}
          >
            {photos.map((url) => (
              <div
                key={url}
                className="relative h-[96px] w-[96px] overflow-hidden rounded-[14px] border border-[#ECE0D0]"
              >
                <img
                  src={url}
                  alt="Foto adjunta"
                  className="h-full w-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => removePhoto(url)}
                  aria-label="Quitar foto"
                  className="absolute right-1 top-1 flex h-5 w-5 cursor-pointer items-center justify-center rounded-full bg-[rgba(63,54,46,.75)] text-white"
                >
                  <CloseIcon className="h-3 w-3" strokeWidth={2.6} />
                </button>
              </div>
            ))}
            {photos.length < MAX_PHOTOS && (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex h-[96px] w-[96px] cursor-pointer flex-col items-center justify-center gap-1.5 rounded-[14px] border-[1.5px] border-dashed border-[#DBCDBA] bg-[#F4ECE1] text-[#B0A290]"
              >
                <PlusIcon
                  className="h-[22px] w-[22px] text-[#C5503A]"
                  strokeWidth={2}
                />
                <span className="text-[12px]">Agregar</span>
              </button>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={(event) => {
                if (event.target.files) appendPhotos(event.target.files);
                event.target.value = "";
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
