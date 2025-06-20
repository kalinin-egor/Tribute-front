# Assets Directory

This directory contains all static assets for the Tribute frontend application.

## Structure

```
assets/
├── images/     # Image files (PNG, JPG, SVG, etc.)
├── icons/      # Icon files (SVG icons, favicon, etc.)
└── fonts/      # Custom font files (if any)
```

## Usage

### Images
- Store all image files in the `images/` folder
- Supported formats: PNG, JPG, JPEG, GIF, SVG, WebP
- Use relative imports in your components:
  ```tsx
  import logo from '../assets/images/logo.png';
  ```

### Icons
- Store icon files in the `icons/` folder
- Prefer SVG format for icons (scalable, smaller file size)
- Use relative imports in your components:
  ```tsx
  import { ReactComponent as TelegramIcon } from '../assets/icons/telegram.svg';
  ```

### Fonts
- Store custom font files in the `fonts/` folder
- Import in your CSS files:
  ```css
  @font-face {
    font-family: 'CustomFont';
    src: url('../assets/fonts/CustomFont.woff2') format('woff2');
  }
  ```

## Webpack Configuration

The webpack configuration is already set up to handle these asset types:
- Images: `asset/resource` - files are copied to output directory
- Fonts: `asset/resource` - files are copied to output directory
- SVG: Can be imported as React components or as URLs

## Best Practices

1. **Optimize images** before adding them to the project
2. **Use appropriate formats**: SVG for icons, WebP/PNG for photos
3. **Keep file sizes small** for better performance
4. **Use descriptive filenames** for easy identification
5. **Organize by feature** if you have many assets (e.g., `images/auth/`, `images/profile/`) 