

import { collection, getDocs, doc, getDoc, addDoc, updateDoc, query, where, limit } from 'firebase/firestore';
import { db } from './firebase'; // Make sure you have this file to initialize Firestore
import { unstable_noStore as noStore } from 'next/cache';

// --- Block Types for Landing Page Content ---
export type Block = {
  id: string;
  type: 'heading' | 'text' | 'image' | 'speaker' | 'agenda' | 'button' | 'hero';
  content: any; // This will vary based on the block type
};

export type Event = {
  id:string;
  name: string;
  date: string;
  location: string;
  description: string;
  registrations: number;
  status: 'Draft' | 'Active' | 'Completed' | 'Cancelled';
  slug?: string;

  // New flexible content structure
  content?: Block[];

  // Form fields remain separate as they define the registration logic
  formFields?: { id: string; label: string; type: 'text' | 'email' | 'tel' | 'select'; placeholder: string; options?: string[] }[];
};

export type Lead = {
  id: string;
  name: string;
  email: string;
  eventId: string;
  eventName: string;
  status: 'New' | 'Contacted' | 'Converted' | 'Lost';
  registrationDate: string;
  registrationDetails?: { [key: string]: string };
};

export type Template = {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  content: Block[]; // Templates are now defined by their block structure
};

const templates: Template[] = [
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

export const getEvents = async (): Promise<Event[]> => {
  noStore();
  try {
    const querySnapshot = await getDocs(collection(db, "events"));
    const events: Event[] = [];
    querySnapshot.forEach((doc) => {
      events.push({ id: doc.id, ...doc.data() } as Event);
    });
    return events;
  } catch (error) {
    console.error("Error fetching events:", error);
    return [];
  }
};

export const getLeads = async (): Promise<Lead[]> => {
  noStore();
  try {
    const querySnapshot = await getDocs(collection(db, "leads"));
    const leads: Lead[] = [];
    querySnapshot.forEach((doc) => {
      leads.push({ id: doc.id, ...doc.data() } as Lead);
    });
    return leads;
  } catch (error) {
    console.error("Error fetching leads:", error);
    return [];
  }
};

export const getEventById = async (id: string): Promise<Event | undefined> => {
    noStore();
    try {
        const docRef = doc(db, 'events', id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            return { id: docSnap.id, ...docSnap.data() } as Event;
        } else {
            // Check if it's a template ID
            const template = templates.find(t => t.id === id);
            if (template) {
                // Return an event object based on the template
                return {
                    id: `evt-from-${template.id}-${Date.now()}`, // Temporary ID for creation
                    name: template.name,
                    description: template.description,
                    date: new Date().toISOString(),
                    location: 'Online',
                    registrations: 0,
                    status: 'Draft',
                    content: template.content, // Use the block content from the template
                    formFields: [ // Add default form fields for new events from templates
                        { id: 'ff-fname', label: 'First Name', type: 'text', placeholder: 'Enter your first name' },
                        { id: 'ff-lname', label: 'Last Name', type: 'text', placeholder: 'Enter your last name' },
                        { id: 'ff-email', label: 'Work Email', type: 'email', placeholder: 'name@company.com' },
                    ]
                };
            }
            console.log("No such document or template!");
            return undefined;
        }
    } catch (error) {
        console.error("Error fetching event by ID:", error);
        return undefined;
    }
};

export const getEventBySlug = async (slug: string): Promise<Event | undefined> => {
    noStore();
    try {
        const q = query(collection(db, "events"), where("slug", "==", slug), limit(1));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
            const docSnap = querySnapshot.docs[0];
            return { id: docSnap.id, ...docSnap.data() } as Event;
        }
        return undefined;
    } catch (error) {
        console.error("Error fetching event by slug:", error);
        return undefined;
    }
}

export const createEvent = async (eventData: Omit<Event, 'id' | 'registrations' | 'status'>) => {
    try {
        const docRef = await addDoc(collection(db, "events"), {
            ...eventData,
            registrations: 0,
            status: 'Draft', // Default status
        });
        return docRef.id;
    } catch (error) {
        console.error("Error adding document: ", error);
        throw new Error("Failed to create event in database.");
    }
}

export const updateEvent = async (eventId: string, eventData: Partial<Event>) => {
    try {
        // If the event ID indicates it's a new one from a template, create it first.
        if (eventId.startsWith('evt-from-')) {
            const newId = await createEvent({
                name: eventData.name || 'New Event',
                date: eventData.date || new Date().toISOString(),
                location: eventData.location || 'Online',
                description: eventData.description || '',
                content: eventData.content || [],
                formFields: eventData.formFields || [],
            });
            const eventRef = doc(db, 'events', newId);
            await updateDoc(eventRef, eventData);
            return newId;
        } else {
            const eventRef = doc(db, 'events', eventId);
            await updateDoc(eventRef, eventData);
            return eventId;
        }
    } catch (error) {
        console.error("Error updating document: ", error);
        throw new Error("Failed to update event in database.");
    }
}


export const getTemplates = async (): Promise<Template[]> => {
    return Promise.resolve(templates);
};
