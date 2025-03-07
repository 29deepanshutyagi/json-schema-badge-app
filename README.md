# Next.js Badge Issuer

This project is a Next.js application that automates the issuance of digital badges using the Badgr API and retrieves data from Google Sheets.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Running the Project](#running-the-project)
- [Building the Project](#building-the-project)
- [License](#license)

## Prerequisites

- Node.js (version 12.x or later)
- [pnpm](https://pnpm.js.org/) (Node Package Manager)
- A GitHub account (for version control)
- Access to Google Sheets and Badgr API

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/your-repo-name.git
   cd your-repo-name
   ```

2. Install the dependencies using `pnpm`:

   ```bash
   pnpm install
   ```

## Environment Variables

Create a `.env` file in the root of your project based on the `.env.example` file. Fill in the required values:

```plaintext
# Badgr
BADGR_API_URL="https://api.badgr.io"
BADGR_ACCESS_TOKEN="YOUR_BADGR_ACCESS_TOKEN"
BADGR_ISSUER_ID="YOUR_BADGR_ISSUER_ID"
BADGR_BADGE_CLASS_ID="YOUR_BADGR_BADGE_CLASS_ID"

# Google
GOOGLE_SERVICE_ACCOUNT_EMAIL="YOUR_GOOGLE_SERVICE_ACCOUNT_EMAIL"
GOOGLE_PRIVATE_KEY="YOUR_GOOGLE_PRIVATE_KEY"
GOOGLE_SHEET_ID="YOUR_GOOGLE_SHEET_ID"

# App
PORT=3000
DEBUG=true
```

## Running the Project

To run the project in development mode, use the following command:

```bash
pnpm run dev
```

This will start the development server, and you can view the application at `http://localhost:3000`.

## Building the Project

To build the project for production, run:

```bash
pnpm run build
```

If you want to export the application as static files, you can run:

```bash
pnpm run export
```

## License

This project is licensed under the MIT License. See the LICENSE file for details.