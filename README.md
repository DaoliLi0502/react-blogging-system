# React Blogging System

A full-stack React blogging application with an Express API and SQLite database. Visitors can browse and search articles; registered users can publish posts, edit their profiles, and interact through likes, comments, author subscriptions, and notifications.

## Live Demo

- [Frontend on Railway](https://blog.daolili.com)
- [Backend on Railway](https://api.daolili.com) (API routes are under `/api`)

Demonstration account:

| Username | Password |
| --- | --- |
| `user001` | `openbook` |

## Features

- Registration, login, and logout; bcrypt password hashing and JWT authentication through HTTP-only cookies.
- Profile editing for real name, date of birth, description, and built-in avatar selection.
- Create, edit, and delete your own articles with TinyMCE rich-text editing and optional image uploads; replace or remove images when editing.
- Create tags, manage tags on your own articles, and browse articles by tag.
- Like/unlike articles, with like counts and the current user's like status.
- Add comments; comment authors and article authors can delete comments.
- Subscribe/unsubscribe to authors and receive notifications when they publish articles.
- Comment notifications for `@username` mentions, with notifications that can be marked as read.
- Search titles, content, and author usernames using partial or exact-match modes; sort by date, title, or username in ascending or descending order.
- Pagination for article browsing, search results, tag results, and the signed-in user's article list.

## Tech Stack

| Area | Technologies |
| --- | --- |
| Frontend | React 19, React Router 7, Vite 8, Axios, CSS |
| Rich-text editor | TinyMCE through `@tinymce/tinymce-react` |
| Backend | Node.js, Express 5, CORS, cookie-parser, dotenv |
| Database | SQLite through `sqlite` and `sqlite3` |
| Authentication | `jsonwebtoken`, bcrypt, HTTP-only cookies |
| Validation and uploads | Yup, Multer |
| Deployment | Railway; frontend static serving with `serve`, backend Node.js server |
| Tooling | npm, ESLint |

## Project Structure

```text
react-blogging-system/
|-- backend/
|   |-- api/                # articles, auth, avatars, notifications,
|   |                       # subscriptions, tags, users
|   |-- middleware/         # Required and optional JWT authentication
|   |-- validation/         # Yup request schemas
|   |-- database/
|   |   |-- schema.sql      # Table definitions
|   |   `-- blogging.db     # Local SQLite file; ignored by .gitignore
|   |-- avatars/            # Built-in avatar image files
|   |-- uploads/            # Default article image storage
|   |-- db.js               # SQLite connection
|   |-- initDb.js           # Schema initialization
|   |-- server.js           # API and static file serving
|   `-- package.json
|-- frontend/
|   |-- public/
|   |-- src/
|   |   |-- components/     # Navbar and ArticleCard
|   |   |-- pages/          # Route screens and their CSS
|   |   |-- App.jsx         # React Router routes
|   |   |-- config.js       # VITE_API_URL
|   |   |-- index.css
|   |   `-- main.jsx
|   |-- vite.config.js
|   `-- package.json
|-- .gitignore
`-- README.md
```

`blogging.db` and `frontend/dist/` are local/generated files excluded by `.gitignore`. Database and upload locations can be overridden through environment variables.

## Local Development

Use Node.js 22.12 or newer and npm, compatible with the current Vite and SQLite dependencies. A TinyMCE API key is needed for the hosted editor. No SQLite command-line tool is required for initialization.

### 1. Clone and install

```bash
git clone https://github.com/DaoliLi0502/react-blogging-system.git
cd react-blogging-system/backend
npm install
cd ../frontend
npm install
```

### 2. Configure environment variables

Create `backend/.env` with local settings:

```env
JWT_SECRET=your_jwt_secret
DB_PATH=./database/blogging.db
UPLOAD_PATH=uploads/
FRONTEND_URL=http://localhost:5173
NODE_ENV=development
PORT=3000
```

Create `frontend/.env`:

```env
VITE_API_URL=http://localhost:3000
VITE_TINYMCE_API_KEY=your_tinymce_api_key
```

Replace the secret/key placeholders with your own values. `.gitignore` excludes `.env` and `.env.*`, except `.env.example`.

| Variable | Use and default |
| --- | --- |
| `JWT_SECRET` | Backend JWT signing and verification; no default |
| `DB_PATH` | SQLite file used by server and initialization script; defaults to `./database/blogging.db` |
| `UPLOAD_PATH` | Upload destination and static image directory; defaults to `uploads/` |
| `FRONTEND_URL` | Allowed CORS origin; defaults to `http://localhost:5173` |
| `NODE_ENV` | Enables production cookie settings when exactly `production` |
| `PORT` | Backend port, default `3000`; also used by frontend production start script |
| `VITE_API_URL` | Backend origin without `/api` or a trailing slash; no fallback in `config.js` |
| `VITE_TINYMCE_API_KEY` | TinyMCE key used by create/edit screens |

### 3. Initialize SQLite and start the backend

From `backend/`:

```bash
npm run init-db
npm start
```

Initialization executes `backend/database/schema.sql` against `DB_PATH`. It creates missing tables but does not seed users, avatar records, or articles. No seed script is included in the current repository. A fresh database therefore starts empty, including avatar choices, even though avatar image files are present.

Run backend commands from `backend/` so relative database, avatar, and upload paths resolve correctly. For a custom database path, create its parent directory first. Starting the server alone does not initialize tables.

The backend defaults to `http://localhost:3000`, with API routes under `/api`, avatars under `/avatars`, and article images under `/uploads`.

### 4. Start the frontend

In another terminal, from `frontend/`:

```bash
npm run dev
```

Open `http://localhost:5173`, or the URL printed by Vite. If Vite uses a different port, update `FRONTEND_URL` to match.

## Development and Production Configuration

The client uses `VITE_API_URL` for API requests and backend image URLs. Authenticated Axios requests include credentials. The backend allows the single origin configured by `FRONTEND_URL` and enables credentialed CORS.

Authentication cookies are always HTTP-only and expire after one hour. Development uses `secure: false` and `SameSite=Lax`; `NODE_ENV=production` enables `secure: true` and `SameSite=None`. Production requires HTTPS.

Vite substitutes frontend variables during development/build. Set production frontend variables before building and rebuild after changes. These values are included in the browser bundle; never put backend secrets such as `JWT_SECRET` in Vite variables.

## Railway Deployment and Persistent Data

The application is deployed as a [frontend](https://blog.daolili.com) and [backend](https://api.daolili.com) on Railway. The repository provides these deployment commands:

- Backend, from `backend/`: install dependencies, initialize the target database with `npm run init-db` when needed, and run `npm start`.
- Frontend, from `frontend/`: install dependencies, run `npm run build`, and run `npm start`. The start script serves `dist` with SPA fallback on `$PORT` using `serve`.

Configure the production frontend with `VITE_API_URL=https://api.daolili.com` and its TinyMCE key at build time. Configure the backend with `FRONTEND_URL=https://blog.daolili.com`, `NODE_ENV=production`, and a private `JWT_SECRET`.

`DB_PATH` can point to a SQLite file on persistent storage, and `UPLOAD_PATH` can point to a persistent directory for uploaded article images. The upload directory is used for creation, replacement, deletion, and serving at `/uploads`; stored image URLs remain `/uploads/<filename>`. Ensure storage paths exist and are writable, including the database parent directory.

Railway service settings, volume mounts, and deployed environment values are not defined in the repository. Actual storage provisioning must be configured in the deployment environment.

## Application Routes

| Route | Purpose |
| --- | --- |
| `/` | Redirect to `/articles` |
| `/articles` | Browse paginated articles |
| `/articles/:aid` | Read an article and interact with likes, comments, tags, and subscriptions |
| `/articles/create` | Create an article; sign-in required |
| `/articles/:aid/edit` | Edit an owned article; sign-in required |
| `/search` | Search, sort, and paginate articles |
| `/tags` | Browse tags and their articles |
| `/notifications` | View mention/new-post notifications and mark as read; sign-in required |
| `/profile` | Edit profile, select avatar, log out, and view your articles; sign-in required |
| `/login` | Log in |
| `/signup` | Register |

## API Overview

All paths below are relative to `/api`. Protected operations authenticate through the `token` cookie. Article creation/editing accepts multipart form data with an optional `image` field; editing also supports image removal.

| Resource | Main endpoints |
| --- | --- |
| Authentication | `POST /login`, `POST /logout`, `GET /status` |
| Registration and profile | `POST /users`, `GET /users/check-username`, `GET/PUT/DELETE /users/me` |
| User administration | Admin-only `GET /users` and `DELETE /users/:uid` |
| Avatars | `GET /avatars` |
| Articles | `GET/POST /articles`, `GET /articles/me`, `GET/PUT/DELETE /articles/:aid` |
| Likes | `GET/POST/DELETE /articles/:aid/likes` |
| Comments | `GET/POST /articles/:aid/comments`, `DELETE /articles/:aid/comments/:cid` |
| Tags | `GET/POST /tags`, `GET /tags/:tid/articles`, `POST /articles/:aid/tags`, `DELETE /articles/:aid/tags/:tid` |
| Subscriptions | `POST /subscriptions`, `DELETE /subscriptions/:uid`, `GET /users/:uid/subscriptions` (subscriber count and current user's status) |
| Comment notifications | `GET /comment-notifications`, `PUT /comment-notifications/:cnid` to mark as read |
| Subscription notifications | `GET /subscription-notifications`, `PUT /subscription-notifications/:snid` to mark as read |

Article listing accepts `search`, `match`, `sort`, `order`, `page`, and `limit`. Refer to `backend/api/` and `backend/validation/` for fields and authorization checks.

## Database Model

The schema defines ten tables:

| Tables | Role |
| --- | --- |
| `avatars`, `users` | Avatar paths and accounts, including password hashes, profile fields, optional avatar reference, and admin flag |
| `articles`, `comments` | Articles reference authors; comments reference an article and their author |
| `tags`, `article_tags` | Unique tag names and the many-to-many article/tag relationship |
| `article_likes` | User/article pairs; composite primary key prevents duplicate likes |
| `user_subscriptions` | Subscriber/author pairs; duplicate and self-subscriptions are constrained |
| `comment_notifications`, `subscription_notifications` | Recipient-specific references to comments or new articles, with read flags |

The schema declares foreign keys with cascading deletion for dependent records and `SET NULL` for deleted avatars. It enables foreign keys during initialization; `db.js` does not explicitly enable them on the server connection, so the connection code alone does not guarantee runtime cascading behavior.

## Available Scripts

| Directory | Command | Purpose |
| --- | --- | --- |
| `backend/` | `npm start` | Run `node server.js` |
| `backend/` | `npm run init-db` | Execute schema against configured SQLite file |
| `frontend/` | `npm run dev` | Start Vite development server |
| `frontend/` | `npm run build` | Build frontend into `dist/` |
| `frontend/` | `npm start` | Serve built SPA with `serve -s dist -l $PORT` |
| `frontend/` | `npm run preview` | Preview frontend build locally |
| `frontend/` | `npm run lint` | Run ESLint |

The backend `npm test` script is a placeholder that exits with an error; no automated test suite is provided.
