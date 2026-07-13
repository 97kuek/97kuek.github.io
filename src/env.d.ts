/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly ZENN_USERNAME?: string;
  readonly QIITA_USERNAME?: string;
  readonly NOTE_USERNAME?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare module "*.astro" {
  const Component: import("astro").AstroComponentFactory;
  export default Component;
}
