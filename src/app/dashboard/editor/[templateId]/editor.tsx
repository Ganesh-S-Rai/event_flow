

'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import Image from 'next/image';
import { Calendar, MapPin, Ticket, Plus, Trash2, X } from 'lucide-react';
import Link from 'next/link';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// --- Types ---
type Speaker = {
  id: string;
  name: string;
  title: string;
  avatarUrl: string;
};

type AgendaItem = {
  id: string;
  time: string;
  title: string;
  description: string;
};

type FormField = {
  id: string;
  label: string;
  type: 'text' | 'email' | 'tel' | 'select';
  placeholder: string;
  options?: string[];
}

function RegistrationForm({ open, onOpenChange, fields }: { open: boolean, onOpenChange: (open: boolean) => void, fields: FormField[] }) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-2xl">
                 <DialogHeader>
                    <DialogTitle>Tell us about you</DialogTitle>
                </DialogHeader>
                <form className="space-y-6 pt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {fields.map(field => {
                            if (field.type === 'select') {
                                return (
                                    <div key={field.id} className="space-y-2 col-span-2">
                                        <Label htmlFor={field.id}>{field.label}</Label>
                                        <Select>
                                            <SelectTrigger id={field.id}>
                                                <SelectValue placeholder={field.placeholder} />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {field.options?.map((option, index) => (
                                                    <SelectItem key={index} value={option}>{option}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                )
                            }
                            return (
                                <div key={field.id} className="space-y-2">
                                    <Label htmlFor={field.id}>{field.label}</Label>
                                    <Input id={field.id} type={field.type} placeholder={field.placeholder} />
                                </div>
                            )
                        })}
                    </div>
                    <div className="flex items-start space-x-3">
                        <Checkbox id="consent" defaultChecked />
                        <Label htmlFor="consent" className="text-sm text-muted-foreground font-normal">
                            By submitting your information, you consent to us contacting you about our content, products, and services and agree to our <Link href="#" className="underline text-primary">privacy policy</Link>.
                        </Label>
                    </div>
                    <Button type="submit" className="w-full">Submit</Button>
                </form>
            </DialogContent>
        </Dialog>
    );
}

