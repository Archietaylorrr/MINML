const About = () => {
  return <section id="about" className="section-padding py-24 md:py-32" aria-labelledby="about-heading">
      <div className="container-wide">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
          {/* Left column - main message */}
          <div>
            <h2 id="about-heading" className="text-3xl md:text-4xl lg:text-5xl font-normal leading-tight mb-6">
              Predictive AI for mineral exploration
            </h2>
          </div>

          {/* Right column - details */}
          <div className="space-y-6">
            <p className="text-lg text-muted-foreground leading-relaxed">
              Traditional prospectivity mapping relies on manual weighting of 
              geological criteria. MINML uses deep learning to discover the 
              complex, nonlinear relationships between exploration data and 
              mineralisation that human analysis cannot easily detect.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Our models are trained on known deposits and their geological 
              context. They learn what mineralisation looks like in your data, 
              then apply that knowledge to identify targets across your 
              entire project area.
            </p>
            <p className="text-lg leading-relaxed">
              The result is quantified predictions with uncertainty estimates, 
              enabling exploration teams to allocate drilling budgets with 
              greater confidence.
            </p>
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16 md:mt-24 pt-12 border-t border-border">
          <div>
            <p className="text-4xl md:text-5xl font-light text-primary mb-2">92%</p>
            <p className="text-sm text-muted-foreground">Of known deposits flagged as high priority sites.</p>
          </div>
          <div>
            <p className="text-4xl md:text-5xl font-light text-primary mb-2">3x</p>
            <p className="text-sm text-muted-foreground">More efficient than expert geological targetting.</p>
          </div>
          <div>
            <p className="text-4xl md:text-5xl font-light text-primary mb-2">H3</p>
            <p className="text-sm text-muted-foreground">Hexagonal grid standard with 5km resolution.</p>
          </div>
          <div>
            <p className="text-4xl md:text-5xl font-light text-primary mb-2">GIS</p>
            <p className="text-sm text-muted-foreground">Native export formats to integrate into your workflow.</p>
          </div>
        </div>
      </div>
    </section>;
};
export default About;