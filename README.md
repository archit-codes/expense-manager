# Expense Manager

A modern cross-platform expense management mobile application built using **React Native (Expo)** and **TypeScript**, designed to simplify personal financial tracking through real-time transaction management, wallet-based budgeting, analytics, and media-supported expense records.

The application enables users to manage income and expenses efficiently with categorized transactions, wallet management, receipt storage, real-time updates, and visual analytics.

---

## Features

### Authentication
- User Registration
- User Login
- Secure authentication using Firebase Authentication
- Welcome onboarding flow
- Logout support

---

### Dashboard & Financial Overview
- Real-time balance tracking
- Total income overview
- Total expense overview
- Complete transaction history
- Search functionality across transactions
- Responsive transaction rendering

---

### Transaction Management
Create, manage, and organize financial records.

Supported operations:
- Create transaction
- Update transaction
- Delete transaction
- Income / Expense selection
- Transaction date support
- Receipt upload
- Receipt editing

Expense categories include:

- Grocery
- Rent
- Utilities
- Transportation
- Entertainment
- Dining
- Health
- Insurance
- Savings
- Clothing
- Personal
- Others

---

### Wallet Management
Manage multiple financial sources inside the application.

Capabilities:
- Create wallet
- Edit wallet
- Delete wallet
- Wallet icon upload
- Multiple wallet support
- Dynamic wallet balance updates

---

### Statistics & Analytics
Track spending behavior using visual insights.

Features:
- Weekly statistics
- Monthly statistics
- Yearly statistics
- Combined Income + Expense visualization
- Interactive bar charts
- Segmented analytics views

---

### Profile Management
Personalize account information.

Supported features:
- Update profile name
- Upload profile picture
- Real-time profile updates
- Logout functionality

---

### Media Support
Cloud-based asset handling using Cloudinary.

Supports:
- Profile images
- Wallet icons
- Transaction receipts
- Receipt updates

---

## Tech Stack

### Mobile Development
- React Native
- Expo
- TypeScript
- Expo Router

### Backend & Database
- Firebase Authentication
- Firebase Firestore

### Media Management
- Cloudinary

### State Management
- React Hooks
- Context API

### UI & Performance
- React Native Reanimated
- React Native Gifted Charts
- React Native Segmented Control
- FlatList
- FlashList

---

## Application Architecture

### Navigation Structure

```plaintext
Welcome
 ├── Login
 └── Register

Main App
 ├── Home
 ├── Statistics
 ├── Wallet
 └── Profile

Modals
 ├── Search
 ├── Transaction
 ├── Wallet
 └── Profile
```

---

## Folder Structure

```plaintext
Expense Manager
│
├── app
│   ├── (auth)
│   │   ├── login.tsx
│   │   ├── register.tsx
│   │   └── welcome.tsx
│   │
│   ├── (modals)
│   │   ├── profileModal.tsx
│   │   ├── searchModal.tsx
│   │   ├── transactionModal.tsx
│   │   └── walletModal.tsx
│   │
│   ├── (tabs)
│   │   ├── index.tsx
│   │   ├── statistics.tsx
│   │   ├── wallet.tsx
│   │   ├── profile.tsx
│   │   └── _layout.tsx
│   │
│   ├── index.tsx
│   └── _layout.tsx
│
├── assets
│   └── images
│
├── components
├── config
├── constants
├── contexts
├── hooks
├── services
├── utils
│
├── types.ts
├── app.json
├── package.json
├── tsconfig.json
└── README.md
```

---

## Installation

### Clone Repository

```bash
git clone <repository-url>
cd expense-manager
```

### Install Dependencies

```bash
npm install
```

### Configure Environment Variables

Create:

```plaintext
.env
```

Add:

```env
EXPO_PUBLIC_FIREBASE_API_KEY=
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=
EXPO_PUBLIC_FIREBASE_PROJECT_ID=
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
EXPO_PUBLIC_FIREBASE_APP_ID=

EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME=
EXPO_PUBLIC_CLOUDINARY_UPLOAD_PRESET=
```

---

### Start Development Server

```bash
npx expo start
```

---

## Screens Included

### Authentication
- Welcome
- Login
- Register

### Main Screens
- Home
- Statistics
- Wallet
- Profile

### Modal Screens
- Search
- Transaction
- Wallet
- Profile

---

## Future Enhancements

- Export financial reports
- Budget goals
- Notification reminders
- Advanced analytics
- Multi-currency support

---

## License

This project is developed for learning, experimentation, and portfolio purposes.