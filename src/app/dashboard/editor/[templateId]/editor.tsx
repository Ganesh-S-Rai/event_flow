
'use client';

import { useState, useEffect, useActionState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Trash2, Loader2 } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { type Event } from '@/lib/data';
import { publishEventAction } from './actions';
import { Badge } from '@/components/ui/badge';
import { useFormStatus } from 'react-dom';
import { EventPageClient } from '@/app/events/components/event-page-client';


// --- Types ---
type Speaker = NonNullable<Event['speakers']>[0];
type AgendaItem = NonNullable<Event['agenda']>[0];
type FormField = NonNullable<Event['formFields']>[0];


function LandingPagePreview({
  event,
}: {
  event: Event;
}) {
  return (
    <div className="bg-background text-foreground border rounded-lg overflow-y-auto w-[125%] h-[125%] origin-top-left scale-[0.8]">
      <EventPageClient event={event} />
    </div>
  );
}

const slugify = (text: string) =>
  text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/[^\w-]+/g, '') // Remove all non-word chars
    .replace(/--+/g, '-'); // Replace multiple - with single -


function PublishButton({status}: {status: Event['status']}) {
  const { pending } = useFormStatus();
  return (
      <Button type="submit" disabled={pending}>
          {pending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            status === 'Active' ? 'Update' : 'Publish'
          )}
      </Button>
  );
}

