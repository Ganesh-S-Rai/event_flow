export type Event = {
  id: string;
  name: string;
  date: string;
  location: string;
  description: string;
  registrations: number;
};

export type Lead = {
  id: string;
  name: string;
  email: string;
  eventId: string;
  eventName: string;
  status: 'New' | 'Contacted' | 'Converted' | 'Lost';
  registrationDate: string;
};

const events: Event[] = [
  {
    id: 'evt-001',
    name: 'InnovateX 2024',
    date: '2024-10-26',
    location: 'San Francisco, CA',
    description: 'The premier conference for technology and innovation. Join industry leaders, venture capitalists, and brilliant founders to explore the future of tech.',
    registrations: 1254,
  },
  {
    id: 'evt-002',
    name: 'Quantum Computing Summit',
    date: '2024-11-15',
    location: 'Virtual',
    description: 'A deep dive into the world of quantum computing, featuring workshops and talks from leading researchers and engineers.',
    registrations: 832,
  },
  {
    id: 'evt-003',
    name: 'AI in Healthcare Symposium',
    date: '2024-12-05',
    location: 'Boston, MA',
    description: 'Exploring the transformative impact of artificial intelligence on patient care, medical research, and healthcare operations.',
    registrations: 621,
  },
  {
    id: 'evt-004',
    name: 'Future of Work Expo',
    date: '2025-01-20',
    location: 'New York, NY',
    description: 'Discover the latest trends and technologies shaping the modern workplace, from remote collaboration to AI-driven productivity tools.',
    registrations: 234,
  },
  {
    id: 'evt-005',
    name: 'GreenTech Innovators Meetup',
    date: '2025-02-12',
    location: 'Austin, TX',
    description: 'A community meetup for professionals and enthusiasts in the sustainable technology space. Network and share ideas.',
    registrations: 78,
  },
];

const getLeadsForEvent = (event: Event, count: number): Lead[] => {
  const leads: Lead[] = [];
  const statuses: Lead['status'][] = ['New', 'Contacted', 'Converted', 'Lost'];
  for (let i = 1; i <= count; i++) {
    const registrationDate = new Date(event.date);
    registrationDate.setDate(registrationDate.getDate() - Math.floor(Math.random() * 60));
    leads.push({
      id: `lead-${event.id}-${i}`,
      name: `Lead ${i}`,
      email: `lead${i}.${event.id}@example.com`,
      eventId: event.id,
      eventName: event.name,
      status: statuses[i % statuses.length],
      registrationDate: registrationDate.toISOString().split('T')[0],
    });
  }
  return leads;
};

const leads: Lead[] = events.flatMap(event => getLeadsForEvent(event, event.registrations));

export const getEvents = async (): Promise<Event[]> => {
  return Promise.resolve(events);
};

export const getLeads = async (): Promise<Lead[]> => {
  return Promise.resolve(leads);
};

export const getEventById = async (id: string): Promise<Event | undefined> => {
  return Promise.resolve(events.find(e => e.id === id));
};
