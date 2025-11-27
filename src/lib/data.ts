
import { collection, getDocs, doc, getDoc, addDoc, updateDoc, deleteDoc, query, where, limit } from 'firebase/firestore';
import { db } from './firebase'; // Make sure you have this file to initialize Firestore
import { unstable_noStore as noStore } from 'next/cache';
import { templates } from './templates';

// --- Block Types for Landing Page Content ---
export type Block = {
  id: string;
  type: 'heading' | 'text' | 'image' | 'speaker' | 'agenda' | 'faq' | 'button' | 'hero';
  content: any; // This will vary based on the block type
  styles?: {
    backgroundColor?: string;
    textColor?: string;
    fontSize?: string;
    padding?: string;
    textAlign?: 'left' | 'center' | 'right';
    // Hero specific styles
    headlineStyles?: { fontSize?: string; color?: string; fontWeight?: string };
    subtextStyles?: { fontSize?: string; color?: string; fontWeight?: string };
    buttonStyles?: { fontSize?: string; color?: string; backgroundColor?: string };
  };
};

export interface SpeakerBlockContent {
  name: string;
  role: string;
  bio: string;
  imageUrl: string;
  linkedinUrl?: string;
}

export interface AgendaBlockContent {
  items: {
    time: string;
    title: string;
    description: string;
    speakerId?: string;
  }[];
}

export interface FAQBlockContent {
  items: {
    question: string;
    answer: string;
  }[];
}

export type Event = {
  id: string;
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
  analytics?: {
    views: number;
    clicks: number;
    formSubmissions: number;
  };
  budget?: number; // Total budget allocated for the event
  autoReplyConfig?: {
    enabled: boolean;
    subject: string;
    body: string;
  };
};

export type Lead = {
  id: string;
  name: string;
  email: string;
  eventId: string;
  eventName: string;
  status: 'New' | 'Qualified' | 'Contacted' | 'Converted' | 'Lost' | 'Junk' | 'Attended'; // Expanded status list
  registrationDate: string;
  registrationDetails?: { [key: string]: string };
};

export type Expense = {
  id: string;
  eventId: string;
  eventName: string;
  description: string;
  amount: number;
  date: string;
  category: 'Venue' | 'Catering' | 'Marketing' | 'Travel' | 'Other';
  attachmentUrl?: string;
  status: 'Pending' | 'Approved' | 'Rejected';
};

// --- MOCK DATA STORE ---
const USE_MOCK_DATA = true;

let mockEvents: Event[] = [
  {
    id: 'evt-1',
    name: 'Tech Conference 2024',
    date: new Date().toISOString(),
    location: 'San Francisco, CA',
    description: 'The biggest tech event of the year.',
    registrations: 120,
    status: 'Active',
    slug: 'tech-conf-2024',
    content: [
      { id: 'b1', type: 'hero', content: { headline: 'Tech Conference 2024', text: 'Join us for the future of tech.', buttonText: 'Register Now', backgroundImageSrc: 'https://picsum.photos/seed/tech/1200/800' } },
      { id: 'b2', type: 'text', content: { text: 'Detailed description of the event goes here.' } }
    ],
    analytics: { views: 1250, clicks: 340, formSubmissions: 120 },
    budget: 50000
  },
  {
    id: 'evt-2',
    name: 'Design Workshop',
    date: new Date(Date.now() + 86400000 * 7).toISOString(),
    location: 'Online',
    description: 'Learn the fundamentals of UI/UX design.',
    registrations: 45,
    status: 'Draft',
    content: [],
    analytics: { views: 0, clicks: 0, formSubmissions: 0 },
    budget: 5000
  }
];

let mockLeads: Lead[] = [
  { id: 'l1', name: 'John Doe', email: 'john@example.com', eventId: 'evt-1', eventName: 'Tech Conference 2024', status: 'New', registrationDate: new Date().toISOString() },
  { id: 'l2', name: 'Jane Smith', email: 'jane@example.com', eventId: 'evt-1', eventName: 'Tech Conference 2024', status: 'Converted', registrationDate: new Date().toISOString() }
];

let mockExpenses: Expense[] = [
  { id: 'exp-1', eventId: 'evt-1', eventName: 'Tech Conference 2024', description: 'Catering Deposit', amount: 1500, date: new Date().toISOString(), category: 'Catering', status: 'Approved' },
  { id: 'exp-2', eventId: 'evt-1', eventName: 'Tech Conference 2024', description: 'Facebook Ads', amount: 500, date: new Date().toISOString(), category: 'Marketing', status: 'Pending' }
];


