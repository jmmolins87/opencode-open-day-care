"use client";

import { useEffect, useState } from "react";
import { rooms } from "@/data/mock/kids";
import { ChevronDownIcon } from "@/components/shared/icons";

export interface AddKidFormValues {
  name: string;
  birthDate: string;
  room: string;
  allergies: string;
  notes: string;
}

function formatBirthDate(raw: string): string {
  const digits = raw.replace(/\D/g, "").slice(0, 8);
  const parts = [
    digits.slice(0, 2),
    digits.slice(2, 4),
    digits.slice(4, 8),
  ].filter(Boolean);
  return parts.join("/");
}

function isValidBirthDate(value: string): boolean {
  const match = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(value);
  if (!match) return false;
  const day = Number(match[1]);
  const month = Number(match[2]);
  const year = Number(match[3]);
  if (month < 1 || month > 12 || day < 1 || year < 1900) return false;
  const date = new Date(year, month - 1, day);
  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return false;
  }
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return date <= today;
}

const inputClassName =
  "w-full rounded-[14px] border-[1.5px] border-[#EADFD0] bg-white px-4 py-[13px] text-[15px] text-ink outline-none placeholder:text-[#B6A99B]";

const labelClassName =
  "mb-2 text-[12px] font-extrabold tracking-[.7px] text-ink-soft";

export default function AddKidModal({
  onClose,
  onSave,
}: {
  onClose: () => void;
  onSave: (values: AddKidFormValues) => void;
}) {
  const [name, setName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [room, setRoom] = useState<string>(rooms[0]);
  const [allergies, setAllergies] = useState("");
  const [notes, setNotes] = useState("");

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
    };
  }, [onClose]);

  const dateInvalid = birthDate.length > 0 && !isValidBirthDate(birthDate);
  const canSave = name.trim().length > 0 && isValidBirthDate(birthDate);

  function handleSave() {
    if (!canSave) return;
    onSave({
      name: name.trim(),
      birthDate,
      room,
      allergies: allergies.trim(),
      notes: notes.trim(),
    });
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Agregar niño"
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-[rgba(63,54,46,.45)] px-6 py-10"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-[520px] overflow-hidden rounded-[24px] border border-border bg-[#FBF4EC] shadow-[0_20px_50px_-24px_rgba(63,54,46,.35)]">
        <div className="flex items-center justify-between border-b border-border px-[26px] py-5">
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer text-[15px] font-bold text-ink-soft"
          >
            Cancelar
          </button>
          <span className="font-heading text-[18px] font-semibold text-ink">
            Agregar niño
          </span>
          <button
            type="button"
            onClick={handleSave}
            disabled={!canSave}
            className={
              canSave
                ? "cursor-pointer text-[15px] font-extrabold text-accent-strong"
                : "cursor-default text-[15px] font-extrabold text-[#B6A99B]"
            }
          >
            Guardar
          </button>
        </div>

        <div className="px-[26px] py-6">
          <div className={labelClassName}>NOMBRE COMPLETO</div>
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Ej. Martina López"
            className={`mb-[18px] ${inputClassName}`}
          />

          <div className="mb-[18px] flex gap-[14px]">
            <div className="min-w-0 flex-1">
              <div className={labelClassName}>FECHA DE NACIMIENTO</div>
              <input
                value={birthDate}
                onChange={(event) =>
                  setBirthDate(formatBirthDate(event.target.value))
                }
                placeholder="dd/mm/aaaa"
                inputMode="numeric"
                aria-invalid={dateInvalid}
                className={`${inputClassName} ${
                  dateInvalid ? "border-[#D9583C]" : ""
                }`}
              />
              {dateInvalid && (
                <p className="m-0 mt-1 text-[12px] text-accent-strong">
                  Fecha no válida
                </p>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <div className={labelClassName}>SALA</div>
              <div className="relative">
                <select
                  value={room}
                  onChange={(event) => setRoom(event.target.value)}
                  className={`${inputClassName} appearance-none pr-10 font-bold`}
                >
                  {rooms.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
                <ChevronDownIcon
                  className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#B0A290]"
                  strokeWidth={2.2}
                />
              </div>
            </div>
          </div>

          <div className={labelClassName}>ALERGIAS (ETIQUETAS)</div>
          <input
            value={allergies}
            onChange={(event) => setAllergies(event.target.value)}
            placeholder="Ej. Maní, Lactosa"
            className={`mb-[18px] ${inputClassName}`}
          />

          <div className={labelClassName}>NOTAS MÉDICAS</div>
          <textarea
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
            placeholder="Indicaciones, medicación, contactos…"
            className={`${inputClassName} min-h-[90px] resize-y leading-[1.5]`}
          />
        </div>
      </div>
    </div>
  );
}
