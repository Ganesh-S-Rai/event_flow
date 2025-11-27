
# Product Requirements Document: EventFlow

**Author:** AI Assistant (Gemini)
**Version:** 1.0
**Date:** 2025-10-03

---

## 1. Vision & Goal

**Product Vision:** To empower event organizers and marketing teams to create, manage, and promote successful events with unparalleled ease and intelligence.

**Core Goal:** EventFlow will be a comprehensive, AI-powered platform that centralizes all aspects of the event lifecycle, from creating stunning, high-converting landing pages to capturing and managing leads, all within a single, intuitive dashboard.

---

## 2. Target Audience

*   **Event Managers:** Individuals responsible for the end-to-end planning and execution of events (conferences, workshops, meetups). They need tools to quickly create event pages, manage registrations, and track success.
*   **Marketing Leads & Professionals:** Marketers tasked with promoting events and generating leads. They need tools for crafting compelling email campaigns, generating marketing copy, and analyzing engagement.
*   **Small Business Owners:** Entrepreneurs who wear multiple hats and need a simple, yet powerful, tool to manage their company's events without a dedicated marketing team.

---

## 3. Key Features

### 3.1. Core Application
*   **Authentication:** Secure user login and signup system with an email whitelist to control access for authorized personnel.
*   **Dashboard:** A central hub providing an at-a-glance overview of key metrics, including total registrations, event count, conversion rates, and recent sign-ups.

### 3.2. Event Management
*   **Event Creation & Management:** An interface to create, view, and manage all events, including their status (Draft, Active, Completed).
*   **Event Summary Page:** A central command center for each event showing key stats, a full searchable list of registrations, recent expenses, and quick actions.
*   **Landing Page Templates:** A selection of pre-designed templates (e.g., Modern Conference, Creative Workshop) to kickstart the page creation process.

### 3.3. Landing Page Editor
A powerful, block-based editor for building and customizing event landing pages with a live preview.
*   **Block-Based System:** Build pages by adding, removing, and reordering content blocks.
*   **Available Blocks:**
    *   **Hero:** A full-width section with a background image, overlayed headline, subtext, and a call-to-action button.
    *   **Heading:** For section titles and headlines (H1, H2, H3).
    *   **Text:** For paragraphs and detailed descriptions.
    *   **Image:** For standalone images.
    *   **Button:** For standalone calls to action.
    *   **Speaker:** Display speaker profiles with image, name, role, and bio.
    *   **Agenda:** Timeline view of event sessions.
    *   **FAQ:** Accordion-style list of questions and answers.
*   **Rich Block-Level Customization:**
    *   **Image Controls:** Upload custom images, or use AI to generate new images from a text prompt or edit existing ones.
    *   **Button Controls:** Customize button text, link (URL), size, color variant (primary, secondary, etc.), and alignment (left, center, right).
    *   **Text Controls:** Customize text alignment.
*   **AI Content Generation:**
    *   **Text Generation:** Use AI to generate or refine text for headlines and paragraphs based on a prompt.
    *   **Image Generation:** Generate entirely new images for any image field using a descriptive text prompt.

### 3.4. Lead Management
*   **Lead Capture:** Automatically capture registrant information from landing page forms.
*   **QR Code Generation:** Generate a unique QR code for each registered lead to facilitate event check-in.
*   **Lead Dashboard:** A comprehensive table to view, filter, and sort all captured leads, including their name, email, event, and registration date.

### 3.5. AI-Powered Tools
*   **Automated Email Generator:** An AI tool that crafts compelling marketing emails (subject, pre-header, and HTML body) based on event details and desired tone. It includes the ability to send test emails.

### 3.6. Application Settings
*   **Netcore Integration:** Configure the Netcore Email API key for sending emails.
*   **Sender Profile Management:** Create and manage "From" email profiles for sending marketing communications and set a default sender.

---

## 4. Technical Architecture

*   **Framework:** Next.js (App Router)
*   **Language:** TypeScript
*   **UI Components:** ShadCN UI
*   **Styling:** Tailwind CSS
*   **Database:** Firebase Firestore (for storing events, leads, and configuration)
*   **Authentication:** Firebase Authentication
*   **Generative AI:** Google's AI models, orchestrated via Genkit flows.
*   **Email Sending:** Netcore Email API

---

## 5. Future Considerations & Potential Roadmap

*   **Advanced Analytics:** Deeper insights into page views, click-through rates, and registration sources.
*   **A/B Testing:** Allow marketers to test different versions of landing pages to optimize conversion rates.
*   **Advanced AI Tools:**
    *   AI-powered social media post generation for event promotion.
    *   AI to suggest optimal event times or target audiences based on past data.
*   **Theme Customization:** Global controls to change the application's primary color, fonts, and corner radius to match a company's brand.
