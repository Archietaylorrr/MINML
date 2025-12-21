const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      className="py-6 border-t border-border"
      role="contentinfo"
    >
      <div className="container mx-auto px-6 md:px-8 lg:px-12 max-w-7xl">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
          <p>© {currentYear} MINML LTD. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span>Cambridge, CB2 3EA</span>
            <a
              href="mailto:founders@minml.co.uk"
              className="hover:text-foreground transition-colors"
            >
              founders@minml.co.uk
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
