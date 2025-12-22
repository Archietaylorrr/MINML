import { useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Linkedin, Mail } from "lucide-react";
import archieHeadshot from "@/assets/archie-headshot.jpg";
import oliverHeadshot from "@/assets/oliver-headshot.jpeg";
import angusHeadshot from "@/assets/angus-headshot.png";
const founders = [
  {
    name: "Archie Taylor",
    role: "Founder & CTO",
    image: archieHeadshot,
    bio: "With a background in Earth Sciences from the University of Cambridge and experience in entrepreneurial software development, Archie leads product architecture and AI development at MINML. He designs the systems that transform multi-modal exploration data into ranked, GIS-ready targets with quantified uncertainty, ensuring that model outputs are practical, interpretable, and ready to integrate into existing exploration workflows.",
    linkedin: "https://www.linkedin.com/in/archie-craig-taylor/",
    email: "archie@minml.co.uk"
  },
  {
    name: "Oliver Crofts",
    role: "Founder & CEO",
    image: oliverHeadshot,
    bio: "Drawing on a background in Quantitative Climate and Environmental Sciences from the University of Cambridge, Oliver leads commercial strategy and operations at MINML. He ensures that advanced AI is delivered with clarity, accountability, and practical relevance, building lasting partnerships with exploration teams and investors while bringing the same rigour to execution and delivery as the team applies to its underlying technology.",
    linkedin: "https://www.linkedin.com/in/oliver-crofts/",
    email: "oliver@minml.co.uk"
  },
  {
    name: "Angus Fotherby",
    role: "Founder & Chief Scientific Officer",
    image: angusHeadshot,
    bio: "Holding a PhD in geochemistry from the University of Cambridge and expertise in machine learning and computational modelling, Angus leads the scientific development of MINML's core AI models. His work focuses on learning transferable geological signal across geophysics, geology, geochemistry, and remote sensing, with an emphasis on rigorous validation, uncertainty quantification, and model robustness to ensure outputs are accurate and defensible when informing real exploration decisions.",
    linkedin: "https://www.linkedin.com/in/angus-fotherby/",
    email: "angus@minml.co.uk"
  }
];

const Team = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <main className="min-h-screen">
      <Header />
      
      {/* Hero Section */}
      <section className="section-padding pt-32 pb-16 md:pt-40 md:pb-20 bg-secondary">
        <div className="container-wide">
          <div className="max-w-3xl animate-fade-up">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-normal leading-[1.1] mb-6">
              The Team Behind MINML
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
              We combine deep expertise in machine learning, geoscience, and mineral exploration 
              to build AI that understands what geologists need.
            </p>
          </div>
        </div>
      </section>

      {/* Founders Section */}
      <section className="section-padding py-20 md:py-28">
        <div className="container-wide">
          <div className="space-y-0">
            {founders.map((founder, index) => (
              <article 
                key={founder.name}
                className={`grid lg:grid-cols-5 gap-8 lg:gap-16 items-start animate-fade-up py-16 md:py-20 ${index !== founders.length - 1 ? 'border-b border-border' : ''} ${index === 0 ? 'pt-0' : ''}`}
                style={{ animationDelay: `${index * 150}ms` }}
              >
                {/* Image */}
                <div className={`lg:col-span-2 ${index % 2 === 1 ? 'lg:order-2' : ''}`}>
                  <div className="relative aspect-[4/5] overflow-hidden bg-secondary group">
                    <img 
                      src={founder.image} 
                      alt={founder.name}
                      className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-surface-dark/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </div>
                </div>

                {/* Content */}
                <div className={`lg:col-span-3 ${index % 2 === 1 ? 'lg:order-1' : ''}`}>
                  <div className="lg:py-8">
                    <p className="text-sm text-primary font-medium tracking-wide uppercase mb-3">
                      {founder.role}
                    </p>
                    <h2 className="text-3xl md:text-4xl font-normal mb-6">
                      {founder.name}
                    </h2>
                    <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                      {founder.bio}
                    </p>
                    <div className="flex gap-4">
                      <a 
                        href={founder.linkedin}
                        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors group"
                        aria-label={`${founder.name}'s LinkedIn profile`}
                      >
                        <Linkedin className="w-5 h-5 group-hover:text-primary transition-colors" />
                        <span className="border-b border-transparent group-hover:border-current">LinkedIn</span>
                      </a>
                      <a 
                        href={`mailto:${founder.email}`}
                        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors group"
                        aria-label={`Email ${founder.name}`}
                      >
                        <Mail className="w-5 h-5 group-hover:text-primary transition-colors" />
                        <span className="border-b border-transparent group-hover:border-current">Email</span>
                      </a>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="section-padding py-20 md:py-28 bg-surface-dark text-surface-dark-foreground">
        <div className="container-wide">
          <div className="max-w-3xl mb-16">
            <h2 className="text-3xl md:text-4xl font-normal leading-tight mb-6 animate-fade-up">
              Our Approach
            </h2>
            <p className="text-lg text-surface-dark-foreground/80 leading-relaxed animate-fade-up animation-delay-100">
              We believe AI should augment geological expertise, not replace it. 
              Every prediction comes with uncertainty estimates and feature attribution, 
              giving your team the context they need to make confident decisions.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 md:gap-12">
            <div className="border-t border-surface-dark-foreground/20 pt-8 animate-fade-up animation-delay-200">
              <h3 className="text-xl font-medium mb-3">Explainable AI</h3>
              <p className="text-surface-dark-foreground/70 leading-relaxed">
                No black boxes. Our models show which geological features drive each prediction.
              </p>
            </div>
            <div className="border-t border-surface-dark-foreground/20 pt-8 animate-fade-up animation-delay-300">
              <h3 className="text-xl font-medium mb-3">Geologist-First Design</h3>
              <p className="text-surface-dark-foreground/70 leading-relaxed">
                Built by geoscientists for geoscientists. Tools that fit your existing workflow.
              </p>
            </div>
            <div className="border-t border-surface-dark-foreground/20 pt-8 animate-fade-up animation-delay-400">
              <h3 className="text-xl font-medium mb-3">Continuous Learning</h3>
              <p className="text-surface-dark-foreground/70 leading-relaxed">
                Models improve with every drill result, getting smarter as your project progresses.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default Team;
