# Install prompt screenshots

Generated, not hand made. The frames live in `src/views/screenshots` and the
manifest (`src/app/manifest.ts`) points at the files here.

To regenerate after a design change:

1. Run `pnpm dev`.
2. Open `/screenshots` and use Download PNG (2x) per frame, or
3. open `/screenshots/<id>` in a browser whose viewport matches the frame's
   CSS size (540x960 for phones, 1280x720 for desktop) at device pixel ratio 2
   and take a viewport screenshot. That is what produced the current files.

Keep one aspect ratio per form factor; Chrome ignores the set otherwise.
