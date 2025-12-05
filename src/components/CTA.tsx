import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const CTA = () => {
  return (
    <section
      id="demo"
      className="bg-surface-dark text-surface-dark-foreground section-padding py-24 md:py-32"
      aria-labelledby="cta-heading"
    >
      <div className="container-narrow text-center">
        <h2
          id="cta-heading"
          className="text-3xl md:text-4xl lg:text-5xl font-normal leading-tight mb-6"
        >
          Apply deep learning to your exploration data
        </h2>
        <p className="text-lg text-surface-dark-foreground/80 leading-relaxed mb-10 max-w-2xl mx-auto">
          Schedule a demo to see how AI-generated prospectivity predictions 
          can help your team identify high-priority targets and allocate 
          drilling budgets more effectively.
        </p>
        <Button
          variant="default"
          size="lg"
          className="bg-primary text-primary-foreground hover:bg-primary/90"
          asChild
        >
          <a href="mailto:founders@minml.co.uk">
            Request a demo
            <ArrowRight className="h-4 w-4 ml-2" />
          </a>
        </Button>
      </div>
    </section>
  );
};

export default CTA;
