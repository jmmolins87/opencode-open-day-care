import Link from "next/link";
import MobileHeader from "@/components/shared/mobile-header";
import Sidebar from "@/components/shared/sidebar";
import { PlusIcon } from "@/components/shared/icons";
import KidsDirectory from "@/components/kids/kids-directory";
import { kids } from "@/data/mock/kids";

export default function KidsPage() {
  return (
    <div className="min-h-screen bg-page lg:flex">
      <MobileHeader active="/kids" />
      <Sidebar active="/kids" className="hidden lg:flex" />

      <main className="min-w-0 flex-1 lg:h-screen lg:overflow-y-auto">
        <div className="mx-auto w-full max-w-[880px] px-5 pb-20 pt-8 lg:px-10 lg:pt-[34px]">
          <div className="mb-[22px] flex flex-wrap items-end justify-between gap-4">
            <div>
              <div className="mb-1 text-[12.5px] font-extrabold tracking-[.8px] text-accent-strong">
                GESTIÓN
              </div>
              <h1 className="m-0 font-heading text-[30px] font-semibold text-ink">
                Niños
              </h1>
            </div>
            <Link
              href="/kids/nuevo"
              className="flex items-center gap-2 rounded-[14px] bg-gradient-to-b from-btn-start to-btn-end px-[18px] py-[11px] text-[14.5px] font-extrabold text-white shadow-[0_8px_18px_-8px_rgba(238,129,100,.7)]"
            >
              <PlusIcon className="h-[17px] w-[17px]" strokeWidth={2.4} />
              Agregar niño
            </Link>
          </div>

          <KidsDirectory kids={kids} />
        </div>
      </main>
    </div>
  );
}
