import { defineEcConfig } from 'astro-expressive-code';

export default defineEcConfig({
  themes: ['github-dark', 'github-light'],
  useDarkModeMediaQuery: false,
  themeCssSelector: (theme) =>
    theme.type === 'dark'
      ? '[data-theme="dark"],[data-theme="synthwave"],[data-theme="dim"]'
      : '[data-theme="light"],[data-theme="retro"],[data-theme="valentine"]',
});
