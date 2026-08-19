# CloudVandana CRM — Salesforce CRUD Dashboard

A modern, enterprise SaaS-style React frontend application connecting to an existing Spring Boot backend for secure Salesforce Data Management across **Account, Opportunity, Lead, Contact, and Case** SObjects.

---

## 1. Project Overview

**CloudVandana CRM** is designed with a strict zero-credential frontend architecture:
- **No Salesforce credentials** (Client ID, Client Secret, Refresh Tokens, Access Tokens, Instance URLs) are ever exposed to or stored in the browser.
- All requests are proxied securely through a **Spring Boot REST API** running locally at `http://localhost:8080` (or configured via environment variables).
- **Contact Management** is fully implemented with live CRUD operations (`GET`, `POST`, `PUT`, `DELETE`).
- **Account, Opportunity, Lead, and Case** are pre-architected with typed configuration schemas, responsive UI bindings, and auto-generated Spring Boot REST Controller blueprints for instant backend onboarding.

---

## 2. Technologies

- **Frontend Core:** React 19, TypeScript, Vite
- **Styling & UI:** Tailwind CSS v4, Lucide React Icons
- **State & Architecture:** React Context API (`ToastContext`, `ActivityContext`), Modular REST API layer
- **Networking:** Native Fetch API with `credentials: "include"` for session-based Spring Boot authentication
- **Animations:** Custom cubic-bezier CSS keyframes for fluid modal dialogs and transitions

---

## 3. Frontend Setup

### Prerequisites
- Node.js (v18.0.0 or higher recommended)
- npm or yarn

### Installation Steps
```bash
# 1. Clone or extract the project repository
cd cloudvandana-crm

# 2. Install npm dependencies
npm install

# 3. Create your local environment configuration
cp .env.example .env
```

---

## 4. Backend Setup

Your Spring Boot backend handles Salesforce OAuth 2.0 / PKCE authentication and Salesforce REST API communication.

Ensure your Spring Boot backend:
1. Listens on `http://localhost:8080` (or update `VITE_API_BASE_URL` to match your port).
2. Enables CORS with `allowCredentials(true)` for the frontend origin.

### Example Spring Boot CORS Configuration:
```java
@Configuration
public class WebMvcConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
                .allowedOrigins("http://localhost:3000", "http://localhost:5173")
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowCredentials(true)
                .allowedHeaders("*");
    }
}
```

---

## 5. Environment Variables

Create a `.env` file in the root directory:

```env
# URL where your Spring Boot backend is accessible
VITE_API_BASE_URL=http://localhost:8080
```

> **Note:** In production, change `VITE_API_BASE_URL` to your deployed backend URL (e.g., `https://api.yourdomain.com`). You can also override the URL dynamically at runtime in the frontend under **Settings & API**.

---

## 6. How to Run Frontend

```bash
# Start the local development server
npm run dev

# The application will be accessible at:
# http://localhost:3000 (or http://localhost:5173)
```

To build for production:
```bash
npm run build
```

---

## 7. How to Connect to Spring Boot

1. Start your Spring Boot backend on port 8080:
   ```bash
   mvn spring-boot:run
   ```
2. Open the frontend in your browser.
3. If not yet authenticated with Salesforce, click **"Salesforce Login"** in the top-right header or on the dashboard banner.
4. The frontend will redirect to `http://localhost:8080/api/auth/login` to complete the Salesforce OAuth authorization handshake.
5. Upon callback redirect, your session cookie is stored in the browser, and all subsequent REST API requests will carry the session automatically.

---

## 8. Available API Endpoints

### Authentication
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/auth/login` | Initiates Salesforce OAuth 2.0 PKCE login flow |
| `GET` | `/api/auth/callback` | Salesforce OAuth redirect callback receiver |
| `POST` | `/api/auth/logout` | Clears active Salesforce session |

### Contact Management (Active)
| Method | Endpoint | Description | Request Body |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/contacts` | Retrieve list of Salesforce contacts | None |
| `GET` | `/api/contacts/{id}` | Get single contact by ID | None |
| `POST` | `/api/contacts` | Create new Salesforce contact | `{ "firstName": "...", "lastName": "...", "email": "...", "phone": "..." }` |
| `PUT` | `/api/contacts/{id}` | Update existing contact | `{ "firstName": "...", "lastName": "...", "email": "...", "phone": "..." }` |
| `DELETE` | `/api/contacts/{id}` | Delete contact from Salesforce | None |

