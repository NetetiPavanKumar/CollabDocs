# CollabDocs — Architecture Note

## 1. Overview

CollabDocs is a lightweight collaborative document editor inspired by Google Docs.

The application follows a client-server architecture:

- React frontend for the user interface and document editing
- Express/Node.js backend for APIs and authorization
- MongoDB for persistent document and user data
- Tiptap for rich-text editing
- Render for production deployment

The implementation focuses on the core requirements of the assessment while intentionally keeping authentication and real-time collaboration lightweight.

---

## 2. Architecture

```text
                    ┌──────────────────────┐
                    │       Browser        │
                    │   React + Tiptap     │
                    └──────────┬───────────┘
                               │
                               │ HTTP / REST API
                               ▼
                    ┌──────────────────────┐
                    │   Node.js + Express  │
                    │      REST API        │
                    └──────────┬───────────┘
                               │
                               │ Mongoose
                               ▼
                    ┌──────────────────────┐
                    │       MongoDB        │
                    │                      │
                    │ Users + Documents    │
                    └──────────────────────┘
```

## 3. Frontend

The frontend is built with React and Vite.

### Main responsibilities

Display the document dashboard
Create and rename documents
Provide the rich-text editor
Import .txt and .md files
Display document ownership and sharing information
Communicate with the backend through Axios
Handle client-side routing using React Router


### Rich-text editing

Tiptap is used as the editor.

Instead of storing generated HTML, the application stores the editor's structured JSON document format.

This allows formatting such as:

Headings
Bold
Italic
Underline
Lists
Font sizes

to be persisted and restored when the document is reopened.

## 4. Backend

The backend uses Node.js and Express.

It exposes REST APIs for:

Users
Documents
Document sharing

The backend is also responsible for authorization checks.

For example, when a document is requested, the backend verifies whether the current user is:

The document owner, or
A user who has been granted access

Unauthorized users receive:
```bash
403 Forbidden
```

This means document access is not enforced only through the frontend.

## 5. Database

MongoDB is used for persistence through Mongoose.

### User

A user contains:

Name
Email

### Document

A document contains:

Title
Tiptap JSON content
Owner
Shared users
Created timestamp
Updated timestamp

The relationship is represented using MongoDB ObjectId references.

## 6. Sharing Model

The application uses an owner-based sharing model.

Each document has one owner and can contain multiple users in the sharedWith array.
```bash
Document
   │
   ├── owner ──────── User
   │
   └── sharedWith ─── User
                     User
```
Only the owner can grant access to another user.

Users with access can open and edit the document.

The dashboard separates:

My Documents
Shared with me

This makes document ownership and shared access visible to the user.

## 7. Authentication Approach

For this assessment, authentication is intentionally simulated using seeded users.

The application provides a current-user selector instead of implementing a full authentication system.

This keeps the implementation focused on the assessment's document, sharing, persistence, and authorization requirements.

The backend still performs authorization checks using the selected user ID.

A production version could replace this mechanism with:

Session-based authentication
JWT authentication
OAuth
Role-based identity management


## 8. File Import

The frontend supports importing:

.txt
.md

Files are processed in the browser using the FileReader API.

The maximum supported file size is:

```bash
1 MB
```

Markdown files are imported as editable plain text rather than being rendered as Markdown.

This keeps the import workflow lightweight while satisfying the file workflow requirement.

## 9. Persistence Flow

When a user saves a document:

```bash
Editor
   │
   │ Tiptap JSON
   ▼
React Frontend
   │
   │ PUT /api/documents/:id
   ▼
Express API
   │
   │ Mongoose
   ▼
MongoDB
```
When the document is reopened, the stored Tiptap JSON is loaded back into the editor.

Therefore, document content and formatting survive:

Navigation
Reopening
Browser refresh
Application restarts

## 10. Authorization Flow

For protected document operations:

```bash
User Request
     │
     ▼
Backend API
     │
     ▼
Find Document
     │
     ├── Owner? ──────── Yes ──► Allow
     │
     ├── Shared user? ── Yes ──► Allow
     │
     └── Neither ─────── No ───► 403
```
Authorization is performed on the server so that simply manipulating the frontend does not grant document access.

## 11. Testing

The backend includes an automated Jest/Supertest test.

The test verifies that an unauthorized user attempting to access a document receives:

```bash
403 Forbidden
```
This validates the server-side document authorization rule.

## 12. Deployment

The application is deployed using Render.

### Frontend

The React/Vite frontend is deployed as a Render Static Site.

Production build:

```bash
npm run build
``` 
Published directory:

```bash
dist
```
The frontend receives the production backend URL through:

```bash
VITE_API_URL
```

### Backend

The Express backend is deployed as a Render Web Service.

The backend connects to MongoDB using:

```bash
MONGO_URI
```
The API exposes a health endpoint:

```bash
GET /api/health
```
## 13. Routing

The frontend uses React Router for document URLs such as:

```bash
/documents/:id
```

A Render rewrite rule routes unknown frontend paths to:

```bash
/index.html
```

This allows React Router to handle direct navigation and browser refreshes correctly.

## 14. Design Decisions

### Tiptap JSON instead of HTML

Structured editor JSON preserves document semantics and formatting more reliably than storing presentation-oriented HTML.

### Simulated users instead of full authentication

The assessment focuses on document sharing and authorization rather than identity management, so seeded users provide a simple demonstration without adding unnecessary authentication complexity.

### Browser-based file import

Using FileReader keeps the import implementation lightweight and avoids unnecessary backend file-processing infrastructure.

### REST API instead of real-time synchronization

The assessment's core requirements are satisfied through persistent document operations. Real-time collaboration would require additional synchronization infrastructure such as WebSockets and conflict handling.

## 15. Current Limitations

The current implementation intentionally does not include:

Real-time simultaneous editing
Cursor/presence indicators
Comments
Version history
Production authentication
DOCX import/export

These could be added in future iterations without fundamentally changing the core architecture.