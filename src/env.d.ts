/// <reference types="astro/client" />

declare module "*.astro" {
  const Component: import("astro").AstroComponentFactory;
  export default Component;
}
