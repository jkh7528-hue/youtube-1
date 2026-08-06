import Hero from "@/components/home/Hero";
import CertBanner from "@/components/home/CertBanner";
import CoreStrengths from "@/components/home/CoreStrengths";
import BusinessOverview from "@/components/home/BusinessOverview";
import GalleryPreview from "@/components/home/GalleryPreview";
import QuickRfqForm from "@/components/home/QuickRfqForm";

export default function Home() {
  return (
    <>
      <Hero />
      <CertBanner />
      <CoreStrengths />
      <BusinessOverview />
      <GalleryPreview />
      <QuickRfqForm />
    </>
  );
}
