# OKR Platform

A modern web application for managing Objectives and Key Results (OKRs) built with React, TypeScript, and Tailwind CSS.

## Features

- 📊 **Dashboard**: Overview of all objectives and key results with real-time progress tracking
- 🎯 **Objectives Management**: Create, edit, and track organizational objectives
- 📈 **Key Results Tracking**: Monitor measurable outcomes with progress indicators
- 👥 **Team Management**: Organize teams and track their OKR performance
- 🎨 **Modern UI**: Beautiful, responsive design with dark mode support
- ⚡ **Fast Performance**: Built with Vite for optimal development and production performance

## Tech Stack

- **Frontend Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router v6
- **HTTP Client**: Axios
- **Linting**: ESLint with TypeScript support

## Getting Started

### Prerequisites

- Node.js 16+ and npm/yarn installed
- Git for version control

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd okr-platform
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Start the development server:
```bash
npm run dev
# or
yarn dev
```

The application will open automatically at http://localhost:3000

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Project Structure

```
okr-platform/
├── src/
│   ├── components/     # Reusable UI components
│   │   └── Layout.tsx   # Main layout with navigation
│   ├── pages/          # Page components
│   │   ├── Dashboard.tsx
│   │   ├── Objectives.tsx
│   │   ├── KeyResults.tsx
│   │   └── Teams.tsx
│   ├── App.tsx         # Main app component with routing
│   ├── main.tsx        # Application entry point
│   └── index.css       # Global styles and Tailwind imports
├── public/             # Static assets
├── index.html          # HTML entry point
├── package.json        # Dependencies and scripts
├── vite.config.ts      # Vite configuration
├── tsconfig.json       # TypeScript configuration
└── tailwind.config.js  # Tailwind CSS configuration
```

## How to Use Cursor to Build Apps

### Quick Tips:

1. **Use Composer (Cmd/Ctrl + Shift + I)** to create multiple files at once:
   - Type: "Create a login page with form validation"
   - Cursor will generate all necessary files

2. **Use AI Chat (Cmd/Ctrl + K)** for specific help:
   - "How do I add authentication to this app?"
   - "Help me optimize this component"

3. **Inline Editing**: Select code and press Cmd/Ctrl + K to:
   - Fix bugs
   - Add features
   - Refactor code

4. **Terminal Commands**: Use the integrated terminal for:
   - Installing packages
   - Running tests
   - Building the project

### Example Workflows:

#### Adding a New Feature:
1. Open Composer (Cmd/Ctrl + Shift + I)
2. Describe the feature: "Add user authentication with login and signup pages"
3. Cursor will create all necessary files and update existing ones

#### Debugging:
1. Select the problematic code
2. Press Cmd/Ctrl + K
3. Type: "Fix this error" or describe the issue
4. Cursor will provide a solution

#### Learning:
1. Open AI Chat
2. Ask questions like:
   - "Explain how React hooks work"
   - "What's the best way to handle state management?"
   - "How do I optimize performance?"

## Next Steps

To extend this application, you can:

1. **Add Backend API**: Connect to a REST or GraphQL API
2. **Add Authentication**: Implement user login/signup
3. **Add State Management**: Use Redux, Zustand, or Context API
4. **Add Testing**: Set up Jest and React Testing Library
5. **Add CI/CD**: Configure GitHub Actions or similar
6. **Deploy**: Use Vercel, Netlify, or AWS

## Contributing

Feel free to submit issues and pull requests to improve the platform.

## License

MIT
