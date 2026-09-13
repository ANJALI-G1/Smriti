SMRITI 🧠
A gentle cognitive-care companion for people living with dementia.

SMRITI is a tablet-first cognitive care application designed to help elderly people living with dementia stay connected with their memories, routines, and loved ones.

The experience is intentionally simple, calm, and accessible — designed around large touch targets, familiar people, meaningful memories, and minimal cognitive load.

✨ What is SMRITI?

Dementia can make everyday interactions, names, routines, and familiar memories difficult to recall.

SMRITI creates a supportive digital environment where caregivers can provide personalized memories and information that the patient can interact with through a simple tablet interface.

For Caregivers
Add and manage memories of loved ones
Provide photos and personal context
Monitor routines and activities
Prepare personalized experiences for the patient
For Patients
Recognize familiar people
Explore personal memories
Follow gentle daily routines
Listen to familiar content
Interact with a simple, distraction-free tablet interface
🎯 MVP Goals

The current MVP focuses on establishing the core caregiver → memory → patient experience.

Caregiver
    ↓
Add a person / memory
    ↓
IndexedDB
    ↓
Patient Tablet
    ↓
Personalized memories & recognition


The goal is to make the experience functional and personalized before adding more advanced AI capabilities.

🧩 Current Features
Landing Page
Simple product introduction
Caregiver entry point
Patient tablet entry point
Caregiver Dashboard
Patient overview
Attention alerts
Daily routine timeline
Cognitive trends
Add-memory workflow
Family/member information
Patient Tablet
Large, accessible interface
Morning greeting
Memory-based content
"Who is this?" recognition experience
Memory of the Day
Personalized rituals
People close to the patient
Patient-friendly bottom navigation
Local-First Storage

SMRITI uses IndexedDB for local application data.

This allows the application to:

Work without a constant internet connection
Persist data across refreshes
Store structured memory/person data
Cache media locally
Provide fast tablet interactions
Prepare the architecture for future synchronization
🏗️ Architecture

SMRITI follows a local-first approach for the MVP.

┌──────────────────────┐
│      React UI        │
│ Caregiver / Patient  │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│      IndexedDB       │
│                      │
│ • Patients           │
│ • Family Members     │
│ • Memories           │
│ • Routines           │
│ • Activities         │
│ • Recognition Data   │
└──────────────────────┘


A future version can introduce optional backend synchronization:

React
  ↓
IndexedDB
  ↓
Sync Layer
  ↓
Backend API
  ↓
Database


This allows the MVP to remain simple and offline-friendly while leaving room for a production architecture later.

🛠️ Tech Stack
React
JavaScript
Tailwind CSS
Vite
IndexedDB
Web Speech API — planned/experimental
AI-powered personalization — planned
📱 Design Principles

SMRITI is designed specifically for elderly users and people who may experience cognitive impairment.

Accessibility First
Large touch targets
High readability
Clear visual hierarchy
Minimal navigation complexity
Familiar language
Reduced visual clutter
Calm colors and typography
Familiarity Over Complexity

Instead of presenting users with traditional app interfaces, SMRITI emphasizes:

People → Memories → Routines → Simple Actions

🚧 Current Limitations

This is an MVP/hackathon build, so some functionality is intentionally incomplete.

Currently Planned
Dynamic AI-generated recognition questions
More complete caregiver CRUD functionality
Web Speech API integration
Voice-based interaction
Real routine verification
Cross-device synchronization
Advanced patient activity tracking
Backend persistence and synchronization

The current priority is establishing reliable local data flow before adding these capabilities.

🔮 Roadmap
Phase 1 — Foundation
 Landing experience
 Caregiver dashboard UI
 Patient tablet UI
 Basic patient/caregiver flows
 Local-first data model
 Persistent caregiver memories
Phase 2 — Personalization
 Dynamic family members
 Dynamic memories
 Personalized recognition questions
 Patient memory history
 Routine persistence
Phase 3 — AI
 AI-generated memory questions
 Adaptive cognitive interactions
 Personalized daily experiences
 Caregiver-assisted AI configuration
Phase 4 — Voice & Sync
 Text-to-speech
 Voice interaction
 Offline media caching
 Optional cloud synchronization
 Multi-device caregiver access
🚀 Getting Started
Prerequisites

Make sure you have:

Node.js
npm
Installation
git clone <repository-url>
cd smriti
npm install

Run the development server
npm run dev


Then open the local URL provided by Vite.

🧪 Testing

The project includes browser-level testing for the primary caregiver and patient flows.

Run the available checks with:

npm run lint
npm run build


End-to-end tests can be run using the project's configured Playwright setup.

🤝 Project Philosophy

SMRITI is built around one simple idea:

Technology should help people remember what matters, not make them learn how to use technology.

For someone living with dementia, a familiar face, a family photograph, or a remembered routine can be more meaningful than a complicated digital experience.

SMRITI puts those things first.

❤️ Built For

SMRITI was created as a hackathon project exploring technology-assisted cognitive care for older adults living with dementia.

The project focuses on combining:

Human-centered design + local-first technology + personalized memories + AI

to create a more compassionate digital care experience.

📄 License

This project is currently intended as a hackathon/prototype project.

Add your preferred license here before public production use.