### Additional Objects (Pre-configured schemas)
- `/api/accounts` (Account)
- `/api/opportunities` (Opportunity)
- `/api/leads` (Lead)
- `/api/cases` (Case)

---

## 9. Salesforce Authentication Flow

```
[User Clicks Login]
        │
        ▼
React Frontend  ───(GET /api/auth/login)───►  Spring Boot Backend
                                                      │
                                            (OAuth PKCE Handshake)
                                                      ▼
                                               Salesforce Login
                                                      │
                                            (User grants consent)
                                                      ▼
React Frontend  ◄───(Redirect / Session)───  Spring Boot Backend
        │
        ▼
[Salesforce Connected Status Badge Active]
```

1. Frontend sends the user to `/api/auth/login`.
2. Spring Boot redirects the browser to the Salesforce OAuth consent screen.
3. User authenticates with their Salesforce credentials.
4. Salesforce redirects to Spring Boot's `/api/auth/callback` with an authorization code.
5. Spring Boot exchanges the code for tokens and maintains the session.
6. The frontend automatically includes session credentials in subsequent REST calls.

---

## 10. Deployment Instructions

### Option A: Static Frontend Hosting (Vercel, Netlify, Cloudflare Pages, S3)
1. Run `npm run build`.
2. Set environment variable `VITE_API_BASE_URL=https://your-spring-boot-backend.com`.
3. Deploy the `dist/` directory to your static hosting provider.

### Option B: Containerized Deployment (Docker / Cloud Run)
Use a standard Dockerfile with Nginx to serve the compiled static assets.

---

## 11. Project Architecture

```
src/
├── api/
│   ├── apiClient.ts      # Base HTTP client with credentials: "include" & unified error handling
│   ├── authApi.ts        # Salesforce authentication and session checking
│   ├── contactApi.ts     # Contact CRUD REST endpoints
│   └── objectApi.ts      # Generic SObject CRUD dispatcher
├── config/
│   └── objectConfig.ts   # Declarative schemas for Contact, Account, Opportunity, Lead, Case
├── components/
│   ├── Header.tsx        # Brand header with live Salesforce connection status badge
│   ├── Sidebar.tsx       # Collapsible navigation & SObject list
│   ├── ObjectSelector.tsx# SObject dropdown selector (Account, Opportunity, Lead, Contact, Case)
│   ├── DataTable.tsx     # Reusable table with 20-record pagination, sorting, search, mobile cards
│   ├── LoadingSkeleton.tsx# Skeletons for table rows and cards
│   ├── EmptyState.tsx    # Zero-data illustration & action triggers
│   ├── ConfirmDialog.tsx # Accessible modal for deletion confirmation
│   ├── RecordModal.tsx   # View record details drawer/modal with clipboard copy
│   ├── RecordFormModal.tsx# Create and Edit record modal with field validation
│   ├── ComingSoonObject.tsx# Architectural schema & Spring Boot DTO/Controller generator
│   ├── BackendStatusBanner.tsx# Connectivity diagnostic banner
│   └── Toast.tsx         # Notification toast system
├── context/
│   ├── ToastContext.tsx  # Global notification dispatch
│   └── ActivityContext.tsx# Real-time CRUD audit log tracker
├── pages/
│   ├── Dashboard.tsx     # Main Salesforce Data Manager screen
│   ├── ActivityPage.tsx  # CRUD event history & audit trail
│   └── SettingsPage.tsx  # API Base URL configuration & backend docs
├── types.ts              # Global TypeScript interfaces and error models
├── App.tsx               # Root application router and layout wrapper
└── main.tsx              # Application entry point
```
