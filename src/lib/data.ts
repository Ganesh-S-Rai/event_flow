
import { collection, getDocs, doc, getDoc, addDoc } from 'firebase/firestore';
import { db } from './firebase'; // Make sure you have this file to initialize Firestore
import { unstable_noStore as noStore } from 'next/cache';


export type Event = {
  id: string;
  name: string;
  date: string;
  location: string;
  description: string;
  registrations: number;
  status: 'Draft' | 'Active' | 'Completed' | 'Cancelled';
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
};

const templates: Template[] = [
    {
      id: 'tpl-001',
      name: 'Modern Conference',
      description: 'A sleek, professional template for tech conferences and corporate events.',
      imageUrl: 'https://picsum.photos/seed/tpl1/600/400',
    },
    {
      id: 'tpl-002',
      name: 'Creative Workshop',
      description: 'A vibrant and artistic template perfect for workshops and creative gatherings.',
      imageUrl: 'https://picsum.photos/seed/tpl2/600/400',
    },
    {
      id: 'tpl-003',
      name: 'Community Meetup',
      description: 'A friendly and inviting template for local meetups and community-driven events.',
      imageUrl: 'https://picsum.photos/seed/tpl3/600/400',
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
            console.log("No such document!");
            return undefined;
        }
    } catch (error) {
        console.error("Error fetching event by ID:", error);
        return undefined;
    }
};

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


export const getTemplates = async (): Promise<Template[]> => {
    return Promise.resolve(templates);
};
