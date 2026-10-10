import { notFound } from "next/navigation";
import MobileHeader from "@/components/shared/mobile-header";
import Sidebar from "@/components/shared/sidebar";
import KidProfileContent from "@/components/kids/kid-profile-content";
import { getKidById } from "@/data/mock/kids";

export const instant = false;

export default async function KidProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const numericId = Number(id);
  const kid = Number.isInteger(numericId) ? getKidById(numericId) : undefined;

  if (!kid) notFound();

  return (
    <div className="min-h-screen bg-page lg:flex">
      <MobileHeader active="/kids" />
      <Sidebar active="/kids" className="hidden lg:flex" />

      <main className="min-w-0 flex-1 lg:h-screen lg:overflow-y-auto">
        <div className="mx-auto w-full max-w-[820px] px-5 pb-20 pt-8 lg:px-10 lg:pt-[34px]">
          <KidProfileContent kid={kid} />
        </div>
      </main>
    </div>
  );
}
