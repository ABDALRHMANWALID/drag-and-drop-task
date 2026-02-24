# Kanban Board

A Kanban-style ToDo list application built with Next.js, Material UI, React Query, and drag-and-drop. Tasks are displayed in four columns (TO DO, IN PROGRESS, IN REVIEW, DONE) with full CRUD, search, and pagination per column.

## Features

- **4 columns**: TO DO (backlog), IN PROGRESS, IN REVIEW, DONE
- **CRUD**: Create, update, and delete tasks
- **Drag-and-drop**: Move tasks between columns (via [@dnd-kit](https://dndkit.com/))
- **Pagination**: "Load more" in each column (configurable page size)
- **Search**: Filter tasks by title or description
- **Caching**: Data fetched and cached with [TanStack React Query](https://tanstack.com/query/latest)
- **UI**: [Material UI (MUI)](https://mui.com/) for layout and components

## Tech Stack

- **Next.js 16** (App Router)
- **React 19**
- **TypeScript**
- **TanStack React Query** – server state and caching
- **MUI (Material UI)** – components and theme
- **@dnd-kit** – accessible drag-and-drop

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Start the API server (json-server)

The app expects a REST API at `http://localhost:4000`. Using the included `db.json` with [json-server](https://github.com/typicode/json-server):

```bash
npx json-server --watch db.json --port 4000
```

Leave this terminal running. Endpoints:

- `GET /tasks` – list all tasks
- `GET /tasks/:id` – get one task
- `POST /tasks` – create task (body: `{ "title", "description", "column" }`)
- `PATCH /tasks/:id` – update task
- `DELETE /tasks/:id` – delete task

Column values: `todo`, `in-progress`, `in-review`, `done`.

### 3. Start the Next.js app

In a second terminal:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### 4. (Optional) Custom API URL

To use a different API base URL:

```bash
NEXT_PUBLIC_API_URL=http://localhost:5000 npm run dev
```

## Project structure

```
├── app/
│   ├── layout.tsx      # Root layout, MUI + React Query providers
│   ├── page.tsx        # Home page (Kanban board)
│   ├── providers.tsx   # QueryClient + ThemeProvider
│   └── globals.css
├── components/
│   ├── KanbanBoard.tsx  # Main board: DnD context, search, columns, modal
│   ├── KanbanColumn.tsx # Droppable column + task list + Load more / Add task
│   ├── TaskCard.tsx    # Draggable task card (edit/delete)
│   └── TaskModal.tsx   # Create/Edit task dialog
├── lib/
│   ├── api.ts          # REST client (fetch tasks, create, update, delete)
│   ├── constants.ts    # Column config, tasks per page
│   ├── types.ts        # Task, TaskColumn, payload types
│   └── hooks/
│       └── use-tasks.ts # React Query hooks (useTasksQuery, mutations)
├── db.json             # Sample data for json-server
├── package.json
└── README.md
```

## Scripts

| Command        | Description                |
|----------------|----------------------------|
| `npm run dev`  | Start Next.js dev server   |
| `npm run build`| Build for production       |
| `npm run start`| Run production build       |
| `npm run lint` | Run ESLint                 |

If `npm run build` fails with Turbopack/font resolution errors, try running the dev server with `npm run dev` (which often works) or ensure Node and Next.js are up to date.
