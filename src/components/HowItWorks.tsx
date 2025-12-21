const steps = [
  {
    number: "01",
    title: "Upload Your Data",
    description: "Share your exploration data—geology maps, geophysics surveys, geochemistry results, drilling logs. We handle the integration."
  },
  {
    number: "02",
    title: "We Build the Model",
    description: "MINML transforms your data into structured spatial features and trains deep learning models on known mineralisation in your region."
  },
  {
    number: "03",
    title: "Get Predictions",
    description: "Receive prospectivity maps with ranked drill targets, confidence scores, and clear explanations of what's driving each prediction."
  },
  {
    number: "04",
    title: "Drill Smarter",
    description: "Focus your budget on high-probability targets. As you drill, new data improves the model—making each campaign more effective."
  }
];

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="bg-secondary py-24 md:py-32" aria-labelledby="how-it-works-heading">
      <div className="container mx-auto px-6 md:px-8 lg:px-12 max-w-7xl">
        {/* Section header */}
        <div className="max-w-3xl mb-16 md:mb-20">
          <p className="text-xs font-medium text-primary uppercase tracking-widest mb-3">Process</p>
          <h2 id="how-it-works-heading" className="text-3xl md:text-4xl lg:text-[2.75rem] font-normal leading-[1.15] tracking-tight mb-6">
            How It Works
          </h2>
          <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
            From your raw exploration data to prioritised drill targets in weeks, not months.
          </p>
        </div>

        {/* Steps */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">
          {steps.map((step, index) => (
            <article 
              key={step.number} 
              className="relative group animate-fade-up"
              style={{ animationDelay: `${index * 75}ms` }}
            >
              <div className="mb-4">
                <span className="text-4xl md:text-5xl font-light text-primary/80 group-hover:text-primary transition-colors duration-300">
                  {step.number}
                </span>
              </div>
              <h3 className="text-base md:text-lg font-medium mb-2 tracking-tight">{step.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {step.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
