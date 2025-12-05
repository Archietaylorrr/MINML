const steps = [{
  number: "01",
  title: "Ingest Data",
  description: "Upload geology, geophysics, geochem, drilling, and remote sensing. The platform fuses these with global basemaps into a unified dataset."
}, {
  number: "02",
  title: "Build Features",
  description: "Data is transformed into spatial feature vectors on an H3 grid. Each cell captures the geological and geophysical signatures the AI needs to learn from."
}, {
  number: "03",
  title: "Train and Predict",
  description: "Deep learning models trained on known deposits generate prospectivity predictions across your licence, with uncertainty estimates and feature attribution."
}, {
  number: "04",
  title: "Target and Drill",
  description: "Ranked predictions guide drill planning. Models update as new data arrives, improving accuracy with each iteration."
}];
const HowItWorks = () => {
  return <section id="how-it-works" className="bg-secondary section-padding py-24 md:py-32" aria-labelledby="how-it-works-heading">
      <div className="container-wide">
        {/* Section header */}
        <div className="max-w-3xl mb-16 md:mb-20">
          <h2 id="how-it-works-heading" className="text-3xl md:text-4xl lg:text-5xl font-normal leading-tight mb-6">
            From data to decisions
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            A straightforward workflow that integrates with your existing 
            exploration processes.
          </p>
        </div>

        {/* Steps */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => <article key={step.number} className="relative">
              {/* Connector line (desktop) */}
              {index < steps.length - 1}
              
              <div className="mb-4">
                <span className="text-4xl md:text-5xl font-light text-primary">
                  {step.number}
                </span>
              </div>
              <h3 className="text-lg font-medium mb-3">{step.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {step.description}
              </p>
            </article>)}
        </div>
      </div>
    </section>;
};
export default HowItWorks;