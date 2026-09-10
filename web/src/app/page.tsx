import { Nav } from "@/components/landing/nav";
import { Hero } from "@/components/landing/hero";
import { Problem } from "@/components/landing/problem";
import { HowItWorks } from "@/components/landing/how-it-works";
import { AgentWorkflow } from "@/components/landing/agent-workflow";
import { Escrow } from "@/components/landing/escrow";
import { Evaluation } from "@/components/landing/evaluation";
import { Disputes } from "@/components/landing/disputes";
import { UseCases } from "@/components/landing/use-cases";
import { Architecture } from "@/components/landing/architecture";
import { Cta, Footer } from "@/components/landing/cta-footer";

export default function Home() {
  return (
    <main>
      <Nav />
      <Hero />
      <Problem />
      <HowItWorks />
      <AgentWorkflow />
      <Escrow />
      <Evaluation />
      <Disputes />
      <UseCases />
      <Architecture />
      <Cta />
      <Footer />
    </main>
  );
}
