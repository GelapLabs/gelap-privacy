import Hero from "@/src/modules/home/Hero";
import ProblemStatement from "@/src/modules/home/ProblemStatement";
import HowItWorks from "@/src/modules/home/HowItWorks";
import Features from "@/src/modules/home/Features";
import UseCases from "@/src/modules/home/UseCases";
import SecurityTrust from "@/src/modules/home/SecurityTrust";
import FAQ from "@/src/modules/home/FAQ";
import FinalCTA from "@/src/modules/home/FinalCTA";

export default function Home() {
  return (
    <>
      <Hero />
      <ProblemStatement />
      <HowItWorks />
      <Features />
      <UseCases />
      <SecurityTrust />
      <FAQ />
      <FinalCTA />
    </>
  );
}
