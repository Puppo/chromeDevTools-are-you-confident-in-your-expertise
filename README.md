# Chrome DevTools Mastery Demo 🔧

> **Are you confident in your Chrome DevTools expertise?**  
> This interactive project will put your skills to the test and teach you advanced DevTools techniques through hands-on examples.

![Chrome DevTools Demo](https://img.shields.io/badge/Chrome-DevTools-4285f4?style=for-the-badge&logo=googlechrome&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Fastify](https://img.shields.io/badge/Fastify-000000?style=for-the-badge&logo=fastify&logoColor=white)

## 🎯 Project Overview

This monorepo demonstrates the power of Chrome DevTools through practical, real-world scenarios. Built with modern web technologies, it provides interactive examples that help developers master debugging, performance analysis, network monitoring, and code optimization.

### 🚀 Live Demo Features

- **Beautiful Landing Page** with intentionally slow-loading hero image
- **Interactive Todo App** with Server-Side Rendering (SSR)
- **Real-time DevTools Showcase** with performance metrics
- **Network Activity Demonstrations** with API integrations
- **Console Debugging Examples** with structured logging
- **Memory Management Demos** for heap analysis

## 🏗️ Architecture

```
📦 Monorepo Structure
├── 🔧 apps/
│   ├── 🚀 backend/          # Fastify API Server
│   └── 💻 frontend/         # Next.js React App
├── 📦 packages/
│   └── 🔗 api/             # Shared API Package (Zod schemas & types)
└── package.json            # Root workspace configuration
```

## 🛠️ Technology Stack

### Backend

- **⚡ Fastify**: High-performance web framework
- **📝 TypeScript**: Type-safe development
- **🔍 Pino Logger**: Structured logging for debugging
- **🌐 CORS**: Cross-origin resource sharing
- **❤️ Health Checks**: API monitoring

### Frontend

- **⚛️ Next.js 15**: React with App Router and Turbopack
- **🎨 Tailwind CSS 4**: Modern utility-first styling
- **📡 Server-Side Rendering**: Performance optimization
- **🔄 Optimistic Updates**: Smooth user experience
- **🎯 TypeScript**: Full type safety
- **🔄 React Query**: Server state management
- **🌐 Internationalization**: Multi-language support

### Shared Packages

- **🔗 @devtools-demo/api**: Shared type-safe API contracts
- **✅ Zod Schemas**: Runtime validation and type inference
- **📦 TypeScript Types**: Consistent data structures across apps
- **🔧 Build System**: tsup for dual CommonJS/ESM output

## 🚀 Quick Start

### Prerequisites

- **Node.js 18+**
- **npm or yarn**
- **Google Chrome** (latest version recommended)

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd chromeDevTools-are-you-confident-in-your-expertise

# Install dependencies for all workspaces
npm install

# Start the backend server
npm run dev:backend

# In a new terminal, start the frontend
npm run dev:frontend
```

### 🌐 Accessing the App

- **Frontend**: <http://localhost:3000>
- **Backend API**: <http://localhost:3001>
- **Health Check**: <http://localhost:3001/health>

## 📖 Learning Resources

### Chrome DevTools Official Documentation

- [DevTools Overview](https://developer.chrome.com/docs/devtools/)
- [Network Panel](https://developer.chrome.com/docs/devtools/network/)
- [Performance Panel](https://developer.chrome.com/docs/devtools/performance/)
- [Console API](https://developer.chrome.com/docs/devtools/console/)
- [Memory Panel](https://developer.chrome.com/docs/devtools/memory-problems/)

### Additional Resources

- [Web.dev Performance](https://web.dev/performance/)
- [React DevTools](https://react.dev/learn/react-developer-tools)
- [Next.js Performance](https://nextjs.org/docs/advanced-features/measuring-performance)

## 🤝 Contributing

Contributions are welcome! This project is designed to be educational and help developers improve their DevTools skills.

## 📄 License

MIT License - feel free to use this project for learning and teaching purposes.
