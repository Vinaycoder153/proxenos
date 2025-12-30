# Backend Documentation

## Database Setup
The database schema has been successfully migrated to your Supabase project: `hhbyaxnupcmgukjugfus`.

## Environment Variables
Create a `.env.local` file in the root directory with the following keys:
```env
NEXT_PUBLIC_SUPABASE_URL="https://hhbyaxnupcmgukjugfus.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="<YOUR_SUPABASE_ANON_KEY>"
```

## API Endpoints

### Tasks
- **GET /api/tasks**: List all tasks for the current user.
- **POST /api/tasks**: Create a new task.
  - Body: `{ "title": "string", "priority": "High|Medium|Low", "due_date": "YYYY-MM-DD" }`
- **PATCH /api/tasks**: Update task status.
  - Body: `{ "id": "uuid", "status": "pending|completed|missed" }`

### Habits
- **GET /api/habits**: List all habits.
- **POST /api/habit-log**: Log or unlog a habit for a date.
  - Body: `{ "habit_id": "uuid", "date": "YYYY-MM-DD", "completed": boolean }`

### Discipline Score
- **GET /api/discipline-score**: Get today's score.
  - Returns: `{ "score": number, "completed": number, "total": number }`

## Security
- All endpoints are protected by Supabase Auth (`supabase.auth.getUser()`).
- Row Level Security (RLS) is enabled on all tables.
