import { Hexagon, Satellite, Brain, Target } from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "Deep Learning Prediction",
    description:
      "Neural networks trained on known deposits learn the complex relationships between geological features and mineralisation, generating probability scores for undiscovered targets.",
  },
  {
    icon: Hexagon,
    title: "Spatial Feature Engineering",
    description:
      "H3 hexagonal grids transform multi-source data into structured feature vectors. Each cell aggregates geology, geophysics, geochemistry, and remote sensing into model-ready inputs.",
  },
  {
    icon: Satellite,
    title: "Multi-Modal Data Fusion",
    description:
      "AI models integrate diverse data types including magnetics, gravity, hyperspectral imagery, soil chemistry, and structural interpretations to identify deposit signatures.",
  },
  {
    icon: Target,
    title: "Explainable Predictions",
    description:
      "Every prospectivity score includes feature attribution. Understand which geological and geophysical signals the model weighted most heavily for each prediction.",
  },
];

const Features = () => {
  return (
    <section
      id="platform"
      className="section-padding py-24 md:py-32"
      aria-labelledby="features-heading"
    >
      <div className="container-wide">
        {/* Section header */}
        <div className="max-w-3xl mb-16 md:mb-20">
          <h2
            id="features-heading"
            className="text-3xl md:text-4xl lg:text-5xl font-normal leading-tight mb-6"
          >
            AI that learns what deposits look like
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Our deep learning models are trained on thousands of known mineral 
            occurrences and their geological context. They identify the subtle 
            patterns that indicate prospective ground.
          </p>
        </div>

        {/* Features grid */}
        <div className="grid md:grid-cols-2 gap-8 md:gap-12">
          {features.map((feature, index) => (
            <article
              key={feature.title}
              className="group border-t border-border pt-8"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center bg-secondary text-foreground">
                  <feature.icon className="w-6 h-6" strokeWidth={1.5} />
                </div>
                <div>
                  <h3 className="text-xl font-medium mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
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
