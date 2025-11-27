# BackendMap

BackendMap is an educational web platform that visualizes complex system architectures using interactive diagrams.

## Features

- Interactive Architecture Diagrams
- Step-by-step Narrative Flow
- Cyberpunk / Dark Mode UI
- Real-time Node Highlighting

## Setup

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Supabase Configuration**

   To connect to a real Supabase backend, create a `.env` file in the root directory:

   ```env
   VITE_SUPABASE_URL=your_project_url
   VITE_SUPABASE_ANON_KEY=your_anon_key
   ```

   If these variables are not present, the application will run in **Mock Mode** using local data.

3. **Database Setup**

   Run the SQL scripts located in the `supabase/` folder in your Supabase SQL Editor:
   - `schema.sql`: Creates the tables.
   - `seed.sql`: Inserts the initial "Amazon Buy" scenario.

4. **Run the development server**
   ```bash
   npm run dev
   ```

## Tech Stack

- React
- Vite
- Tailwind CSS
- React Flow (@xyflow/react)
- Supabase
