import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import DeepLearningExplainer from "@/components/DeepLearningExplainer";
import About from "@/components/About";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <main className="min-h-screen">
      <Header />
      <Hero />
      <Features />
      <DeepLearningExplainer />
      <About />
      <CTA />
      <Footer />
    </main>
  );
};

export default Index;
