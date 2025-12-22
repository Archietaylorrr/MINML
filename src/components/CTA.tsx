import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ArrowRight, Loader2 } from "lucide-react";

const CTA = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus({ type: null, message: "" });

    try {
      // Create mailto link as fallback
      const subject = encodeURIComponent(
        `MINML Contact Form - ${formData.company || formData.name}`
      );
      const body = encodeURIComponent(
        `Name: ${formData.name}\nEmail: ${formData.email}\nCompany: ${formData.company}\n\nMessage:\n${formData.message}`
      );
      const mailtoLink = `mailto:founders@minml.co.uk?subject=${subject}&body=${body}`;

      // Open mailto as the submission method
      window.location.href = mailtoLink;

      setSubmitStatus({
        type: "success",
        message:
          "Opening your email client. If it doesn't open automatically, please email us at founders@minml.co.uk",
      });

      // Reset form
      setFormData({
        name: "",
        email: "",
        company: "",
        message: "",
      });
    } catch (error) {
      setSubmitStatus({
        type: "error",
        message: "Something went wrong. Please try emailing us directly at founders@minml.co.uk",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section
      id="contact"
      className="bg-surface-dark text-surface-dark-foreground py-24 md:py-32"
      aria-labelledby="cta-heading"
    >
      <div className="container mx-auto px-6 md:px-8 lg:px-12 max-w-2xl">
        <div className="text-center mb-12">
          <p className="text-xs font-medium text-primary uppercase tracking-widest mb-3">
            Get Started
          </p>
          <h2
            id="cta-heading"
            className="text-3xl md:text-4xl lg:text-[2.75rem] font-normal leading-[1.15] tracking-tight mb-6"
          >
            Ready to find your next deposit?
          </h2>
          <p className="text-base md:text-lg text-surface-dark-foreground/70 leading-relaxed max-w-xl mx-auto">
            Get in touch to discuss how MINML can help your team generate better
            drill targets and reduce exploration risk.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-surface-dark-foreground">
                Name *
              </Label>
              <Input
                id="name"
                name="name"
                type="text"
                required
                value={formData.name}
                onChange={handleChange}
                className="bg-surface-dark-foreground/5 border-surface-dark-foreground/20 text-surface-dark-foreground placeholder:text-surface-dark-foreground/40"
                placeholder="John Smith"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-surface-dark-foreground">
                Email *
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="bg-surface-dark-foreground/5 border-surface-dark-foreground/20 text-surface-dark-foreground placeholder:text-surface-dark-foreground/40"
                placeholder="john@company.com"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="company" className="text-surface-dark-foreground">
              Company
            </Label>
            <Input
              id="company"
              name="company"
              type="text"
              value={formData.company}
              onChange={handleChange}
              className="bg-surface-dark-foreground/5 border-surface-dark-foreground/20 text-surface-dark-foreground placeholder:text-surface-dark-foreground/40"
              placeholder="Your mining or exploration company"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="message" className="text-surface-dark-foreground">
              Message *
            </Label>
            <Textarea
              id="message"
              name="message"
              required
              value={formData.message}
              onChange={handleChange}
              rows={5}
              className="bg-surface-dark-foreground/5 border-surface-dark-foreground/20 text-surface-dark-foreground placeholder:text-surface-dark-foreground/40 resize-none"
              placeholder="Tell us about your exploration project and how we can help..."
            />
          </div>

          {submitStatus.type && (
            <div
              className={`p-4 rounded-md ${
                submitStatus.type === "success"
                  ? "bg-green-500/10 border border-green-500/20 text-green-400"
                  : "bg-red-500/10 border border-red-500/20 text-red-400"
              }`}
            >
              {submitStatus.message}
            </div>
          )}

          <Button
            type="submit"
            variant="default"
            size="lg"
            disabled={isSubmitting}
            className="w-full md:w-auto bg-primary text-primary-foreground hover:bg-primary/90"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                Send Message
                <ArrowRight className="h-4 w-4 ml-2" />
              </>
            )}
          </Button>
        </form>
      </div>
    </section>
  );
};

export default CTA;
