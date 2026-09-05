# CollabDocs

CollabDocs is a lightweight collaborative document editor inspired by Google Docs. It allows users to create, edit, save, import, and share documents through a simple web-based workspace.

## Features

- Create and rename documents
- Rich-text document editing
- Bold, italic, and underline formatting
- Heading levels
- Bulleted and numbered lists
- Adjustable text size
- Persistent document storage
- Import `.txt` and `.md` files
- User-based document sharing
- Owner and shared-document separation
- Server-side document access control
- Seeded demo users
- Responsive interface
- Automated authorization test

## Tech Stack

### Frontend

- React
- Vite
- Tiptap
- React Router
- Axios
- CSS

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose

### Testing

- Jest
- Supertest

## File Import

CollabDocs currently supports:

- `.txt`
- `.md`

Maximum file size:

- 1 MB

Markdown files are imported as editable text rather than being rendered as formatted Markdown.

## Demo Users

The application uses seeded users to demonstrate document ownership and sharing.

Example users:

- Pavan Kumar Neteti
- Alice
- Bob

Authentication is intentionally simulated using a current-user selector for this assessment.

## Local Setup

### 1. Clone the repository

```bash
git clone https://github.com/NetetiPavanKumar/CollabDocs.git
cd CollabDocs
```



### 2. Backend setup
```bash
cd backend
npm install
```

Create a .env file:

```bash
PORT=5000
MONGO_URI=your_mongodb_connection_string
```

Seed the demo users:
```bash
npm run seed
```

Start the backend:
```bash
npm run dev
```

The API will run at:

```bash
http://localhost:5000
```
### 3. Frontend setup

Open another terminal:

```bash

cd frontend
npm install

```

Create a .env file:

```bash
VITE_API_URL=http://localhost:5000/api
```

Start the frontend:

```bash
npm run dev
```

Testing

From the backend directory:


```bash
npm test
```

The automated test verifies that a user who does not own or have access to a document receives a 403 Forbidden response.

### Production Build

From the frontend directory:

```bash
npm run build
```
### Project Structure

```bash
Collab_Docs/
│
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── App.jsx
│   │   └── index.css
│   └── package.json
│
├── backend/
│   ├── src/
│   │   ├── models/
│   │   ├── routes/
│   │   └── seed.js
│   ├── server.js
│   └── package.json
│
└── README.md
```
### Current Limitations

This assessment implementation intentionally keeps the scope focused on the core requirements.

Authentication is simulated with seeded users.
Real-time simultaneous editing is not implemented.
Comments and version history are not currently implemented.
Markdown files are imported as plain editable text.
DOCX import/export is not currently supported.
Future Improvements

### Possible future enhancements include:

Real-time collaboration
Presence indicators
Comments and mentions
Document version history
Real authentication
DOCX import/export
Document search
Offline editing


### License

This project was created as part of a full-stack product engineering assessment.