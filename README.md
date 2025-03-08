# Connect - AI-Powered MCN Agent Service

Connect is an AI-powered platform that streamlines collaboration between creators and brands, automating complex processes to reduce setup time from days to minutes.

## Features

- **Fast Collaboration**: Reduce collaboration setup time from days to minutes with our streamlined process
- **AI-Powered Automation**: Automatic responses to routine inquiries, legal advice, and content insights
- **Availability Management**: Creators can set their availability, and brands can see it upfront
- **Seamless Contracts**: Manage contracts, legal reviews, and payments all in one place
- **Powerful Analytics**: Get detailed insights on content performance and audience engagement

## Technology Stack

- **Frontend**: React.js, TypeScript, Material-UI
- **State Management**: React Context API
- **Routing**: React Router
- **API Communication**: Axios
- **Data Visualization**: Chart.js
- **Form Handling**: Formik, Yup
- **Date Manipulation**: date-fns

## Project Structure

```
connect/
├── public/                # Static files
├── src/                   # Source code
│   ├── components/        # Reusable components
│   │   ├── brand/         # Brand-specific components
│   │   ├── common/        # Shared components
│   │   └── creator/       # Creator-specific components
│   ├── context/           # React context providers
│   ├── hooks/             # Custom React hooks
│   ├── pages/             # Page components
│   │   ├── auth/          # Authentication pages
│   │   ├── brand/         # Brand pages
│   │   └── creator/       # Creator pages
│   ├── services/          # API services
│   ├── types/             # TypeScript type definitions
│   └── utils/             # Utility functions
├── package.json           # Dependencies and scripts
└── tsconfig.json          # TypeScript configuration
```

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:

   ```
   git clone https://github.com/yourusername/connect.git
   cd connect
   ```

2. Install dependencies:

   ```
   npm install
   ```

3. Start the development server:

   ```
   npm start
   ```

4. Open [http://localhost:3000](http://localhost:3000) to view the app in your browser.

## Development

### Available Scripts

- `npm start` - Runs the app in development mode
- `npm test` - Launches the test runner
- `npm run build` - Builds the app for production
- `npm run eject` - Ejects from Create React App

## Key Features Implementation

### Creator Availability Management

Creators can set their availability using the calendar component, which brands can view when making collaboration requests.

### AI-Powered Responses

The platform uses AI to automatically respond to routine inquiries, provide legal advice on contracts, and generate content insights.

### Analytics Dashboard

Both creators and brands have access to detailed analytics dashboards showing performance metrics, engagement rates, and growth insights.

### Collaboration Workflow

The platform streamlines the entire collaboration process from initial inquiry to contract signing, content creation, and performance analysis.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Material-UI for the component library
- Chart.js for data visualization
- date-fns for date manipulation
