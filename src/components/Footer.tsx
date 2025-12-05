const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      className="section-padding py-12 border-t border-border"
      role="contentinfo"
    >
      <div className="container-wide">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          {/* Logo and copyright */}
          <div>
            <p className="text-lg font-semibold text-foreground mb-2">
              MINML
            </p>
            <p className="text-sm text-muted-foreground">
              © {currentYear} MINML. All rights reserved.
            </p>
          </div>

          {/* Links */}
          <nav aria-label="Footer navigation">
            <ul className="flex flex-wrap gap-6 text-sm">
              <li>
                <a
                  href="#platform"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Platform
                </a>
              </li>
              <li>
                <a
                  href="#how-it-works"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  How It Works
                </a>
              </li>
              <li>
                <a
                  href="#about"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  About
                </a>
              </li>
              <li>
                <a
                  href="#demo"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Contact
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
