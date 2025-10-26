# Web Report X

Web Report X is a tool to analyze and report Core Web Vitals metrics for any public website. It leverages the Chrome UX Report (CrUX) API to provide real-user experience data.

## Features

- **Core Web Vitals Analysis**: Get detailed metrics on LCP, FID, and CLS.
- **Multiple URL Support**: Analyze single or multiple URLs at once.
- **Device-Specific Reports**: Filter reports by desktop or mobile form factors.
- **Data Filtering and Sorting**: Easily filter and sort the results to identify key performance issues.

## Technologies Used

- **Next.js**: A React framework for building server-side rendered and static web applications.
- **TypeScript**: A typed superset of JavaScript that enhances code quality and maintainability.
- **Tailwind CSS**: A utility-first CSS framework for rapid UI development.
- **CrUX API**: Provides real-user measurement data from Chrome.

## Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

- Node.js (v20 or later)
- pnpm

### Installation

1. Clone the repo:
   ```sh
   git clone https://github.com/your_username/web-report-x.git
   ```
2. Install NPM packages:
   ```sh
   pnpm install
   ```

### Environment Variables

Create a `.env.local` file in the root of your project and add the following environment variables:

```
GOOGLE_CRUX_API_KEY="Your-CrUX-API-Key"
GOOGLE_CRUX_API_ENDPOINT="https://chromeuxreport.googleapis.com/v1/records:queryRecord"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### Running the Application

To run the app in development mode, use:

```sh
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## Available Scripts

- `pnpm dev`: Runs the app in development mode.
- `pnpm build`: Builds the app for production.
- `pnpm start`: Starts a production server.
- `pnpm lint`: Lints the codebase for errors.
