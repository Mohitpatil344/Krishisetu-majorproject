# 🌱 Greenify - Agricultural Waste Management Platform

A comprehensive digital platform that transforms agricultural waste management through intelligent solutions, connecting farmers with buyers and optimizing supply chain processes.

## 🚀 Overview

Greenify is a React-based web application that addresses the critical challenge of agricultural waste management in India. The platform provides a complete ecosystem for farmers to list their agricultural waste, buyers to discover and purchase waste materials, and includes AI-powered recommendations for optimized farming practices.

### 🎯 Key Features

- **🤖 AI Lab**: Intelligent agricultural assistant providing personalized recommendations
- **🛒 Digital Marketplace**: Connect farmers with buyers for agricultural waste
- **📊 Dashboard Analytics**: Comprehensive analytics for farmers and buyers
- **📚 Learning Resources**: Educational content for sustainable farming practices
- **🔐 Secure Authentication**: Auth0-powered authentication system
- **📱 Responsive Design**: Mobile-first design with modern UI/UX

## 🏗️ Architecture

### Frontend Stack
- **React 18.2.0** - Core framework
- **React Router DOM** - Client-side routing
- **Tailwind CSS** - Styling and responsive design
- **Framer Motion** - Animations and transitions
- **Radix UI** - Accessible UI components
- **Recharts** - Data visualization
- **Lucide React** - Modern icons

### Authentication & Security
- **Auth0** - Identity management and authentication
- **JWT Tokens** - Secure API communication

### Development Tools
- **Create React App** - Build tooling
- **ESLint** - Code linting
- **PostCSS** - CSS processing
Updated Readme
## 📁 Project Structure

```
src/
├── components/
│   ├── ui/              # Reusable UI components
│   │   ├── avatar.jsx
│   │   ├── button.jsx
│   │   ├── card.jsx
│   │   ├── dropdown-menu.jsx
│   │   └── progress.jsx
│   ├── TopNavigation.js # Main navigation component
│   ├── card.js          # Farmer product cards
│   └── landing_sec*.js  # Landing page sections
├── pages/
│   ├── AILab.js         # AI-powered recommendations
│   ├── DashboardPage.js # Analytics dashboard
│   ├── FarmerDashboard.js # Farmer-specific dashboard
│   ├── FarmerRegistration.js # Farmer onboarding
│   ├── marketplace.js   # Waste marketplace
│   ├── ResourcesPage.js # Learning materials
│   ├── RoleSelection.js # User role selection
│   ├── WasteDetail.js   # Individual waste listing details
│   └── landing.js       # Landing page
├── hooks/
│   └── useAuthToken.js  # Authentication hook
├── lib/
│   └── utils.js         # Utility functions
└── assets/              # Images and static files
```

## 🚀 Getting Started

### Prerequisites

- Node.js (version 16.x or higher)
- npm or yarn package manager
- Auth0 account for authentication setup

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd knowcode_protobuf_frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the root directory:
   ```env
   REACT_APP_AUTH0_DOMAIN=your-auth0-domain
   REACT_APP_AUTH0_CLIENT_ID=your-auth0-client-id
   REACT_APP_AUTH0_AUDIENCE=your-auth0-audience
   ```

4. **Start the development server**
   ```bash
   npm start
   ```

5. **Build for production**
   ```bash
   npm run build
   ```

## 🔧 Configuration

### Auth0 Setup

1. Create an Auth0 application
2. Configure allowed callback URLs
3. Set up social connections (Google, Facebook, etc.)
4. Update environment variables with your Auth0 credentials

## 📱 Core Features

### 🌾 Farmer Dashboard
- **Profile Management**: Complete farmer registration with farm details
- **Waste Listings**: Create, update, and manage agricultural waste listings
- **Status Tracking**: Real-time status updates for waste listings
- **Analytics**: View performance metrics and insights

### 🛒 Marketplace
- **Search & Filter**: Advanced search capabilities for waste products
- **Product Discovery**: Browse available agricultural waste by type, location, and price
- **Direct Contact**: WhatsApp integration for instant communication
- **Real-time Updates**: Live inventory and availability status

### 🤖 AI Lab
- **Smart Predictions**: AI-powered crop yield and waste predictions
- **Price Analysis**: Market price comparisons and trends
- **Resource Optimization**: Recommendations for efficient resource utilization
- **Data Visualization**: Interactive charts and graphs for insights

### 📚 Resources Center
- **Educational Content**: Best practices for waste management
- **Sustainability Guides**: Environmental impact reduction strategies
- **Market Insights**: Industry trends and opportunities
- **Technical Documentation**: Implementation guides and tutorials

## 🎨 Design System

### Color Palette
- **Primary**: Green (#10B981) - Emerald (#059669)
- **Secondary**: Teal (#14B8A6) - Blue (#3B82F6)
- **Accent**: Yellow (#F59E0B) - Orange (#F97316)
- **Neutral**: Gray scale for text and backgrounds


### Component Library
Built on Radix UI primitives for accessibility and consistency:
- Avatar components for user profiles
- Card layouts for content organization
- Dropdown menus for navigation
- Progress indicators for loading states
- Form controls with validation

## 🔌 API Integration

### Authentication Flow
```javascript
// Example API call with authentication
const response = await fetch('/api/endpoint', {
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
});
```

### Key Endpoints
- `POST /api/v1/users/register/complete` - Complete user registration
- `GET /api/v1/waste/all` - Fetch all waste listings
- `POST /api/v1/waste/add` - Add new waste listing
- `PATCH /api/v1/waste/:id/status` - Update waste status
- `GET /api/v1/users/data/:auth0Id` - Get user profile data

## 🧪 Testing

Run the test suite:
```bash
npm test
```

For coverage reports:
```bash
npm test -- --coverage
```

### Manual Build
```bash
npm run build
# Deploy the 'build' folder to your hosting service
```


### Code Style Guidelines
- Use functional components with React Hooks
- Follow ESLint configuration
- Implement responsive design patterns
- Add proper error handling and loading states
- Write descriptive commit messages

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Auth0** for authentication services
- **Vercel** for hosting and deployment
- **Tailwind CSS** for styling framework
- **Radix UI** for accessible components
- **Framer Motion** for animations
- All contributors and beta testers


---

**Built with ❤️ for sustainable agriculture and environmental conservation**
