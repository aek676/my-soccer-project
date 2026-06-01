# Resources

Place your source images here:

- `icon.png` — 1024x1024 app icon
- `splash.png` — 2732x2732 splash screen

Then generate native assets:

```bash
bun add -d @capacitor/assets
bunx capacitor-assets generate --android
```

This populates `android/app/src/main/res/` with all required sizes.
