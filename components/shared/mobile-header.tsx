import Link from "next/link";
import { MenuIcon, SunIcon } from "./icons";

interface MobileHeaderProps {
  onMenuClick: () => void;
}

export default function MobileHeader({ onMenuClick }: MobileHeaderProps) {
  return (
    <header className="sticky top-0 z-40 flex items-center justify-between border-b border-border bg-surface px-4 py-3 lg:hidden">
      <Link href="/" className="flex items-center gap-2.5">
        <span className="flex h-8 w-8 flex-none items-center justify-center rounded-[10px] bg-[linear-gradient(155deg,#F8C3A8,#F2937A)]">
          <SunIcon className="h-[18px] w-[18px] text-white" strokeWidth={2.2} />
        </span>
        <span className="font-heading text-[15px] font-semibold text-ink">
          OpenDayCare
        </span>
      </Link>

      <button
        type="button"
        onClick={onMenuClick}
        aria-label="Abrir menú"
        className="flex h-10 w-10 items-center justify-center rounded-[10px] bg-page text-ink-soft"
      >
        <MenuIcon className="h-5 w-5" />
      </button>
    </header>
  );
}
