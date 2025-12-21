import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import hexMapImage from "@/assets/hex-map-hero.png";

const Hero = () => {
  return (
    <section id="hero" className="relative min-h-screen flex items-center" aria-labelledby="hero-heading">
      {/* Full-page background image */}
      <div className="absolute inset-0">
        <img src={hexMapImage} alt="" aria-hidden="true" className="w-full h-full object-cover" loading="eager" />
        {/* Dark overlay for text legibility */}
        <div className="absolute inset-0 bg-surface-dark/75" />
        {/* Gradient overlay for depth */}
        <div className="absolute inset-0 bg-gradient-to-b from-surface-dark/40 via-transparent to-surface-dark/80" />
      </div>

      {/* Content */}
      <div className="section-padding container-wide relative z-10 py-32 md:py-40">
        <div className="max-w-3xl">
          <h1 id="hero-heading" className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-normal leading-[1.1] mb-6 text-surface-dark-foreground animate-fade-up">
            AI-Powered Natural Resource Exploration
          </h1>
          <p className="text-lg md:text-xl text-surface-dark-foreground/80 leading-relaxed mb-10 max-w-2xl animate-fade-up animation-delay-100">
            MINML's global deep learning model predicts where natural resources are most likely to occur, delivering tenement-scale prospectivity maps at 500m resolution, ready to guide your next drilling campaign.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 animate-fade-up animation-delay-200">
            <Button variant="hero-light" size="lg" asChild>
              <a href="#contact">
                Contact Us
                <ArrowRight className="h-4 w-4 ml-2" />
              </a>
            </Button>
            <Button variant="outline-light" size="lg" asChild>
              <a href="#platform">Learn more</a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
