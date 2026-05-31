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
    Box: {
      render: component('./src/components/Box.astro'),
      attributes: {
        color: { type: String },
        title: { type: String },
      },
    },
    DiagramFlow: {
      render: component('./src/components/DiagramFlow.astro'),
      attributes: {
        direction: { type: String, default: 'row' },
        title: { type: String },
      },
    },
    DiagramNode: {
      render: component('./src/components/DiagramNode.astro'),
      attributes: {
        label: { type: String, required: true },
        sublabel: { type: String },
        color: { type: String },
      },
    },
    Gallery: {
      render: component('./src/components/Gallery.astro'),
      attributes: {
        cols: { type: Number, default: 3 },
        caption: { type: String },
      },
    },
    GalleryImage: {
      render: component('./src/components/GalleryImage.astro'),
      attributes: {
        src: { type: String, required: true },
        alt: { type: String },
      },
    },
    Carousel: {
      render: component('./src/components/Carousel.astro'),
      attributes: {
        interval: { type: Number, default: 4000 },
      },
    },
    CarouselSlide: {
      render: component('./src/components/CarouselSlide.astro'),
      attributes: {
        src: { type: String, required: true },
        alt: { type: String },
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
