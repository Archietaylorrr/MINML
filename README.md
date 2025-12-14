# MINML

**Deep Intelligence for Mineral Prospecting**

[https://minml.co.uk](https://minml.co.uk)

---

## Overview

MINML is an AI-powered mineral exploration platform that uses deep learning to identify where mineral deposits are most likely to occur. Our models analyse geological, geophysical, and geochemical data to generate prospectivity predictions with uncertainty estimates and feature attribution.


## Tech Stack

| Category | Technology |
|----------|------------|
| Build Tool | [Vite](https://vitejs.dev/) |
| Language | [TypeScript](https://www.typescriptlang.org/) |
| Framework | [React 18](https://react.dev/) |
| Styling | [Tailwind CSS](https://tailwindcss.com/) |
| Components | [shadcn/ui](https://ui.shadcn.com/) + [Radix UI](https://www.radix-ui.com/) |
| Routing | [React Router](https://reactrouter.com/) |
| Hosting | [Cloudflare Pages](https://pages.cloudflare.com/) |

## Development

### Prerequisites

- Node.js 18+ (recommended: install via [nvm](https://github.com/nvm-sh/nvm))
- npm 9+

### Setup

```bash
# Clone the repository
git clone https://github.com/your-org/minml-website.git
cd minml-website

# Install dependencies
npm install

# Start development server
npm run dev
```

The development server runs at `http://localhost:5173` with hot module replacement.

### Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint |

## Deployment

The site is deployed to Cloudflare Pages. Production builds are generated with:

```bash
npm run build
```

Output is written to the `dist/` directory.

## Project Structure

```
src/
├── assets/          # Static assets (images, icons)
├── components/      # React components
│   ├── ui/          # shadcn/ui component library
│   ├── Header.tsx   # Site navigation
│   ├── Hero.tsx     # Landing hero section
│   ├── Features.tsx # Platform capabilities
│   ├── About.tsx    # Company overview
│   ├── HowItWorks.tsx # Workflow steps
│   ├── CTA.tsx      # Demo request section
│   └── Footer.tsx   # Site footer
├── hooks/           # Custom React hooks
├── pages/           # Route pages
├── App.tsx          # Application root
└── index.css        # Global styles
```

## Contact

For demo requests and enquiries: [founders@minml.co.uk](mailto:founders@minml.co.uk)

---

© MINML. All rights reserved.
