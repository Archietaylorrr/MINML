import { Globe, Grid3X3, Atom, Eye } from "lucide-react";

const features = [
  {
    icon: Globe,
    title: "Global Predictive Model",
    challenge: "Traditional targeting relies on manual interpretation and subjective weighting of geological data.",
    solution: "A deep learning model trained on worldwide geological data. No uploads required. Tell us your target region and we generate predictions.",
  },
  {
    icon: Grid3X3,
    title: "500m Resolution Targeting",
    challenge: "Coarse regional models miss the detail needed for drill placement decisions.",
    solution: "Tenement-scale prospectivity maps at 500m resolution using H3 hexagonal grids. Precise enough to guide where to drill.",
  },
  {
    icon: Atom,
    title: "Any Natural Resource",
    challenge: "Most AI tools are built for a single commodity or geological setting.",
    solution: "From minerals to helium and beyond. Our technology applies to any subsurface resource where geological signatures can guide discovery.",
  },
  {
    icon: Eye,
    title: "Transparent & Explainable",
    challenge: "Black-box AI creates trust issues and makes it hard to justify exploration spend.",
    solution: "Every prediction comes with feature attribution. See exactly which geological signals drove the AI's confidence.",
  },
];

const Features = () => {
  return (
    <section
      id="platform"
      className="py-24 md:py-32 border-t border-border"
      aria-labelledby="features-heading"
    >
      <div className="container mx-auto px-6 md:px-8 lg:px-12 max-w-7xl">
        {/* Section header */}
        <div className="grid lg:grid-cols-2 gap-6 lg:gap-12 mb-16 md:mb-20 items-end">
          <div>
            <p className="text-xs font-medium text-primary uppercase tracking-widest mb-3">Platform</p>
            <h2
              id="features-heading"
              className="text-3xl md:text-4xl lg:text-[2.75rem] font-normal leading-[1.15] tracking-tight"
            >
              Prospectivity Mapping,<br className="hidden sm:block" /> Powered by AI
            </h2>
          </div>
          <div>
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed lg:max-w-md">
              We apply deep learning to global geological data, generating quantified, data-driven predictions of where to drill next.
            </p>
          </div>
        </div>

        {/* Features grid */}
        <div className="grid md:grid-cols-2 gap-px bg-border/50 rounded-lg overflow-hidden border border-border/50">
          {features.map((feature, index) => (
            <article
              key={feature.title}
              className="bg-background p-8 md:p-10 lg:p-12 animate-fade-up flex flex-col"
              style={{ animationDelay: `${index * 75}ms` }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-9 h-9 rounded-md bg-muted/50 flex items-center justify-center flex-shrink-0 border border-border/30">
                  <feature.icon className="w-4 h-4 text-muted-foreground" strokeWidth={1.5} />
                </div>
                <h3 className="text-lg md:text-xl font-medium tracking-tight">{feature.title}</h3>
              </div>
              
              <div className="space-y-4 flex-1">
                <div>
                  <p className="text-[10px] font-medium text-muted-foreground/70 uppercase tracking-widest mb-1.5">Challenge</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">{feature.challenge}</p>
                </div>
                <div>
                  <p className="text-[10px] font-medium text-primary/80 uppercase tracking-widest mb-1.5">Solution</p>
                  <p className="text-sm text-foreground leading-relaxed">{feature.solution}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