function LandingPagePreview({
  heroTitle,
  heroCta,
  heroImageUrl,
  aboutTitle,
  aboutDescription,
  speakersTitle,
  speakers,
  agendaTitle,
  agenda,
  formFields,
}: {
  heroTitle: string;
  heroCta: string;
  heroImageUrl: string;
  aboutTitle: string;
  aboutDescription: string;
  speakersTitle: string;
  speakers: Speaker[];
  agendaTitle: string;
  agenda: AgendaItem[];
  formFields: FormField[];
}) {
  const event = {
    name: heroTitle || 'Your Event Name',
    date: '2024-10-26',
    location: 'San Francisco, CA',
  };
  
  const [isFormOpen, setIsFormOpen] = useState(false);

  return (
    <div className="bg-background text-foreground border rounded-lg overflow-y-auto w-[125%] h-[125%] origin-top-left scale-[0.8]">
      <RegistrationForm open={isFormOpen} onOpenChange={setIsFormOpen} fields={formFields} />
      <header className="px-4 lg:px-6 h-14 flex items-center bg-background/80 backdrop-blur-sm sticky top-0 z-20 border-b">
        <Link
          href="#"
          className="flex items-center justify-center font-bold"
          prefetch={false}
        >
          EventFlow
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Button asChild>
            <Link href="#register" onClick={(e) => { e.preventDefault(); setIsFormOpen(true); }}>
              <Ticket className="mr-2" />
              {heroCta || 'Register Now'}
            </Link>
          </Button>
        </nav>
      </header>
      <main>
        {/* Hero Section */}
        <section className="relative h-[50vh] flex items-center justify-center text-center text-primary-foreground">
          <Image
            src={heroImageUrl || "https://picsum.photos/seed/hero-event/1200/800"}
            alt={event.name}
            fill
            className="object-cover -z-10"
            data-ai-hint="event stage"
          />
          <div className="absolute inset-0 bg-black/50 -z-10" />
          <div className="container px-4 md:px-6 space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tighter">
              {event.name}
            </h1>
            <div className="flex items-center justify-center gap-4 md:gap-8 text-md">
              <div className="flex items-center gap-2">
                <Calendar className="size-5" />
                <span>
                  {new Date(event.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="size-5" />
                <span>{event.location}</span>
              </div>
            </div>
            <Button asChild size="lg">
              <Link href="#register" onClick={(e) => { e.preventDefault(); setIsFormOpen(true); }}>{heroCta || 'Register Today'}</Link>
            </Button>
          </div>
        </section>

        {/* About the Event Section */}
        <section className="py-12 md:py-16">
          <div className="container px-4 md:px-6">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
                {aboutTitle}
              </h2>
              <p className="mt-4 text-muted-foreground md:text-xl">
                {aboutDescription}
              </p>
            </div>
          </div>
        </section>

        {/* Speakers Section */}
        <section className="py-12 md:py-16 bg-muted/40">
            <div className="container px-4 md:px-6">
                 <div className="max-w-3xl mx-auto text-center mb-12">
                    <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">{speakersTitle}</h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {speakers.map(speaker => (
                        <div key={speaker.id} className="text-center">
                            <Avatar className="w-32 h-32 mx-auto mb-4 border-4 border-background shadow-lg">
                                <AvatarImage src={speaker.avatarUrl} alt={speaker.name} />
                                <AvatarFallback>{speaker.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <h3 className="text-xl font-bold">{speaker.name}</h3>
                            <p className="text-muted-foreground">{speaker.title}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>

        {/* Agenda Section */}
        <section className="py-12 md:py-16">
            <div className="container px-4 md:px-6">
                <div className="max-w-3xl mx-auto text-center mb-12">
                    <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">{agendaTitle}</h2>
                </div>
                <div className="max-w-3xl mx-auto space-y-8">
                    {agenda.map(item => (
                        <div key={item.id} className="flex gap-4">
                            <div className="w-24 text-right">
                                <p className="font-bold text-primary">{item.time}</p>
                            </div>
                            <div className="flex-1 border-l-2 border-primary pl-4">
                                <h4 className="font-bold text-lg">{item.title}</h4>
                                <p className="text-muted-foreground">{item.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>

        {/* RSVP Section Placeholder */}
        <section id="register" className="py-12 md:py-24 bg-muted/40">
          <div className="container px-4 md:px-6">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
                Register Now
              </h2>
              <p className="mt-4 text-muted-foreground md:text-xl">
                Secure your spot. Click the button to get started.
              </p>
                <Button size="lg" className="mt-6" onClick={() => setIsFormOpen(true)}>
                    Register Today
                </Button>
            </div>
          </div>
        </section>

      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-muted-foreground">&copy; 2024 EventFlow. All rights reserved.</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link href="#" className="text-xs hover:underline underline-offset-4" prefetch={false}>
            Terms of Service
          </Link>
          <Link href="#" className="text-xs hover:underline underline-offset-4" prefetch={false}>
            Privacy
          </Link>
        </nav>
      </footer>
    </div>
  );
}


export function Editor({
  templateId,
}: {
  templateId: string;
}) {
  // Hero States
  const [heroTitle, setHeroTitle] = useState('InnovateX 2024');
  const [heroCta, setHeroCta] = useState('Register Now');
  const [heroImageUrl, setHeroImageUrl] = useState('https://picsum.photos/seed/hero-event/1200/800');


  // About States
  const [aboutTitle, setAboutTitle] = useState('About The Event');
  const [aboutDescription, setAboutDescription] = useState(
    'This is where your event description will go. It should be exciting and informative, telling people why they should attend.'
  );

  // Speakers States
  const [speakersTitle, setSpeakersTitle] = useState('Featured Speakers');
  const [speakers, setSpeakers] = useState<Speaker[]>([
      { id: `spkr-${Date.now()}-1`, name: 'Jane Doe', title: 'CEO, TechCorp', avatarUrl: 'https://i.pravatar.cc/150?u=a042581f4e29026704d' },
      { id: `spkr-${Date.now()}-2`, name: 'John Smith', title: 'Lead Engineer, Innovate LLC', avatarUrl: 'https://i.pravatar.cc/150?u=a042581f4e290267072' },
      { id: `spkr-${Date.now()}-3`, name: 'Alex Johnson', title: 'Product Manager, Solutions Inc.', avatarUrl: 'https://i.pravatar.cc/150?u=a042581f4e29026705f' },
  ]);

  // Agenda States
  const [agendaTitle, setAgendaTitle] = useState('Event Agenda');
  const [agenda, setAgenda] = useState<AgendaItem[]>([
      { id: `ag-${Date.now()}-1`, time: '9:00 AM', title: 'Registration & Coffee', description: 'Doors open for registration. Grab some coffee and network.'},
      { id: `ag-${Date.now()}-2`, time: '10:00 AM', title: 'Opening Keynote', description: 'Join Jane Doe for an inspiring start to the day.' },
      { id: `ag-${Date.now()}-3`, time: '11:00 AM', title: 'The Future of AI', description: 'A deep dive session with John Smith.' },
  ]);

  // Form Field States
  const [formFields, setFormFields] = useState<FormField[]>([
      { id: 'ff-1', label: 'First Name', type: 'text', placeholder: 'First Name' },
      { id: 'ff-2', label: 'Last Name', type: 'text', placeholder: 'Last Name' },
      { id: 'ff-3', label: 'Work Email', type: 'email', placeholder: 'Work Email' },
      { id: 'ff-4', label: 'Company Name', type: 'text', placeholder: 'Company Name' },
      { id: 'ff-5', label: 'Phone Number', type: 'tel', placeholder: 'Phone Number' },
      { id: 'ff-6', label: 'Designation', type: 'text', placeholder: 'Designation' },
      { id: 'ff-7', label: 'Interested in individual breakout sessions (Leave blank if not)', type: 'select', placeholder: 'Select a session...', options: ['Session 1: AI in Marketing', 'Session 2: Future of E-commerce', 'Session 3: Developer Tools'] },
  ]);

  const handleSpeakerChange = (id: string, field: keyof Omit<Speaker, 'id'>, value: string) => {
    setSpeakers(speakers.map(s => s.id === id ? { ...s, [field]: value } : s));
  };

  const addSpeaker = () => {
    const newId = `spkr-${Date.now()}`;
    setSpeakers([...speakers, { id: newId, name: 'New Speaker', title: 'Title', avatarUrl: `https://i.pravatar.cc/150?u=${newId}` }]);
  };
  
  const removeSpeaker = (id: string) => {
    setSpeakers(speakers.filter(s => s.id !== id));
  };
  
  const handleAgendaChange = (id: string, field: keyof Omit<AgendaItem, 'id'>, value: string) => {
    setAgenda(agenda.map(a => a.id === id ? { ...a, [field]: value } : a));
  };
  
  const addAgendaItem = () => {
    setAgenda([...agenda, { id: `ag-${Date.now()}`, time: '12:00 PM', title: 'New Session', description: 'Details about this session.' }]);
  };

  const removeAgendaItem = (id: string) => {
    setAgenda(agenda.filter(a => a.id !== id));
  };

  const handleFormFieldChange = (id: string, field: keyof Omit<FormField, 'id' | 'options' | 'type'>, value: string) => {
    setFormFields(formFields.map(f => f.id === id ? { ...f, [field]: value } : f));
  };

  const handleFormFieldOptionsChange = (id: string, value: string) => {
    const options = value.split(',').map(opt => opt.trim());
    setFormFields(formFields.map(f => f.id === id ? { ...f, options } : f));
  }

  const handleFormFieldTypeChange = (id: string, type: FormField['type']) => {
    setFormFields(formFields.map(f => f.id === id ? { ...f, type } : f));
  }

  const addFormField = () => {
    setFormFields([...formFields, { id: `ff-${Date.now()}`, label: 'New Field', type: 'text', placeholder: 'New Field Placeholder' }]);
  }

  const removeFormField = (id: string) => {
    setFormFields(formFields.filter(f => f.id !== id));
  }

  return (
    <div className="space-y-4 h-full">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            Landing Page Editor
          </h2>
          <p className="text-muted-foreground">
            Editing template: {templateId}
          </p>
        </div>
        <Button>Publish</Button>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-[calc(100vh-120px)]">
        {/* Editor Form */}
        <div className="lg:col-span-1 overflow-y-auto pr-4">
          <Accordion type="multiple" className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>
                <h3 className="text-lg font-medium">Hero Section</h3>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4 p-1">
                  <div className="space-y-2">
                    <Label htmlFor="hero-title">Title</Label>
                    <Input
                      id="hero-title"
                      value={heroTitle}
                      onChange={(e) => setHeroTitle(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="hero-cta">Button Text (CTA)</Label>
                    <Input
                      id="hero-cta"
                      value={heroCta}
                      onChange={(e) => setHeroCta(e.target.value)}
                    />
                  </div>
                   <div className="space-y-2">
                    <Label htmlFor="hero-image-url">Background Image URL</Label>
                    <Input
                      id="hero-image-url"
                      value={heroImageUrl}
                      onChange={(e) => setHeroImageUrl(e.target.value)}
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>
                <h3 className="text-lg font-medium">About Section</h3>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4 p-1">
                  <div className="space-y-2">
                    <Label htmlFor="about-title">Section Title</Label>
                    <Input
                      id="about-title"
                      value={aboutTitle}
                      onChange={(e) => setAboutTitle(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="about-description">Section Description</Label>
                    <Textarea
                      id="about-description"
                      value={aboutDescription}
                      onChange={(e) => setAboutDescription(e.target.value)}
                      rows={5}
                    />
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
               <AccordionTrigger>
                <h3 className="text-lg font-medium">Speakers</h3>
              </AccordionTrigger>
              <AccordionContent>
                  <div className="space-y-4 p-1">
                     <div className="space-y-2">
                        <Label>Section Title</Label>
                        <Input value={speakersTitle} onChange={(e) => setSpeakersTitle(e.target.value)} />
                    </div>
                      {speakers.map((speaker, index) => (
                          <div key={speaker.id} className="p-3 border rounded-md space-y-3 relative">
                              <Button variant="ghost" size="icon" className="absolute top-1 right-1 h-6 w-6" onClick={() => removeSpeaker(speaker.id)}>
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                              <div className="space-y-2">
                                  <Label htmlFor={`speaker-name-${index}`}>Name</Label>
                                  <Input id={`speaker-name-${index}`} value={speaker.name} onChange={(e) => handleSpeakerChange(speaker.id, 'name', e.target.value)} />
                              </div>
                              <div className="space-y-2">
                                  <Label htmlFor={`speaker-title-${index}`}>Title/Company</Label>
                                  <Input id={`speaker-title-${index}`} value={speaker.title} onChange={(e) => handleSpeakerChange(speaker.id, 'title', e.target.value)} />
                              </div>
                               <div className="space-y-2">
                                  <Label htmlFor={`speaker-avatar-${index}`}>Avatar URL</Label>
                                  <Input id={`speaker-avatar-${index}`} value={speaker.avatarUrl} onChange={(e) => handleSpeakerChange(speaker.id, 'avatarUrl', e.target.value)} />
                              </div>
                          </div>
                      ))}
                      <Button variant="outline" onClick={addSpeaker} className="w-full">
                          <Plus className="mr-2 h-4 w-4" /> Add Speaker
                      </Button>
                  </div>
              </AccordionContent>
            </AccordionItem>
             <AccordionItem value="item-4">
               <AccordionTrigger>
                <h3 className="text-lg font-medium">Agenda</h3>
              </AccordionTrigger>
               <AccordionContent>
                  <div className="space-y-4 p-1">
                     <div className="space-y-2">
                        <Label>Section Title</Label>
                        <Input value={agendaTitle} onChange={(e) => setAgendaTitle(e.target.value)} />
                    </div>
                      {agenda.map((item, index) => (
                           <div key={item.id} className="p-3 border rounded-md space-y-3 relative">
                                <Button variant="ghost" size="icon" className="absolute top-1 right-1 h-6 w-6" onClick={() => removeAgendaItem(item.id)}>
                                    <Trash2 className="h-4 w-4 text-destructive" />
                                </Button>
                              <div className="space-y-2">
                                  <Label htmlFor={`agenda-time-${index}`}>Time</Label>
                                  <Input id={`agenda-time-${index}`} value={item.time} onChange={(e) => handleAgendaChange(item.id, 'time', e.target.value)} />
                              </div>
                              <div className="space-y-2">
                                  <Label htmlFor={`agenda-title-${index}`}>Title</Label>
                                  <Input id={`agenda-title-${index}`} value={item.title} onChange={(e) => handleAgendaChange(item.id, 'title', e.target.value)} />
                              </div>
                              <div className="space-y-2">
                                  <Label htmlFor={`agenda-desc-${index}`}>Description</Label>
                                  <Textarea id={`agenda-desc-${index}`} value={item.description} onChange={(e) => handleAgendaChange(item.id, 'description', e.target.value)} rows={3} />
                              </div>
                          </div>
                      ))}
                      <Button variant="outline" onClick={addAgendaItem} className="w-full">
                           <Plus className="mr-2 h-4 w-4" /> Add Agenda Item
                      </Button>
                  </div>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-5">
              <AccordionTrigger>
                <h3 className="text-lg font-medium">Registration Form</h3>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4 p-1">
                  {formFields.map((field) => (
                    <div key={field.id} className="p-3 border rounded-md space-y-3 relative">
                      <Button variant="ghost" size="icon" className="absolute top-1 right-1 h-6 w-6" onClick={() => removeFormField(field.id)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                      <div className="space-y-2">
                        <Label htmlFor={`form-label-${field.id}`}>Label</Label>
                        <Input id={`form-label-${field.id}`} value={field.label} onChange={(e) => handleFormFieldChange(field.id, 'label', e.target.value)} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`form-placeholder-${field.id}`}>Placeholder</Label>
                        <Input id={`form-placeholder-${field.id}`} value={field.placeholder} onChange={(e) => handleFormFieldChange(field.id, 'placeholder', e.target.value)} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`form-type-${field.id}`}>Field Type</Label>
                        <Select value={field.type} onValueChange={(value: FormField['type']) => handleFormFieldTypeChange(field.id, value)}>
                          <SelectTrigger id={`form-type-${field.id}`}>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="text">Text</SelectItem>
                            <SelectItem value="email">Email</SelectItem>
                            <SelectItem value="tel">Phone Number</SelectItem>
                            <SelectItem value="select">Select</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      {field.type === 'select' && (
                        <div className="space-y-2">
                          <Label htmlFor={`form-options-${field.id}`}>Options (comma-separated)</Label>
                          <Textarea 
                            id={`form-options-${field.id}`} 
                            placeholder="Option 1, Option 2, Option 3" 
                            defaultValue={field.options?.join(', ')} 
                            onChange={(e) => handleFormFieldOptionsChange(field.id, e.target.value)} 
                            rows={2}
                          />
                        </div>
                      )}
                    </div>
                  ))}
                  <Button variant="outline" onClick={addFormField} className="w-full">
                    <Plus className="mr-2 h-4 w-4" /> Add Form Field
                  </Button>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        {/* Live Preview */}
        <div className="lg:col-span-2 bg-muted/20 rounded-lg h-full overflow-hidden">
            <div className="w-full h-full">
                <LandingPagePreview 
                  heroTitle={heroTitle} 
                  heroCta={heroCta}
                  heroImageUrl={heroImageUrl}
                  aboutTitle={aboutTitle}
                  aboutDescription={aboutDescription}
                  speakersTitle={speakersTitle}
                  speakers={speakers}
                  agendaTitle={agendaTitle}
                  agenda={agenda}
                  formFields={formFields}
                />
            </div>
        </div>
      </div>
    </div>
  );
}
