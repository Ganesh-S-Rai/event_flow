
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
      name: 'Modern Conference',
      description: 'A sleek, professional template for tech conferences and corporate events.',
      imageUrl: 'https://picsum.photos/seed/tpl1/600/400',
      content: [
        { id: 'block-1', type: 'hero', content: { headline: 'InnovateX 2024', text: 'Join us for the most anticipated tech conference of the year. Discover the future of innovation.', buttonText: 'Register Now', backgroundImageSrc: 'https://picsum.photos/seed/event-hero/1200/800' } },
        { id: 'block-2', type: 'heading', content: { text: 'About The Event', level: 'h2', alignment: 'center' } },
        { id: 'block-3', type: 'text', content: { text: 'This is where your event description will go. It should be exciting and informative, telling people why they should attend. This template provides a clean and modern layout to showcase your event details effectively.', alignment: 'left' } },
        { id: 'block-4', type: 'image', content: { src: 'https://picsum.photos/seed/img1/1200/500', alt: 'Conference stage' } },
      ]
    },
    {
      id: 'tpl-002',
      name: 'Creative Workshop',
      description: 'A vibrant and artistic template perfect for workshops and creative gatherings.',
      imageUrl: 'https://picsum.photos/seed/tpl2/600/400',
      content: [
        { id: 'block-1', type: 'hero', content: { headline: 'Unlock Your Creativity', text: 'A hands-on workshop designed for artists, designers, and creators of all levels.', buttonText: 'Reserve Your Spot', backgroundImageSrc: 'https://picsum.photos/seed/workshop-hero/1200/800' } },
        { id: 'block-2', type: 'heading', content: { text: 'What You Will Learn', level: 'h2', alignment: 'left' } },
        { id: 'block-3', type: 'text', content: { text: 'This workshop covers a variety of techniques and skills. You will leave with a completed project and a new set of creative tools.', alignment: 'left' } },
      ]
    },
    {
      id: 'tpl-003',
      name: 'Community Meetup',
      description: 'A friendly and inviting template for local meetups and community-driven events.',
      imageUrl: 'https://picsum.photos/seed/tpl3/600/400',
      content: [
        { id: 'block-1', type: 'heading', content: { text: 'Community Networking Night', level: 'h1', alignment: 'left' } },
        { id: 'block-2', type: 'text', content: { text: 'Connect with local professionals and enthusiasts in a relaxed and friendly atmosphere.', alignment: 'left' } },
        { id: 'block-3', type: 'button', content: { text: 'RSVP Now', alignment: 'left' } },
        { id: 'block-4', 'type': 'image', content: { src: 'https://picsum.photos/seed/meetup-hero/1200/500', alt: 'People networking at a meetup' } },
        { id: 'block-5', type: 'heading', content: { text: 'Event Details', level: 'h2', alignment: 'left' } },
        { id: 'block-6', type: 'text', content: { text: 'Join us for an evening of networking, snacks, and great conversations. We look forward to seeing you there!', alignment: 'left' } },
      ]
    },
  ];

export const getTemplates = async (): Promise<Template[]> => {
    return Promise.resolve(templates);
};