export const getEvents = async (): Promise<Event[]> => {
  noStore();
  if (USE_MOCK_DATA) return Promise.resolve(mockEvents);

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
  if (USE_MOCK_DATA) return Promise.resolve(mockLeads);

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

export const getExpenses = async (): Promise<Expense[]> => {
  noStore();
  if (USE_MOCK_DATA) return Promise.resolve(mockExpenses);
  // Implement Firestore fetch if needed later
  return [];
};

export const addExpense = async (expense: Omit<Expense, 'id'>) => {
  if (USE_MOCK_DATA) {
    const newExpense = { ...expense, id: `exp-${Date.now()}` };
    mockExpenses.push(newExpense);
    return Promise.resolve(newExpense.id);
  }
  // Implement Firestore add if needed later
  return "";
};

export const getEventById = async (id: string): Promise<Event | undefined> => {
  noStore();
  if (USE_MOCK_DATA) {
    const event = mockEvents.find(e => e.id === id);
    if (event) return Promise.resolve(event);

    // Check templates
    const template = templates.find(t => t.id === id);
    if (template) {
      return Promise.resolve({
        id: `evt-from-${template.id}`,
        name: template.name,
        description: template.description,
        date: new Date().toISOString(),
        location: 'Online',
        registrations: 0,
        status: 'Draft',
        content: template.content,
        formFields: [
          { id: 'ff-fname', label: 'First Name', type: 'text', placeholder: 'Enter your first name' },
          { id: 'ff-lname', label: 'Last Name', type: 'text', placeholder: 'Enter your last name' },
          { id: 'ff-email', label: 'Work Email', type: 'email', placeholder: 'name@company.com' },
        ],
        analytics: { views: 0, clicks: 0, formSubmissions: 0 }
      });
    }
    return undefined;
  }

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
          id: `evt-from-${template.id}`, // Use a predictable, non-dynamic ID
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
          ],
          analytics: { views: 0, clicks: 0, formSubmissions: 0 }
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
  if (USE_MOCK_DATA) {
    return Promise.resolve(mockEvents.find(e => e.slug === slug));
  }

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

export const createEvent = async (eventData: Omit<Event, 'id' | 'registrations' | 'status' | 'analytics'>) => {
  if (USE_MOCK_DATA) {
    const newId = `evt-${Date.now()}`;
    const newEvent: Event = {
      id: newId,
      ...eventData,
      registrations: 0,
      status: 'Draft',
      analytics: { views: 0, clicks: 0, formSubmissions: 0 }
    };
    mockEvents.push(newEvent);
    return Promise.resolve(newId);
  }

  try {
    const docRef = await addDoc(collection(db, "events"), {
      ...eventData,
      registrations: 0,
      status: 'Draft', // Default status
      analytics: { views: 0, clicks: 0, formSubmissions: 0 }
    });
    return docRef.id;
  } catch (error) {
    console.error("Error adding document: ", error);
    throw new Error("Failed to create event in database.");
  }
}

export const updateEvent = async (eventId: string, eventData: Partial<Event>) => {
  if (USE_MOCK_DATA) {
    if (eventId.startsWith('evt-from-')) {
      const newId = await createEvent({
        name: eventData.name || 'New Event',
        date: eventData.date || new Date().toISOString(),
        location: eventData.location || 'Online',
        description: eventData.description || '',
        content: eventData.content || [],
        formFields: eventData.formFields || [],
      });
      // Apply updates to the newly created event
      const index = mockEvents.findIndex(e => e.id === newId);
      if (index !== -1) {
        mockEvents[index] = { ...mockEvents[index], ...eventData };
      }
      return Promise.resolve(newId);
    }

    const index = mockEvents.findIndex(e => e.id === eventId);
    if (index !== -1) {
      mockEvents[index] = { ...mockEvents[index], ...eventData };
      return Promise.resolve(eventId);
    }
    throw new Error("Event not found in mock data");
  }

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


export const deleteEvent = async (eventId: string) => {
  if (USE_MOCK_DATA) {
    mockEvents = mockEvents.filter(e => e.id !== eventId);
    return Promise.resolve();
  }

  try {
    await deleteDoc(doc(db, "events", eventId));
  } catch (error) {
    console.error("Error deleting document: ", error);
    throw new Error("Failed to delete event.");
  }
}

export const addLead = async (leadData: Omit<Lead, 'id' | 'registrationDate' | 'status'>) => {
  if (USE_MOCK_DATA) {
    const newLead: Lead = {
      id: `lead-${Date.now()}`,
      ...leadData,
      status: 'New',
      registrationDate: new Date().toISOString()
    };
    mockLeads.push(newLead);

    // Update event analytics
    const eventIndex = mockEvents.findIndex(e => e.id === leadData.eventId);
    if (eventIndex !== -1) {
      const currentAnalytics = mockEvents[eventIndex].analytics || { views: 0, clicks: 0, formSubmissions: 0 };
      mockEvents[eventIndex] = {
        ...mockEvents[eventIndex],
        analytics: {
          ...currentAnalytics,
          formSubmissions: (currentAnalytics.formSubmissions || 0) + 1
        }
      };
    }

    return Promise.resolve(newLead.id);
  }

  try {
    const docRef = await addDoc(collection(db, "leads"), {
      ...leadData,
      status: 'New',
      registrationDate: new Date().toISOString()
    });
    // Note: In a real app, we'd also increment the event analytics counter here using a transaction or cloud function
    return docRef.id;
  } catch (error) {
    console.error("Error adding lead: ", error);
    throw new Error("Failed to add lead.");
  }
}

export const updateLeadStatus = async (leadId: string, status: Lead['status']) => {
  if (USE_MOCK_DATA) {
    const leadIndex = mockLeads.findIndex(l => l.id === leadId);
    if (leadIndex !== -1) {
      mockLeads[leadIndex] = { ...mockLeads[leadIndex], status };
    }
    return Promise.resolve();
  }

  try {
    const leadRef = doc(db, 'leads', leadId);
    await updateDoc(leadRef, { status });
  } catch (error) {
    console.error("Error updating lead status: ", error);
    throw new Error("Failed to update lead status.");
  }
}
