import Footer from "@/components/Footer";
import Header from "@/components/Header";
import MobileTabs from "@/components/MobileTabs";

export default function SiteLayout({ children }: LayoutProps<"/">) {
  return (
    <>
      <Header />
      <div className="flex-1">{children}</div>
      <Footer />
      <div className="h-16 sm:hidden" aria-hidden="true" />
      <MobileTabs />
    </>
  );
}
