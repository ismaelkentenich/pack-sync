export const palette = {
  white: "#FFFFFF",
  black: "#000000",

  /**
   * Primary / Brand
   *
   * Base:
   * Splash background: #6F5BD2
   * Dark brand surface: #4A39A4
   */
  ultramarine: {
    50: "#F5F2FF",
    100: "#ECE7FF",
    200: "#D9D0FF",
    300: "#BEAEF6",
    400: "#9480E5",
    500: "#7D68D9",
    600: "#6F5BD2",
    700: "#5D49BC",
    800: "#4A39A4",
    900: "#3A2D80",
  },

  /**
   * Secondary / Accent
   *
   * Base:
   * Splash package/scan mark: #F6C945
   */
  golden: {
    50: "#FFFBEA",
    100: "#FFF4C7",
    200: "#FFE99A",
    300: "#FFDD69",
    400: "#F6C945",
    500: "#DCAE28",
    600: "#B88D18",
    700: "#8F6B11",
    800: "#674D10",
    900: "#45340D",
  },

  /**
   * Neutral
   *
   * Slightly purple-tinted whites so neutral surfaces
   * feel consistent with #FAF8FF from the splash.
   */
  neutral: {
    0: "#FFFFFF",
    50: "#FAF8FF",
    100: "#F5F2FA",
    200: "#ECE8F1",
    300: "#D8D3DF",
    400: "#B6B0BE",
    500: "#8B8592",
    600: "#68626E",
    700: "#49444F",
    800: "#302C36",
    900: "#191822",
    950: "#0E0D13",
  },

  green: {
    50: "#EDF9F1",
    500: "#239B56",
    700: "#176B3A",
  },

  amber: {
    50: "#FFF8E8",
    500: "#D98500",
    700: "#945C00",
  },

  red: {
    50: "#FFF1F1",
    500: "#D92D20",
    700: "#9E1F17",
  },
} as const;
