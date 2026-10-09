import Link from "next/link";
import MobileHeader from "@/components/shared/mobile-header";
import Sidebar from "@/components/shared/sidebar";
import { CameraIcon } from "@/components/shared/icons";
import { PostList } from "@/components/home/post-card";
import { user } from "@/data/mock/user";

export default function Home() {
  const firstName = user.name.split(" ")[0];

  return (
    <div className="min-h-screen bg-page lg:flex">
      <MobileHeader active="/" />
      <Sidebar active="/" className="hidden lg:flex" />

      <main className="min-w-0 flex-1 lg:h-screen lg:overflow-y-auto">
        <div className="mx-auto w-full max-w-[760px] px-5 pb-20 pt-8 lg:px-10 lg:pt-[34px]">
          <div className="mb-6">
            <div className="mb-1 text-[12.5px] font-extrabold tracking-[.8px] text-accent-strong">
              GUARDERÍA · SALA {user.room.toUpperCase()}
            </div>
            <h1 className="m-0 font-heading text-[30px] font-semibold text-ink">
              Buenas, {firstName}
            </h1>
            <p className="mt-[5px] text-[14.5px] text-ink-soft">
              12 niños · martes 17 jun
            </p>
          </div>

          <Link
            href="/create-post"
            className="mb-6 flex items-center gap-[14px] rounded-[18px] border border-border bg-surface px-[18px] py-[14px] shadow-[0_4px_14px_-10px_rgba(120,90,60,.4)]"
          >
            <span className="flex h-10 w-10 flex-none items-center justify-center rounded-full bg-accent font-heading text-[16px] font-semibold text-white">
              {user.initial}
            </span>
            <span className="flex-1 text-[15px] text-ink-muted">
              Compartí un momento…
            </span>
            <span className="flex h-[38px] w-[38px] flex-none items-center justify-center rounded-xl bg-accent-active-bg text-accent-action">
              <CameraIcon className="h-[19px] w-[19px]" />
            </span>
          </Link>

          <div className="mb-[14px] flex items-center gap-[14px]">
            <span className="text-[12.5px] font-extrabold tracking-[.8px] text-ink-section">
              PUBLICADO HOY
            </span>
            <span className="h-px flex-1 bg-divider" />
          </div>

          <PostList />
        </div>
      </main>
    </div>
  );
}
