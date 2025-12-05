const HexGridBackground = () => {
  return (
    <svg
      className="absolute inset-0 w-full h-full"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <defs>
        <pattern
          id="hex-pattern"
          width="56"
          height="100"
          patternUnits="userSpaceOnUse"
          patternTransform="scale(1.5)"
        >
          {/* Hexagon grid lines */}
          <path
            d="M28 66L0 50L0 16L28 0L56 16L56 50L28 66Z"
            fill="none"
            stroke="currentColor"
            strokeWidth="0.5"
            className="text-foreground/[0.06]"
          />
          <path
            d="M28 100L0 84L0 50L28 34L56 50L56 84L28 100Z"
            fill="none"
            stroke="currentColor"
            strokeWidth="0.5"
            className="text-foreground/[0.06]"
          />
        </pattern>

        {/* Gradient for highlighted hexes */}
        <radialGradient id="hex-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="hsl(16, 65%, 55%)" stopOpacity="0.15" />
          <stop offset="100%" stopColor="hsl(16, 65%, 55%)" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Base pattern */}
      <rect width="100%" height="100%" fill="url(#hex-pattern)" />

      {/* Highlighted hex cells - positioned to suggest "hotspots" */}
      <g className="opacity-60">
        {/* Top right cluster */}
        <polygon
          points="740,120 770,137 770,171 740,188 710,171 710,137"
          fill="hsl(16, 65%, 55%)"
          fillOpacity="0.08"
        />
        <polygon
          points="796,120 826,137 826,171 796,188 766,171 766,137"
          fill="hsl(16, 65%, 55%)"
          fillOpacity="0.12"
        />
        <polygon
          points="768,171 798,188 798,222 768,239 738,222 738,188"
          fill="hsl(16, 65%, 55%)"
          fillOpacity="0.06"
        />

        {/* Center-left accent */}
        <polygon
          points="200,300 230,317 230,351 200,368 170,351 170,317"
          fill="hsl(170, 35%, 55%)"
          fillOpacity="0.08"
        />
        <polygon
          points="256,300 286,317 286,351 256,368 226,351 226,317"
          fill="hsl(170, 35%, 55%)"
          fillOpacity="0.1"
        />

        {/* Bottom cluster */}
        <polygon
          points="500,450 530,467 530,501 500,518 470,501 470,467"
          fill="hsl(16, 65%, 55%)"
          fillOpacity="0.1"
        />
        <polygon
          points="556,450 586,467 586,501 556,518 526,501 526,467"
          fill="hsl(16, 65%, 55%)"
          fillOpacity="0.06"
        />
      </g>
    </svg>
  );
};

export default HexGridBackground;