export function Editor({
  event,
}: {
  event: Event;
}) {
  const { toast } = useToast();
  
  // Page content states
  const [heroTitle, setHeroTitle] = useState(event.heroTitle || event.name || 'InnovateX 2024');
  const [heroCta, setHeroCta] = useState(event.heroCta || 'Register Now');
  const [heroImageUrl, setHeroImageUrl] = useState(event.heroImageUrl || 'https://picsum.photos/seed/hero-event/1200/800');
  const [aboutTitle, setAboutTitle] = useState(event.aboutTitle || 'About The Event');
  const [aboutDescription, setAboutDescription] = useState(
    event.aboutDescription || event.description || 'This is where your event description will go. It should be exciting and informative, telling people why they should attend.'
  );
  const [speakersTitle, setSpeakersTitle] = useState(event.speakersTitle || 'Featured Speakers');
  const [speakers, setSpeakers] = useState<Speaker[]>(event.speakers || [
      { id: `spkr-${Date.now()}-1`, name: 'Jane Doe', title: 'CEO, TechCorp', avatarUrl: 'https://i.pravatar.cc/150?u=a042581f4e29026704d' },
      { id: `spkr-${Date.now()}-2`, name: 'John Smith', title: 'Lead Engineer, Innovate LLC', avatarUrl: 'https://i.pravatar.cc/150?u=a042581f4e290267072' },
      { id: `spkr-${Date.now()}-3`, name: 'Alex Johnson', title: 'Product Manager, Solutions Inc.', avatarUrl: 'https://i.pravatar.cc/150?u=a042581f4e29026705f' },
  ]);
  const [agendaTitle, setAgendaTitle] = useState(event.agendaTitle || 'Event Agenda');
  const [agenda, setAgenda] = useState<AgendaItem[]>(event.agenda || [
      { id: `ag-${Date.now()}-1`, time: '9:00 AM', title: 'Registration & Coffee', description: 'Doors open for registration. Grab some coffee and network.'},
      { id: `ag-${Date.now()}-2`, time: '10:00 AM', title: 'Opening Keynote', description: 'Join Jane Doe for an inspiring start to the day.' },
      { id: `ag-${Date.now()}-3`, time: '11:00 AM', title: 'The Future of AI', description: 'A deep dive session with John Smith.' },
  ]);
  const [formFields, setFormFields] = useState<FormField[]>(event.formFields || [
      { id: 'ff-1', label: 'First Name', type: 'text', placeholder: 'First Name' },
      { id: 'ff-2', label: 'Last Name', type: 'text', placeholder: 'Last Name' },
      { id: 'ff-3', label: 'Work Email', type: 'email', placeholder: 'Work Email' },
      { id: 'ff-4', label: 'Company Name', type: 'text', placeholder: 'Company Name' },
      { id: 'ff-5', label: 'Phone Number (Optional)', type: 'tel', placeholder: 'Phone Number' },
      { id: 'ff-6', label: 'Designation', type: 'text', placeholder: 'Designation' },
      { id: 'ff-7', label: 'Interested in breakout sessions (Optional)', type: 'select', placeholder: 'Select a session...', options: ['Session 1: AI in Marketing', 'Session 2: Future of E-commerce', 'Session 3: Developer Tools'] },
  ]);

  // Publish settings states
  const [slug, setSlug] = useState(event.slug || slugify(heroTitle));
  const [status, setStatus] = useState<Event['status']>(event.status || 'Draft');

  const [state, formAction] = useActionState(publishEventAction, { message: '' });

  // This object represents the current state of the event page for the preview
  const previewEvent: Event = {
    ...event,
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
  };


  useEffect(() => {
    if (state.message) {
      if(state.message.startsWith('Error')) {
        toast({ variant: 'destructive', title: 'Error', description: state.issues?.[0] || 'An unknown error occurred.' });
      } else {
        toast({ title: 'Success', description: state.message });
        if (state.data?.status) {
          setStatus(state.data.status);
        }
      }
    }
  }, [state, toast]);
  

  useEffect(() => {
    if (event.name === heroTitle) return; // Prevent slug update on initial load
    setSlug(slugify(heroTitle));
  }, [heroTitle, event.name]);

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
    <form action={formAction} className="space-y-4 h-full">
      {/* Hidden inputs to pass all state to the server action */}
      <input type="hidden" name="eventId" value={event.id} />
      <input type="hidden" name="heroTitle" value={heroTitle} />
      <input type="hidden" name="heroCta" value={heroCta} />
      <input type="hidden" name="heroImageUrl" value={heroImageUrl} />
      <input type="hidden" name="aboutTitle" value={aboutTitle} />
      <input type="hidden" name="aboutDescription" value={aboutDescription} />
      <input type="hidden" name="speakersTitle" value={speakersTitle} />
      <input type="hidden" name="speakers" value={JSON.stringify(speakers)} />
      <input type="hidden" name="agendaTitle" value={agendaTitle} />
      <input type="hidden" name="agenda" value={JSON.stringify(agenda)} />
      <input type="hidden" name="formFields" value={JSON.stringify(formFields)} />

      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            Landing Page Editor
          </h2>
          <p className="text-muted-foreground">
            Editing template for: <span className="font-semibold text-foreground">{event.name}</span>
          </p>
        </div>
        <div className="flex items-center gap-2">
            <Badge variant={status === 'Active' ? 'default' : 'secondary'}>{status}</Badge>
            <PublishButton status={status}/>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-[calc(100vh-120px)]">
        {/* Editor Form */}
        <div className="lg:col-span-1 overflow-y-auto pr-4">
          <Accordion type="multiple" className="w-full" defaultValue={['item-1', 'item-6']}>
             <AccordionItem value="item-6">
              <AccordionTrigger>
                <h3 className="text-lg font-medium">Publish Settings</h3>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4 p-1">
                  <div className="space-y-2">
                    <Label htmlFor="slug">URL Slug</Label>
                    <div className="flex items-center rounded-md border border-input focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
                        <span className="pl-3 text-sm text-muted-foreground">/events/</span>
                        <Input
                          id="slug"
                          name="slug"
                          className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                          value={slug}
                          onChange={(e) => setSlug(e.target.value)}
                        />
                    </div>
                     <p className="text-xs text-muted-foreground">
                        Your page will be available at: <br />
                        <span className="font-mono bg-muted/80 p-1 rounded-sm">/events/{slug}</span>
                    </p>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
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
                  event={previewEvent}
                />
            </div>
        </div>
      </div>
    </form>
  );
}
