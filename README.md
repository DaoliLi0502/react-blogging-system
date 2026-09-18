# React Blogging System

A full-stack blogging application built with React, Express, and SQLite. Visitors can browse, search, and filter articles; signed-in users can publish posts and take part in the community through likes, comments, subscriptions, and notifications.

## Highlights

- Account registration, login, logout, and cookie-based JWT authentication
- Article list, full-text title search, tag filtering, and paginated results
- Create, edit, and delete your own articles
- Rich-text article editing with TinyMCE and optional cover-image uploads
- Create tags and add or remove tags from your own articles
- Like or unlike articles, with the current user's like state shown in the article view
- Comment on articles; comment authors and article authors can remove comments
- Subscribe to authors and unsubscribe at any time
- Notifications for new comments and posts from subscribed authors, with read status
- Profile editing, built-in avatar selection, and a paginated view of your articles
- Responsive client-side navigation with React Router

## Tech Stack

| Area | Technologies |
| --- | --- |
| Client | React 19, Vite, React Router, Axios, TinyMCE |
| Server | Node.js, Express 5, cookie-parser, CORS |
| Data and auth | SQLite, `sqlite` / `sqlite3`, JWT, bcrypt |
| Uploads and validation | Multer, Yup |

## Project Structure

```text
react-blogging-system/
├── backend/
│   ├── api/                 # Express route modules
│   ├── middleware/          # Required and optional authentication middleware
│   ├── validation/          # Yup schemas for request validation
│   ├── avatars/             # Static avatar images
│   ├── uploads/             # Article images; new uploads are written here
│   ├── db.js                # SQLite connection
│   └── server.js            # API server entry point
├── database/
│   ├── schema.sql           # Database tables and constraints
│   └── seed.sql             # Sample users, articles, tags, and interactions
├── frontend/
│   ├── public/              # Public static assets
│   └── src/
│       ├── components/      # Shared UI, such as the navbar and article card
│       ├── pages/           # Route-level screens
│       ├── App.jsx          # Client routes
│       └── main.jsx         # React entry point
└── README.md
```

## Prerequisites

- Node.js 18 or newer and npm
- SQLite command-line tools, only when creating a fresh local database
- A TinyMCE API key for the rich-text editor

## Getting Started

### 1. Clone and install dependencies

```bash
git clone https://github.com/DaoliLi0502/react-blogging-system.git
cd react-blogging-system

cd backend
npm install

cd ../frontend
npm install
```

### 2. Configure environment variables

Create `backend/.env`:

```env
JWT_SECRET=replace-with-a-long-random-secret
```

Create `frontend/.env`:

```env
VITE_TINYMCE_API_KEY=your_tinymce_api_key
```

Keep both files out of version control. The root `.gitignore` already excludes `.env` files. The JWT secret is required for login and protected API routes; the TinyMCE key is used by the create and edit article screens.

### 3. Initialise SQLite (fresh clone only)

The server opens `database/blogging.db`. If it is not present, create it from the schema and optional sample data.

In PowerShell, from the repository root:

```powershell
Get-Content database/schema.sql | sqlite3 database/blogging.db
Get-Content database/seed.sql | sqlite3 database/blogging.db
```

On macOS or Linux:

```bash
sqlite3 database/blogging.db < database/schema.sql
sqlite3 database/blogging.db < database/seed.sql
```

Run the seed command only for a new database: it inserts demonstration accounts, avatars, posts, tags, comments, likes, subscriptions, and notifications.

### 4. Start the API server

Run this command from `backend/` so the relative database path resolves correctly:

```bash
cd backend
node server.js
```

The API runs at `http://localhost:3000`. It serves avatar files at `/avatars` and article images at `/uploads`.

### 5. Start the client

In a second terminal:

```bash
cd frontend
npm run dev
```

Open the URL printed by Vite (normally `http://localhost:5173`). The server's CORS configuration currently permits this development origin and sends credentials for authenticated requests.

## Application Routes

| Route | Purpose |
| --- | --- |
| `/articles` | Browse paginated articles |
| `/articles/:aid` | Read an article, manage likes, comments, subscriptions, and (if the owner) tags and article actions |
| `/articles/create` | Create an article (sign-in required) |
| `/articles/:aid/edit` | Edit an owned article (sign-in required) |
| `/search` | Search articles by title |
| `/tags` | Browse tags and articles assigned to a selected tag |
| `/notifications` | Review and mark comment/subscription notifications as read |
| `/profile` | Update profile details, choose an avatar, and view your articles |
| `/login`, `/signup` | Authenticate or create an account |

## API Overview

All API routes are prefixed with `/api`. Protected endpoints read the JWT from the `token` HTTP-only cookie. Article creation and updates use `multipart/form-data` when an image is attached.

| Resource | Main endpoints |
| --- | --- |
| Authentication | `POST /login`, `POST /logout`, `GET /status` |
| Users and avatars | `POST /users`, `GET/PUT /users/me`, `GET /users/check-username`, `GET /avatars` |
| Articles | `GET/POST /articles`, `GET/PUT/DELETE /articles/:aid`, `GET /articles/me` |
| Article interactions | `POST/DELETE /articles/:aid/likes`, `GET /articles/:aid/likes`, `POST/GET/DELETE` comment routes |
| Tags | `GET/POST /tags`, `GET /tags/:tid/articles`, add/remove tag routes under an article |
| Subscriptions | `POST /subscriptions`, `DELETE /subscriptions/:uid`, `GET /users/:uid/subscriptions` |
| Notifications | Comment and subscription notification `GET` and read-status `PUT` routes |

For exact request fields and response shapes, refer to the relevant modules in `backend/api/` and their validation schemas in `backend/validation/`.

## Database Model

SQLite stores users, avatars, articles, comments, tags, likes, article-tag mappings, subscriptions, and the two notification types. Foreign keys and cascading deletes keep related data consistent when users or articles are removed.

## Available Scripts

Run these from `frontend/`:

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Vite development server |
| `npm run build` | Create a production client build in `frontend/dist/` |
| `npm run preview` | Preview the production client build |
| `npm run lint` | Run ESLint on the frontend source |

The backend is started with `node server.js`; it does not currently define a development or test script.

## Current Limitations

- The client API URLs and server CORS origin are currently hard-coded for local development (`localhost:3000` and `localhost:5173`).
- Cookies use development settings (`secure: false`); review cookie, CORS, upload validation, and deployment configuration before production use.
- Automated tests and a production deployment configuration have not yet been added.
