# App icons

Generated, not hand made. The source is the brand mark `src/app/icon.svg`;
`icon-maskable.svg` is the same mark on a full-bleed square with the glyph
scaled into the maskable safe zone (inner ~80%).

To regenerate after a design change (needs Homebrew `rsvg-convert`):

```sh
rsvg-convert -w 192 -h 192 src/app/icon.svg > public/icons/icon-192.png
rsvg-convert -w 512 -h 512 src/app/icon.svg > public/icons/icon-512.png
rsvg-convert -w 512 -h 512 public/icons/icon-maskable.svg > public/icons/icon-maskable-512.png
rsvg-convert -w 180 -h 180 public/icons/icon-maskable.svg > public/icons/apple-touch-icon.png
```

`src/app/manifest.ts` and the root layout metadata point at these files.

## Brand lockups

`public/brand/` holds the horizontal logo (`logo.svg` for light surfaces,
`logo-dark.svg` for dark ones) and the standalone tile `mark.svg`. The
wordmark is "Track Taka" set in Manrope Bold, converted to outlines so the
files need no font. The mark is a 3×3 field of entries with a route stepping up through them
and an amber marker on today, on the brand blue `#0a7fc4` (`src/lib/brand.ts`).
