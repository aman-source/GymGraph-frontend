# GymGraph Frontend

Static landing page for GymGraph - LinkedIn for Fitness.

## Tech Stack

- **React 19** + **Vite 6**
- **Tailwind CSS** for styling
- **Framer Motion** for animations
- **WebGL Shaders** for background effects
- **Radix UI** for admin dashboard components
- **TanStack Query** for data fetching

## Routes

| Route | Description |
|-------|-------------|
| `/` | Landing page with shader background |
| `/about` | About page |
| `/contact` | Contact form |
| `/terms` | Terms of Service |
| `/privacy` | Privacy Policy |
| `/super-admin` | Platform admin dashboard |
| `/gym-admin-dashboard` | Gym admin dashboard |

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Or with yarn
yarn install
```

### Environment Variables

Create a `.env` file in the root directory:

```env
VITE_BACKEND_URL=http://localhost:8000
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Running Locally

```bash
# Start development server
npm run dev

# Or with yarn
yarn dev
```

The app will be available at [http://localhost:5173](http://localhost:5173)

### Building for Production

```bash
# Create production build
npm run build

# Preview production build
npm run preview
```

Build output is in the `build/` directory.

## Project Structure

```
src/
├── components/
│   ├── admin/          # Admin dashboard components
│   ├── shaders/        # WebGL shader components
│   └── ui/             # Radix UI components
├── hooks/              # React hooks (admin, gym-admin)
├── lib/                # Utilities (api, auth, supabase)
└── pages/              # Route pages
    ├── Landing.jsx     # Main landing with shaders
    ├── About.jsx
    ├── Contact.jsx
    ├── Terms.jsx
    ├── Privacy.jsx
    ├── SuperAdminDashboard.jsx
    └── GymAdminDashboard.jsx
```

## Shader Background

The landing page uses a custom WebGL shader for the animated background. To customize:

1. Edit `src/components/shaders/ShaderCanvas.jsx`
2. Modify the `defaultFragmentShader` GLSL code
3. Or pass a custom `fragmentShader` prop to `<ShaderBackground />`

## Admin Access

Admin dashboards require authentication:

1. Navigate to `/super-admin` or `/gym-admin-dashboard`
2. Sign in with admin credentials
3. Role-based access: `super_admin` or `gym_admin`

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |

## License

All rights reserved. GymGraph 2026.
