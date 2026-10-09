import MobileHeader from "@/components/shared/mobile-header";
import Sidebar from "@/components/shared/sidebar";
import KidsPageContent from "@/components/kids/kids-page-content";

export default function KidsPage() {
  return (
    <div className="min-h-screen bg-page lg:flex">
      <MobileHeader active="/kids" />
      <Sidebar active="/kids" className="hidden lg:flex" />

      <main className="min-w-0 flex-1 lg:h-screen lg:overflow-y-auto">
        <div className="mx-auto w-full max-w-[880px] px-5 pb-20 pt-8 lg:px-10 lg:pt-[34px]">
          <KidsPageContent />
        </div>
      </main>
    </div>
  );
}
