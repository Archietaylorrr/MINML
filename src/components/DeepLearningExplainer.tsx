import { useState, useCallback } from "react";
import PipelineAnimation from "./PipelineAnimation";

// 4 key technical sections that map to animation phases
const SECTIONS = [
  { 
    id: 'data-integration',
    title: 'Data Integration', 
    description: 'We aggregate global geological, geophysical, and geochemical datasets into a unified spatial framework.',
    phases: [0, 1] // Animation phases 0-1
  },
  { 
    id: 'feature-engineering',
    title: 'Feature Engineering', 
    description: 'H3 hexagonal tiling creates discrete spatial features, enabling consistent analysis across varying data resolutions.',
    phases: [2] // Animation phase 2
  },
  { 
    id: 'deep-learning',
    title: 'Deep Learning', 
    description: 'Neural networks learn complex geological patterns from historical discoveries to generate probability estimates.',
    phases: [3, 4, 5] // Animation phases 3-5
  },
  { 
    id: 'predictions',
    title: 'Predictions', 
    description: 'High-probability zones are identified and merged into actionable exploration targets.',
    phases: [6] // Animation phase 6
  },
];

const getActiveSectionIndex = (phaseIndex: number): number => {
  for (let i = 0; i < SECTIONS.length; i++) {
    if (SECTIONS[i].phases.includes(phaseIndex)) return i;
  }
  return 0;
};

const DeepLearningExplainer = () => {
  const [activeSection, setActiveSection] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const handlePhaseChange = useCallback((phaseIndex: number) => {
    const sectionIndex = getActiveSectionIndex(phaseIndex);
    setActiveSection(sectionIndex);
  }, []);

  return (
    <section 
      id="technology" 
      className="py-24 md:py-32 bg-surface-dark text-surface-dark-foreground overflow-hidden" 
      aria-labelledby="technology-heading"
    >
      <div className="container mx-auto px-6 md:px-8 lg:px-12 max-w-7xl">
        {/* Section header */}
        <div className="max-w-2xl mb-12 md:mb-16">
          <p className="text-xs font-medium text-primary uppercase tracking-widest mb-3">
            Technology
          </p>
          <h2 
            id="technology-heading" 
            className="text-3xl md:text-4xl lg:text-[2.75rem] font-normal leading-[1.15] tracking-tight mb-6"
          >
            How Deep Learning Finds Resources
          </h2>
          <p className="text-base md:text-lg text-surface-dark-foreground/70 leading-relaxed">
            Our AI learns from global multimodal data to recognise the subtle signatures that indicate where natural resources are likely to occur.
          </p>
        </div>

        {/* Main content grid */}
        <div className="grid lg:grid-cols-[1fr,300px] gap-8 lg:gap-12 items-start">
          {/* Animation container */}
          <div className="relative">
            <div className="aspect-[16/9] w-full overflow-hidden rounded-lg border border-surface-dark-foreground/10 bg-surface-dark shadow-lg">
              <PipelineAnimation 
                onPhaseChange={handlePhaseChange}
                isPaused={isPaused}
              />
            </div>

            {/* Progress bar */}
            <div className="mt-6 flex gap-1.5">
              {SECTIONS.map((section, index) => (
                <div
                  key={section.id}
                  className={`h-0.5 rounded-full transition-all duration-700 ease-out flex-1 ${
                    index < activeSection 
                      ? index === 0 ? 'bg-accent' :
                        index === 1 ? 'bg-hex-teal' :
                        'bg-primary'
                      : index === activeSection 
                        ? index === 0 ? 'bg-accent' :
                          index === 1 ? 'bg-hex-teal' :
                          'bg-primary'
                        : 'bg-surface-dark-foreground/10'
                  }`}
                />
              ))}
            </div>

            {/* Pause control */}
            <button
              onClick={() => setIsPaused(!isPaused)}
              className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded bg-surface-dark/90 backdrop-blur-sm border border-surface-dark-foreground/15 text-surface-dark-foreground/60 hover:text-surface-dark-foreground hover:border-surface-dark-foreground/30 transition-all duration-200"
              aria-label={isPaused ? "Play animation" : "Pause animation"}
            >
              {isPaused ? (
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z"/>
                </svg>
              ) : (
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
                </svg>
              )}
            </button>
          </div>

          {/* Sidebar - 4 key sections */}
          <nav className="flex flex-col gap-1" aria-label="Pipeline stages">
            {SECTIONS.map((section, index) => {
              const isActive = activeSection === index;
              const colorClass = index === 0 ? 'accent' : index === 1 ? 'hex-teal' : 'primary';
              
              return (
                <div
                  key={section.id}
                  className={`relative pl-4 py-3 transition-all duration-500 ease-out ${
                    isActive ? 'opacity-100' : 'opacity-40 hover:opacity-60'
                  }`}
                >
                  {/* Left border indicator */}
                  <div 
                    className={`absolute left-0 top-0 bottom-0 w-0.5 rounded-full transition-all duration-500 ease-out ${
                      isActive 
                        ? `bg-${colorClass}` 
                        : 'bg-surface-dark-foreground/15'
                    }`}
                    style={isActive ? { 
                      backgroundColor: index === 0 ? 'hsl(var(--accent))' : 
                                       index === 1 ? 'hsl(var(--hex-teal))' : 
                                       'hsl(var(--primary))'
                    } : {}}
                  />
                  
                  <div className="flex items-center gap-2.5 mb-1">
                    <span 
                      className={`w-5 h-5 flex items-center justify-center text-[11px] font-semibold rounded transition-all duration-500 ease-out ${
                        isActive
                          ? index === 0 ? 'bg-accent text-accent-foreground' :
                            index === 1 ? 'bg-hex-teal text-surface-dark' :
                            'bg-primary text-primary-foreground'
                          : 'bg-surface-dark-foreground/10 text-surface-dark-foreground/50'
                      }`}
                    >
                      {index + 1}
                    </span>
                    <h3 
                      className={`text-sm font-medium tracking-wide transition-colors duration-500 ease-out ${
                        isActive 
                          ? index === 0 ? 'text-accent' :
                            index === 1 ? 'text-hex-teal' :
                            'text-primary'
                          : 'text-surface-dark-foreground/60'
                      }`}
                    >
                      {section.title}
                    </h3>
                  </div>
                  <p 
                    className={`text-sm leading-relaxed transition-all duration-500 ease-out ${
                      isActive 
                        ? 'text-surface-dark-foreground/80' 
                        : 'text-surface-dark-foreground/40'
                    }`}
                  >
                    {section.description}
                  </p>
                </div>
              );
            })}
          </nav>
        </div>
      </div>
    </section>
  );
};

export default DeepLearningExplainer;
