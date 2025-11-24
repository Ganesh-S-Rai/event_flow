
import type { Block } from './data';

export type Template = {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  content: Block[]; // Templates are now defined by their block structure
};

export const templates: Template[] = [
  {
    id: 'tpl-001',
    name: 'MarTech Mashup 2025',
    description: 'The ultimate networking mixer for B2C marketing leaders. A vibrant, high-energy template designed for community building, knowledge sharing, and exploring the future of MarTech.',
    imageUrl: '/martech_mashup_thumbnail.png',
    content: [
      { id: 'block-1', type: 'hero', content: { headline: 'MarTech Mashup: The Intelligent Shift', text: 'Join the most exclusive community of marketers for an evening of insights, networking, and cocktails. Discover how Gen-AI is reshaping customer engagement while connecting with industry peers.', buttonText: 'Request Invitation', backgroundImageSrc: '/martech_mashup_thumbnail.png' } },
      { id: 'block-2', type: 'heading', content: { text: 'Why Attend?', level: 'h2', alignment: 'center' } },
      { id: 'block-3', type: 'text', content: { text: 'Connect with top CMOs and digital leaders. Explore the "Agentic Marketing Stack" in a relaxed setting. No pitches, just pure value and relationships.', alignment: 'left' } },
      { id: 'block-4', type: 'image', content: { src: '/networking_event_people.png', alt: 'MarTech Mashup Networking' } },
    ]
  },
  {
    id: 'tpl-002',
    name: 'Ecommerce Summit',
    description: 'A premier conference template for large-scale industry events. Perfect for showcasing thought leadership, keynote sessions, and digital transformation trends in retail.',
    imageUrl: '/ecommerce_summit_thumbnail.png',
    content: [
      { id: 'block-1', type: 'hero', content: { headline: 'The Ecommerce Summit 2025', text: 'Unlocking the future of personalized shopping. Join 500+ retail innovators to discuss AI-driven discovery, visual search, and the next era of customer retention.', buttonText: 'Get Your Pass', backgroundImageSrc: '/ecommerce_summit_thumbnail.png' } },
      { id: 'block-2', type: 'heading', content: { text: 'Keynote Speakers', level: 'h2', alignment: 'left' } },
      { id: 'block-3', type: 'text', content: { text: 'Hear from the visionaries behind the world\'s fastest-growing D2C brands. Learn actionable strategies to boost LTV and reduce CAC in a competitive market.', alignment: 'left' } },
      { id: 'block-4', type: 'image', content: { src: '/product_demo_dashboard.png', alt: 'Ecommerce Analytics' } },
    ]
  },
  {
    id: 'tpl-003',
    name: 'Agentic Marketing Revolution',
    description: 'A futuristic, tech-forward template for launching new AI innovations. Ideal for announcing autonomous marketing agents and next-gen automation tools.',
    imageUrl: '/agentic_marketing_thumbnail.png',
    content: [
      { id: 'block-1', type: 'hero', content: { headline: 'Agentic Marketing: Beyond Automation', text: 'Welcome to the era of autonomous marketing. Witness the launch of Netcore\'s Agentic AI Stack—where AI doesn\'t just assist, it acts. Transform your marketing operations today.', buttonText: 'Watch the Reveal', backgroundImageSrc: '/agentic_marketing_thumbnail.png' } },
      { id: 'block-2', type: 'heading', content: { text: 'The Shift to Autonomy', level: 'h2', alignment: 'left' } },
      { id: 'block-3', type: 'text', content: { text: 'Move from campaign management to goal setting. Our AI agents analyze, decide, and execute complex multi-channel journeys in real-time, delivering hyper-personalization at scale.', alignment: 'left' } },
      { id: 'block-4', 'type': 'image', content: { src: '/product_demo_dashboard.png', alt: 'Agentic AI Dashboard' } },
    ]
  },
];

export const getTemplates = async (): Promise<Template[]> => {
  return Promise.resolve(templates);
};
