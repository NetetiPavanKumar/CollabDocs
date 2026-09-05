# CollabDocs — Assessment Submission

## Project

CollabDocs is a lightweight collaborative document editor inspired by Google Docs.

## Live Application

https://collabdocs-1-h56p.onrender.com

## Source Code

https://github.com/NetetiPavanKumar/CollabDocs

## Technology Stack

- React
- Vite
- Tiptap
- React Router
- Axios
- Node.js
- Express.js
- MongoDB
- Mongoose
- Jest
- Supertest

## Implemented Requirements

### Document Management

- Create documents
- Rename documents
- Edit documents
- Save documents
- Reopen documents
- Persist documents across refreshes

### Rich Text Editing

- Bold
- Italic
- Underline
- Headings
- Text size
- Bulleted lists
- Numbered lists

### File Workflow

Supported file types:

- `.txt`
- `.md`

Maximum supported file size:

- 1 MB

Markdown files are imported as editable plain text.

### Sharing

The application includes seeded demo users.

Documents can be shared by the owner with another user.

The dashboard distinguishes between:

- My Documents
- Shared with me

Server-side authorization prevents users without access from opening protected documents.

### Persistence

Document content and formatting are stored in MongoDB using Tiptap JSON.

Persistence was verified by:

- Saving documents
- Reopening documents
- Refreshing the browser
- Navigating away and returning to documents

### Testing

The backend includes an automated Jest/Supertest test verifying unauthorized document access.

An unauthorized user receives:

```bash
    403 Forbidden
```


## Demo Users

The application uses seeded users for demonstrating ownership and sharing:

Pavan Kumar Neteti
AJ
Vinay Ratnam

Authentication is simulated using the current-user selector for the assessment.

## Deployment

The frontend and backend are deployed on Render.

### Frontend

https://collabdocs-1-h56p.onrender.com

### Backend

https://collabdocs-1wa8.onrender.com

## Repository Documentation

Additional project documentation is available in:

README.md — setup, features, testing, and limitations
ARCHITECTURE.md — architecture and design decisions
AI_WORKFLOW.md — AI-assisted development workflow

## Known Limitations

The following optional features were not implemented:

Real-time simultaneous editing
Presence indicators
Comments
Version history
Production authentication
DOCX import/export

The implementation prioritizes the required functionality within the assessment timebox.

## Walkthrough Video

Video URL:

TO_BE_ADDED

## Assessment Notes

The application was tested locally and in production.

Core document creation, editing, formatting, persistence, file import, sharing, authorization, and routing functionality were verified after deployment.