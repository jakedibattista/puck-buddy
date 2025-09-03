# Project Structure

## Directory Organization

```
├── app/                    # Main application code and routing
│   └── expo.txt           # Expo documentation reference
├── model/                 # Data models and business logic
├── .kiro/                 # Kiro AI assistant configuration
│   └── steering/          # AI guidance documents
└── .vscode/               # VS Code workspace settings
    └── settings.json      # Editor configuration
```

## Recommended Structure (Expo Router)

When using Expo Router, the `app/` directory should follow file-based routing conventions:

```
app/
├── (tabs)/                # Tab navigation group
│   ├── index.tsx         # Home tab screen
│   ├── profile.tsx       # Profile tab screen
│   └── _layout.tsx       # Tab layout configuration
├── modal.tsx             # Modal screen
├── +not-found.tsx        # 404 error screen
└── _layout.tsx           # Root layout
```

## Folder Conventions

### Core Directories
- `app/` - File-based routing screens and layouts (Expo Router)
- `components/` - Reusable UI components
- `constants/` - App constants and configuration
- `hooks/` - Custom React hooks
- `utils/` - Utility functions and helpers
- `assets/` - Static assets (images, fonts, etc.)
- `model/` - Data models, types, and business logic

### Optional Directories
- `services/` - API calls and external service integrations
- `store/` - State management (Redux, Zustand, etc.)
- `styles/` - Global styles and themes
- `types/` - TypeScript type definitions
- `lib/` - Third-party library configurations

## File Naming Conventions
- Use kebab-case for directories: `user-profile/`
- Use PascalCase for React components: `UserProfile.tsx`
- Use camelCase for utilities and hooks: `useUserData.ts`
- Use lowercase for configuration files: `app.json`, `package.json`

## Special Files (Expo Router)
- `_layout.tsx` - Layout components for nested routes
- `+html.tsx` - Custom HTML document (web only)
- `+not-found.tsx` - 404 error boundary
- `(group)/` - Route groups (parentheses create layout boundaries)
- `[param].tsx` - Dynamic route parameters