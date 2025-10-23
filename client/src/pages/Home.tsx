import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import BookAppointment from "./BookAppointment";
import HealthcareServices from "@/components/HealthcareServices";
import WhyTrustUs from "@/components/WhyTrustUs";
import Testimonials from "@/components/Testimonials";
import HeroScrion from "@/components/HeroScrion";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
   <HeroScrion/>

      <BookAppointment />
      <HealthcareServices />
      <WhyTrustUs />
      <Testimonials />
      <Footer />
    </>
  );
}
