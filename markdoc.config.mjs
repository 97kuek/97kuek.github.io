import { defineMarkdocConfig, component } from '@astrojs/markdoc/config';

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
    LinkCard: {
      render: component('./src/components/LinkCard.astro'),
      attributes: {
        id: { type: String },
        url: { type: String },
        collection: { type: String, default: 'blog' },
      },
    },
  },
});
