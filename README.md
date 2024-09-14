## Introduction
Built with Next.js, Horizon is a financial SaaS platform that connects to multiple bank accounts, displays transactions in real-time, allows users to transfer money to other platform users, and manages their finances altogether.

To see the live site go to https//:www.jj-banking.vercel.app

## Features
👉 Authentication: An ultra-secure SSR authentication with proper validations and authorization

👉 Connect Banks: Integrates with Plaid for multiple bank account linking

👉 Home Page: Shows general overview of user account with total balance from all connected banks, recent transactions, money spent on different categories, etc

👉 My Banks: Check the complete list of all connected banks with respective balances, account details

👉 Transaction History: Includes pagination and filtering options for viewing transaction history of different banks

👉 Real-time Updates: Reflects changes across all relevant pages upon connecting new bank accounts.

👉 Funds Transfer: Allows users to transfer funds using Dwolla to other accounts with required fields and recipient bank ID.

👉 Responsiveness: Ensures the application adapts seamlessly to various screen sizes and devices, providing a consistent user experience across desktop, tablet, and mobile platforms.

and many more, including code architecture and reusability.

## How To Run This Project
Install the project dependencies using npm:

```bash
npm install
```

**Set Up Environment Variables**

Create a new file named `.env` in the root of your project and add the following content:

```env
#NEXT
NEXT_PUBLIC_SITE_URL=

#APPWRITE
NEXT_PUBLIC_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
NEXT_PUBLIC_APPWRITE_PROJECT=
APPWRITE_DATABASE_ID=
APPWRITE_USER_COLLECTION_ID=
APPWRITE_BANK_COLLECTION_ID=
APPWRITE_TRANSACTION_COLLECTION_ID=
APPWRITE_SECRET=

#PLAID
PLAID_CLIENT_ID=
PLAID_SECRET=
PLAID_ENV=
PLAID_PRODUCTS=
PLAID_COUNTRY_CODES=

#DWOLLA
DWOLLA_KEY=
DWOLLA_SECRET=
DWOLLA_BASE_URL=https://api-sandbox.dwolla.com
DWOLLA_ENV=sandbox

```

Replace the placeholder values with your actual respective account credentials. You can obtain these credentials by signing up on the [Appwrite](https://appwrite.io/?utm_source=youtube&utm_content=reactnative&ref=JSmastery), [Plaid](https://plaid.com/) and [Dwolla](https://www.dwolla.com/)

**Running the Project**

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the project.

## Built With
- React
- Next.js
- TailwindCSS
- Typescript
- React Hook Form
- Zod
- Chart.js
- Zod
- ShadCN
- Plaid
- Dwolla
- Sentry
- Appwrite

## Dependencies
- @hookform/resolvers": "^3.9.0",
- "@launchpad-ui/progress": "^0.5.51",
- "@radix-ui/react-dialog": "^1.1.1",
- "@radix-ui/react-label": "^2.1.0",
- "@radix-ui/react-progress": "^1.1.0",
- "@radix-ui/react-select": "^2.1.1",
- "@radix-ui/react-slot": "^1.1.0",
- "@radix-ui/react-tabs": "^1.1.0",
- "@sentry/nextjs": "^8.20.0",
- "chart.js": "^4.4.3",
- "class-variance-authority": "^0.7.0",
- "clsx": "^2.1.1",
- "dwolla-v2": "^3.4.0",
- "lucide-react": "^0.399.0",
- "next": "^14.2.6",
- "node-appwrite": "^13.0.0",
- "plaid": "^26.0.0",
- "query-string": "^9.0.0",
- "react": "^18",
- "react-chartjs-2": "^5.2.0",
- "react-countup": "^6.5.3",
- "react-dom": "^18",
- "react-hook-form": "^7.52.1",
- "react-plaid-link": "^3.5.2",
- "tailwind-merge": "^2.3.0",
- "tailwindcss-animate": "^1.0.7",
- "zod": "^3.23.8"
