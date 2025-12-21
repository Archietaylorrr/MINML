import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const CTA = () => {
  return (
    <section
      id="contact"
      className="bg-surface-dark text-surface-dark-foreground py-24 md:py-32"
      aria-labelledby="cta-heading"
    >
      <div className="container mx-auto px-6 md:px-8 lg:px-12 max-w-3xl text-center">
        <p className="text-xs font-medium text-primary uppercase tracking-widest mb-3">Get Started</p>
        <h2
          id="cta-heading"
          className="text-3xl md:text-4xl lg:text-[2.75rem] font-normal leading-[1.15] tracking-tight mb-6"
        >
          Ready to find your next deposit?
        </h2>
        <p className="text-base md:text-lg text-surface-dark-foreground/70 leading-relaxed mb-10 max-w-2xl mx-auto">
          Get in touch to discuss how MINML can help your team generate better drill targets and reduce exploration risk.
        </p>
        <Button
          variant="default"
          size="lg"
          className="bg-primary text-primary-foreground hover:bg-primary/90"
          asChild
        >
          <a href="mailto:founders@minml.co.uk">
            Contact Us
            <ArrowRight className="h-4 w-4 ml-2" />
          </a>
        </Button>
      </div>
    </section>
  );
};

export default CTA;
