export type ColorScheme =
  | "neon"
  | "cyberpunk"
  | "plasma"
  | "warm"
  | "ocean"
  | "sunset"
  | "aurora"
  | "mono"
  | "random";

const colorSchemes: Record<ColorScheme, string[]> = {
  neon: ["#00ff88", "#00ccff", "#ff00ff", "#ffcc00"],
  cyberpunk: ["#ff006e", "#8338ec", "#3a86ff", "#06ffa5"],
  plasma: ["#ff006e", "#ff0080", "#ff3c87", "#ff6b9d", "#ffa8c5"],
  warm: ["#ff6b35", "#ff8c42", "#ffc93c", "#ff8c00"],
  ocean: ["#0093e9", "#80d0c7", "#00c896", "#01baef"],
  sunset: ["#ff6b6b", "#ff8e72", "#feca57", "#ff9ff3"],
  aurora: ["#00c3ff", "#ffff1c", "#ff61a6", "#a200ff"],
  mono: ["#22223b", "#4a4e69", "#9a8c98", "#c9ada7"],
  random: Array.from(
    { length: 5 },
    () =>
      `#${Math.floor(Math.random() * 0xffffff)
        .toString(16)
        .padStart(6, "0")}`,
  ),
};

export function getColorScheme(scheme: ColorScheme): string[] {
  if (scheme === "random") {
    return (colorSchemes.random = Array.from(
      { length: 5 },
      () =>
        `#${Math.floor(Math.random() * 0xffffff)
          .toString(16)
          .padStart(6, "0")}`,
    ));
  }
  return colorSchemes[scheme] || colorSchemes.neon;
}

export function createGradient(
  ctx: CanvasRenderingContext2D,
  scheme: ColorScheme,
  width: number,
  height: number,
  style: "vertical" | "horizontal" | "radial" = "vertical",
): CanvasGradient {
  const colors = getColorScheme(scheme);

  let gradient: CanvasGradient;

  if (style === "vertical") {
    gradient = ctx.createLinearGradient(0, 0, 0, height);
  } else if (style === "horizontal") {
    gradient = ctx.createLinearGradient(0, 0, width, 0);
  } else {
    gradient = ctx.createRadialGradient(
      width / 2,
      height / 2,
      0,
      width / 2,
      height / 2,
      Math.max(width, height),
    );
  }

  const stopInterval = 1 / (colors.length - 1);
  colors.forEach((color, index) => {
    gradient.addColorStop(index * stopInterval, color);
  });

  return gradient;
}

export const allColorSchemes: ColorScheme[] = [
  "neon",
  "cyberpunk",
  "plasma",
  "warm",
  "ocean",
  "sunset",
  "aurora",
  "mono",
  "random",
];
