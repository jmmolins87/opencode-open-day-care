import Link from "next/link";
import { alertStyles, type Kid } from "@/data/mock/kids";
import { ChevronRightIcon } from "@/components/shared/icons";

function parentsLabel(count: number): string {
  if (count === 0) return "sin padres vinculados";
  return count === 1 ? "1 padre vinculado" : `${count} padres vinculados`;
}

function CardBadge({ kid }: { kid: Kid }) {
  if (kid.alerts.length > 0) {
    const style = alertStyles[kid.alerts[0]];
    return (
      <span
        className="flex-none rounded-full px-[9px] py-[5px] text-[11px] font-extrabold"
        style={{ backgroundColor: style.bg, color: style.text }}
      >
        {style.label}
      </span>
    );
  }

  if (kid.parents.length === 0) {
    return (
      <span className="flex-none rounded-full bg-[#F9D2DE] px-[9px] py-[5px] text-[11px] font-extrabold text-[#C56486]">
        VINCULAR
      </span>
    );
  }

  return (
    <ChevronRightIcon
      className="h-[18px] w-[18px] flex-none text-[#CBB89F]"
      strokeWidth={2.2}
    />
  );
}

export default function KidCard({ kid }: { kid: Kid }) {
  return (
    <Link
      href={`/kids/${kid.id}`}
      className="kid flex min-w-0 items-center gap-[14px] rounded-[18px] border border-border bg-surface p-4 shadow-[0_4px_14px_-12px_rgba(120,90,60,.5)] transition duration-150 hover:-translate-y-0.5 hover:border-[#F2A78E]"
    >
      <span
        className="flex h-12 w-12 flex-none items-center justify-center rounded-full font-heading text-[19px] font-semibold"
        style={{ backgroundColor: kid.avatarColor, color: kid.avatarText }}
      >
        {kid.initial}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block font-heading text-[16px] text-ink">
          {kid.name}
        </span>
        <span className="block text-[13px] text-ink-muted">
          {kid.age} · {parentsLabel(kid.parents.length)}
        </span>
      </span>
      <CardBadge kid={kid} />
    </Link>
  );
}
