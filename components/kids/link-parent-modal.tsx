"use client";

import { useEffect, useState } from "react";
import type { Kid } from "@/data/mock/kids";
import { invite } from "@/data/mock/auth";
import { CloseIcon, InfoIcon, SendIcon } from "@/components/shared/icons";

export type ParentRelation = "Mamá" | "Papá" | "Tutor/a";

export interface LinkParentFormValues {
  name: string;
  email: string;
  relation: ParentRelation;
}

const relations: readonly ParentRelation[] = ["Mamá", "Papá", "Tutor/a"];

const inputClassName =
  "w-full rounded-[14px] border-[1.5px] border-[#EADFD0] bg-white px-4 py-[13px] text-[15px] text-ink outline-none placeholder:text-[#B6A99B]";

const labelClassName =
  "mb-2 text-[12px] font-extrabold tracking-[.7px] text-ink-soft";

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export default function LinkParentModal({
  kid,
  onClose,
  onSend,
}: {
  kid: Kid;
  onClose: () => void;
  onSend: (values: LinkParentFormValues) => void;
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [relation, setRelation] = useState<ParentRelation>("Mamá");

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

  const canSend =
    name.trim().length > 0 && isValidEmail(email.trim()) && relation.length > 0;

  function handleSend() {
    if (!canSend) return;
    onSend({ name: name.trim(), email: email.trim(), relation });
  }

  const kidFirstName = kid.name.split(" ")[0];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Vincular padre"
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-[rgba(63,54,46,.45)] px-6 py-10"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-[480px] overflow-hidden rounded-[24px] border border-border bg-[#FBF4EC] shadow-[0_20px_50px_-24px_rgba(63,54,46,.35)]">
        <div className="flex items-center justify-between border-b border-border px-[26px] py-5">
          <div>
            <div className="font-heading text-[18px] font-semibold text-ink">
              Vincular padre
            </div>
            <div className="text-[13px] text-ink-muted">a {kid.name}</div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar"
            className="flex h-[34px] w-[34px] flex-none cursor-pointer items-center justify-center rounded-[10px] bg-border-soft text-ink-soft"
          >
            <CloseIcon className="h-[18px] w-[18px]" strokeWidth={2.2} />
          </button>
        </div>

        <div className="px-[26px] py-[22px]">
          <div className="mb-5 flex gap-[11px] rounded-[14px] bg-[#E3ECFB] px-4 py-[13px]">
            <InfoIcon
              className="mt-px h-5 w-5 flex-none text-[#4E72C8]"
              strokeWidth={2}
            />
            <span className="text-[13.5px] leading-[1.45] text-[#3F5694]">
              Le enviaremos un correo con un código para que active su cuenta.
              Solo verá el feed de {kidFirstName}.
            </span>
          </div>

          <div className={labelClassName}>NOMBRE DEL PADRE/MADRE</div>
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Ej. Diego Fernández"
            required
            aria-required="true"
            className={`mb-[18px] ${inputClassName}`}
          />

          <div className={labelClassName}>EMAIL</div>
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="correo@ejemplo.com"
            required
            aria-required="true"
            className={`mb-[18px] ${inputClassName}`}
          />

          <div className="mb-[10px] text-[12px] font-extrabold tracking-[.7px] text-ink-soft">
            PARENTESCO
          </div>
          <div className="mb-5 flex gap-[9px]">
            {relations.map((option) => {
              const active = relation === option;
              return (
                <button
                  key={option}
                  type="button"
                  onClick={() => setRelation(option)}
                  className={`flex-1 cursor-pointer rounded-full border-[1.5px] px-[11px] py-[11px] text-[14px] font-extrabold ${
                    active
                      ? "border-[#9FB8EC] bg-[#CCD8F4] text-[#4E72C8]"
                      : "border-border bg-surface text-nav-inactive"
                  }`}
                >
                  {option}
                </button>
              );
            })}
          </div>

          <div className="mb-5 rounded-[16px] border-[1.5px] border-dashed border-[#E6D08A] bg-[#FBF1D6] px-[18px] py-[18px] text-center">
            <div className="mb-2 text-[12px] font-extrabold tracking-[.7px] text-[#A88526]">
              CÓDIGO DE INVITACIÓN
            </div>
            <div className="font-heading text-[34px] font-semibold tracking-[7px] text-[#8A7234]">
              {invite.code}
            </div>
            <div className="mt-[6px] text-[13px] text-[#A88526]">
              Vence en 7 días
            </div>
          </div>

          <button
            type="button"
            onClick={handleSend}
            disabled={!canSend}
            className="flex w-full cursor-pointer items-center justify-center gap-[9px] rounded-[14px] bg-gradient-to-b from-btn-start to-btn-end py-[14px] text-[15.5px] font-extrabold text-white shadow-[0_10px_22px_-8px_rgba(238,129,100,.7)] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <SendIcon className="h-[19px] w-[19px]" strokeWidth={2} />
            Enviar invitación
          </button>
        </div>
      </div>
    </div>
  );
}
