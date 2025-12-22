const About = () => {
  return (
    <section id="about" className="py-24 md:py-32" aria-labelledby="about-heading">
      <div className="container mx-auto px-6 md:px-8 lg:px-12 max-w-7xl">
        {/* Problem statement - full width with impact */}
        <div className="mb-20 md:mb-28">
          <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
            <div className="lg:col-span-2 space-y-6">
              <p className="text-xs font-medium text-primary uppercase tracking-widest mb-3">About</p>
              <h2 id="about-heading" className="text-3xl md:text-4xl lg:text-[2.75rem] font-normal leading-[1.15] tracking-tight">
                The Problem We Solve
              </h2>
              <p className="text-xl md:text-2xl leading-relaxed text-foreground">
                Exploration is in structural decline. Discovery rates have fallen by more than 50% since 2000, while cost per discovery has risen 3-5x.
              </p>
              <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
                Grassroots drill success sits between 0.3% and 1.0%. Near-surface Tier 1 assets are effectively exhausted in mature belts. Meanwhile, global demand for copper, nickel, lithium, cobalt, and rare earths is projected to grow 300-700% by 2040.
              </p>
            </div>
            <div className="lg:border-l lg:border-border lg:pl-12">
              <p className="text-xs font-medium text-primary uppercase tracking-widest mb-3">Our Solution</p>
              <p className="text-base md:text-lg leading-relaxed mb-4">
                MINML provides the global exploration intelligence layer: AI-first infrastructure that transforms multi-source geoscience data into high-confidence prospectivity maps and ranked drill targets.
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed border-t border-border pt-4">
                <span className="font-medium text-foreground">Expert-validated outputs.</span> Every model prediction is reviewed and quality-assured by our team of geoscientists from the University of Cambridge.
              </p>
            </div>
          </div>
        </div>

        {/* Statistics - large display numbers */}
        <div className="border-t border-border pt-16 md:pt-20">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest mb-10">Industry Landscape</p>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-10 md:gap-16">
            <div className="animate-fade-up">
              <div className="flex items-baseline">
                <span className="stat-number text-foreground">&lt;1</span>
                <span className="stat-unit">%</span>
              </div>
              <p className="stat-label">Grassroots drill success rate industry-wide</p>
            </div>
            
            <div className="animate-fade-up animation-delay-100">
              <div className="flex items-baseline">
                <span className="stat-number text-foreground">$150</span>
                <span className="stat-unit">M+</span>
              </div>
              <p className="stat-label">Average cost per economic deposit discovery</p>
            </div>
            
            <div className="animate-fade-up animation-delay-200">
              <div className="flex items-baseline">
                <span className="stat-number text-foreground">300</span>
                <span className="stat-unit">%+</span>
              </div>
              <p className="stat-label">Projected critical metals demand growth by 2040</p>
            </div>
            
            <div className="animate-fade-up animation-delay-300">
              <div className="flex items-baseline">
                <span className="stat-number text-foreground">10</span>
                <span className="stat-unit">x</span>
              </div>
              <p className="stat-label">Targeted improvement in exploration efficiency</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
