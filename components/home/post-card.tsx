import Link from "next/link";
import { posts, type Post, type PostKind } from "@/data/mock/posts";
import {
  CommentIcon,
  HeartIcon,
  ImageIcon,
  MegaphoneIcon,
} from "@/components/shared/icons";

const badgeStyles: Record<PostKind, { label: string; className: string }> = {
  achievement: {
    label: "LOGRO",
    className: "bg-badge-achievement-bg text-badge-achievement-fg",
  },
  activity: {
    label: "ACTIVIDAD",
    className: "bg-badge-activity-bg text-badge-activity-fg",
  },
  announcement: {
    label: "ANUNCIO",
    className: "bg-badge-announcement-bg text-badge-announcement-fg",
  },
};

function AuthorAvatar({ post }: { post: Post }) {
  if (post.kind === "announcement") {
    return (
      <span className="flex h-11 w-11 flex-none items-center justify-center rounded-full bg-badge-announcement-bg text-badge-announcement-fg">
        <MegaphoneIcon className="h-5 w-5" />
      </span>
    );
  }

  return (
    <span className="flex h-11 w-11 flex-none items-center justify-center rounded-full bg-avatar-child-bg font-heading text-[17px] font-semibold text-avatar-child-fg">
      {post.authorInitial}
    </span>
  );
}

export default function PostCard({ post }: { post: Post }) {
  const badge = badgeStyles[post.kind];
  const subtitle = post.isMine ? `${post.time} · publicado por vos` : post.time;

  return (
    <article className="rounded-[20px] border border-border bg-surface px-[22px] py-5 shadow-[0_4px_16px_-12px_rgba(120,90,60,.5)]">
      <div className="mb-[14px] flex items-center gap-3">
        <AuthorAvatar post={post} />
        <div className="min-w-0 flex-1">
          <div className="font-heading text-[16.5px] text-ink">
            {post.author}
          </div>
          <div className="text-[12.5px] text-ink-muted">{subtitle}</div>
        </div>
        <span
          className={`flex flex-none items-center gap-[7px] rounded-full px-3 py-1.5 ${badge.className}`}
        >
          <span className="h-2 w-2 rounded-full bg-current" />
          <span className="text-[12px] font-extrabold tracking-[.5px]">
            {badge.label}
          </span>
        </span>
      </div>

      <div className="mb-[10px] text-[12.5px] text-ink-muted">
        {post.audience}
      </div>

      <p className="text-[15.5px] leading-[1.55] text-ink-body">{post.body}</p>

      {post.photo && (
        <Link
          href="/foto"
          className="mt-[14px] flex h-[200px] flex-col items-center justify-center gap-2 rounded-[16px] border-[1.5px] border-dashed border-photo-border bg-photo-bg text-photo-fg"
        >
          <ImageIcon className="h-[30px] w-[30px]" strokeWidth={1.7} />
          <span className="text-[13.5px]">{post.photo.caption}</span>
        </Link>
      )}

      <div className="mt-4 flex items-center gap-[18px] border-t border-border-soft pt-[14px]">
        <span className="flex items-center gap-[7px] text-[14px] font-bold text-accent-action">
          <HeartIcon className="h-[19px] w-[19px]" fill="currentColor" />
          {post.likes}
        </span>
        <Link
          href="/detalle-publicacion"
          className="flex items-center gap-[7px] text-[14px] font-bold text-ink-soft"
        >
          <CommentIcon className="h-[18px] w-[18px]" />
          {post.comments}
        </Link>
        <span className="flex-1" />
        <Link
          href="/crear-publicacion"
          className="text-[14px] font-extrabold text-accent-link"
        >
          Editar
        </Link>
      </div>
    </article>
  );
}

export function PostList() {
  return (
    <div className="flex flex-col gap-4">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}
