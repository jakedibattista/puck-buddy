# Technology Stack

## Framework & Runtime
- **Expo** - React Native framework for cross-platform development
- **React Native** - Core mobile development framework
- **JavaScript/TypeScript** - Primary development languages
- **Metro** - JavaScript bundler for React Native
- **Hermes** - JavaScript engine (configurable)

## Development Tools
- **Expo CLI** - Command-line interface for Expo projects
- **Expo Go** - Development client for testing
- **Expo Router** - File-based routing system
- **EAS (Expo Application Services)** - Build and deployment services

## Common Commands

### Development
```bash
# Start development server
npx expo start

# Start with specific platform
npx expo start --ios
npx expo start --android
npx expo start --web

# Clear cache and restart
npx expo start --clear
```

### Building & Deployment
```bash
# Create development build
eas build --profile development

# Create production build
eas build --profile production

# Submit to app stores
eas submit --platform ios
eas submit --platform android

# Send OTA update
eas update
```

### Project Management
```bash
# Install dependencies
npm install

# Add Expo SDK library
npx expo install [package-name]

# Upgrade Expo SDK
npx expo upgrade

# Generate native projects
npx expo prebuild
```

## Configuration Files
- `app.json` / `app.config.js` - Expo app configuration
- `package.json` - Dependencies and scripts
- `babel.config.js` - Babel transpiler configuration
- `metro.config.js` - Metro bundler configuration
- `eas.json` - EAS Build and Submit configuration