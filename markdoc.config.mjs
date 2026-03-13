import { defineMarkdocConfig, component, nodes } from '@astrojs/markdoc/config';

export default defineMarkdocConfig({
  tags: {
    Spotify: {
      render: component('./src/components/Spotify.astro'),
      attributes: {
        url: { type: String, required: true },
      },
    },
    YouTube: {
      render: component('./src/components/YouTube.astro'),
      attributes: {
        id: { type: String },
        url: { type: String },
      },
    },
    Twitter: {
      render: component('./src/components/Twitter.astro'),
      attributes: {
        url: { type: String },
        id: { type: String },
        username: { type: String },
      },
    },
    Math: {
      render: component('./src/components/Math.astro'),
    },
    InlineMath: {
      render: component('./src/components/InlineMath.astro'),
    },
    LinkCard: {
      render: component('./src/components/LinkCard.astro'),
      attributes: {
        id: { type: String },
        url: { type: String },
        collection: { type: String, default: 'blog' },
      },
    },
  },
  nodes: {
    fence: {
      render: component('./src/components/CodeBlock.astro'),
      attributes: {
        content: { type: String },
        language: { type: String },
      },
    },
  },
});
