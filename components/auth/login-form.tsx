"use client";

import Link from "next/link";

export default function LoginForm() {
  return (
    <div className="flex items-center justify-center p-10">
      <div className="w-full max-w-[392px]">
        <h2 className="m-0 mb-[6px] font-heading text-[30px] font-semibold text-ink">
          Iniciar sesión
        </h2>
        <p className="m-0 mb-7 text-[15px] text-ink-soft">
          Ingresa para ver el día de hoy.
        </p>

        <div className="mb-2 text-[12px] font-bold tracking-[.7px] text-ink-soft">
          EMAIL
        </div>
        <input
          type="email"
          placeholder="caro@opendaycare.com"
          className="mb-[18px] w-full rounded-[14px] border-[1.5px] border-[#EADFD0] bg-white px-4 py-[14px] text-[15px] text-ink outline-none placeholder:text-[#B6A99B]"
        />
        <div className="mb-2 text-[12px] font-bold tracking-[.7px] text-ink-soft">
          CONTRASEÑA
        </div>
        <input
          type="password"
          placeholder="••••••••"
          className="mb-[10px] w-full rounded-[14px] border-[1.5px] border-[#EADFD0] bg-white px-4 py-[14px] text-[15px] text-ink outline-none placeholder:text-[#B6A99B]"
        />
        <div className="mb-5 text-right">
          <span className="cursor-default text-[13.5px] font-bold text-accent-link">
            ¿Olvidaste tu contraseña?
          </span>
        </div>

        <Link
          href="/"
          className="block w-full rounded-[15px] bg-gradient-to-b from-btn-start to-btn-end py-[15px] text-center text-[16px] font-extrabold text-white shadow-[0_10px_22px_-8px_rgba(238,129,100,.7)]"
        >
          Iniciar sesión
        </Link>

        <p className="m-0 mt-6 text-center text-[14.5px] text-ink-soft">
          ¿Te invitó la guardería?{" "}
          <Link href="/activate-account" className="font-extrabold text-accent-link">
            Activa tu cuenta
          </Link>
        </p>
      </div>
    </div>
  );
}
