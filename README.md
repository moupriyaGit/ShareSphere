# ShareSphere 🌍

> **"Give what you can. Reach who needs it."**

ShareSphere is a modern social-impact donation platform that connects people who want to donate useful items with NGOs and community organizations that currently need those items.

---

## 🌟 Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router, React 19 / Server & Client Components)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Database**: [MongoDB](https://www.mongodb.com/) with [Mongoose](https://mongoosejs.com/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) with modern custom color palette (Forest Green, Emerald, Warm Cream, Amber/Urgent Red)
- **Icons**: [Lucide React](https://lucide.dev/)

---

## 📁 Project Structure

```text
sharesphere/
│
├── app/
│   ├── page.tsx                    # Modern Homepage (Hero, Steps, Stats, Urgent Needs)
│   ├── layout.tsx                  # Root layout with Navbar and Footer
│   ├── globals.css                 # Global Tailwind styles and themes
│   │
│   ├── explore/
│   │   └── page.tsx                # Explore NGO needs with search & category filters
│   │
│   ├── donate/
│   │   └── page.tsx                # Item donation submission form
│   │
│   ├── login/
│   │   └── page.tsx                # User & NGO sign in
│   │
│   ├── register/
│   │   └── page.tsx                # Account registration (Donor / NGO)
│   │
│   ├── donor/
│   │   └── dashboard/
│   │       └── page.tsx            # Donor personal impact & donation tracker
│   │
│   ├── ngo/
│   │   └── dashboard/
│   │       └── page.tsx            # NGO requirement management & fulfillment tracker
│   │
│   └── api/
│       ├── donations/
│       │   └── route.ts            # GET all donations, POST new donation
│       │
│       ├── requirements/
│       │   └── route.ts            # GET all requirements, POST new requirement
│       │
│       ├── users/
│       │   ├── route.ts            # GET users, POST register user
│       │   └── login/
│       │       └── route.ts        # POST user authentication
│       │
│       └── seed/
│           └── route.ts            # Optional GET to seed initial sample data
│
├── components/
│   ├── Navbar.tsx                  # Responsive navigation bar with auth awareness
│   ├── Footer.tsx                  # Footer with social impact mission and links
│   ├── DonationCard.tsx            # Card component for listed donations
│   ├── RequirementCard.tsx         # Card with progress bar, urgency badge & modal
│   ├── StatsCard.tsx               # Reusable metrics & impact stat cards
│   ├── Button.tsx                  # Reusable accessible button with loading states
│   └── FormInput.tsx               # Reusable stylized form input with helper text
│
├── models/
│   ├── User.ts                     # Mongoose User schema (donor / ngo)
│   ├── Donation.ts                 # Mongoose Donation schema (categories & statuses)
│   └── Requirement.ts              # Mongoose Requirement schema (urgency & fulfillment)
│
├── lib/
│   └── mongodb.ts                  # Cached singleton MongoDB Mongoose connection
│
├── types/
│   └── index.ts                    # Shared TypeScript interfaces & types
│
├── .env.local.example              # Template environment configuration
├── package.json
└── README.md
```

---

## 🚀 Getting Started

### 1. Prerequisites

- **Node.js**: v18.17+ or v20+ / v22+
- **MongoDB**: Local MongoDB instance or free cloud database on [MongoDB Atlas](https://www.mongodb.com/atlas)

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env.local` file in the project root by copying `.env.local.example`:

```bash
cp .env.local.example .env.local
```

Open `.env.local` and add your MongoDB connection string:

```env
MONGODB_URI=mongodb://localhost:27017/sharesphere
# Or MongoDB Atlas:
# MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/sharesphere?retryWrites=true&w=majority
```

> **Note**: `.env.local` is already in `.gitignore` to prevent leaking credentials.

### 4. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🌐 Available Routes

| Route | Method | Description |
|---|---|---|
| `/` | `GET` | Homepage featuring the mission, how it works, impact counters, and urgent demands. |
| `/explore` | `GET` | Search and filter active NGO requirements by category & urgency. |
| `/donate` | `GET` | Donation submission form with instant database persistence. |
| `/donor/dashboard` | `GET` | Dashboard displaying total donations, active listings, and items shared. |
| `/ngo/dashboard` | `GET` | Dashboard displaying active needs, fulfillment percentages, and form to create new requirements. |
| `/register` | `GET` | Register account as either **Donor** or **NGO**. |
| `/login` | `GET` | Sign in to access customized donor or NGO views. |
| `/api/donations` | `GET`, `POST` | Retrieve all donations or submit a new donation. |
| `/api/requirements` | `GET`, `POST` | Retrieve all requirements or publish a new requirement. |
| `/api/users` | `GET`, `POST` | Fetch registered users or create a new user. |
| `/api/users/login` | `POST` | Verify user login credentials. |
| `/api/seed` | `GET` | Seeds sample NGOs, requirements, and donations into MongoDB. |

---

## 📦 Data Models & Workflow

### Donation Statuses Supported
- `Listed` *(Default in v1)*
- `Matched`
- `Accepted`
- `Picked Up`
- `Delivered`
- `Received`

### Requirement Urgency Levels
- `Low`
- `Medium`
- `High`
- `Critical`

### Item Categories
- `Food`
- `Clothes`
- `Books`
- `Stationery`
- `Blankets`
- `Essentials`
- `Other`

### Smart Matching Foundation
The schema and models are structured with item names, categories, quantities, locations, and timestamps to seamlessly plug into a future matching engine:
$$\text{Donation} \longrightarrow \text{Matching Engine (Category, Location, Urgency, Quantity)} \longrightarrow \text{Requirement}$$

---

## 🛠️ Testing & Verification

1. **Verify MongoDB Connection**: Start the dev server and visit `/api/seed` to populate sample data.
2. **Submit a Donation**: Navigate to `/donate`, fill out the form, and submit. You will see the success toast and can view it under `/donor/dashboard`.
3. **Publish an NGO Need**: Navigate to `/ngo/dashboard`, click **Create New Requirement**, submit the form, and view it live under `/explore`.
4. **Register / Login**: Create a Donor or NGO account at `/register`. Upon login, the responsive Navbar and dashboard automatically reflect the role.

