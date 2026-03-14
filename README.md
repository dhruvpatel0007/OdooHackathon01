# CoreInventory

A modern, modular, and enterprise-grade Inventory Management System (IMS) designed to replace manual registers and spreadsheets with a centralized, real-time, and highly intuitive web application. Inspired by industry leaders like Odoo, emphasizing data density, clean typography, and seamless workflows.

## 🚀 Features

### Core Functionality

- **Real-time Inventory Tracking**: Monitor stock levels, movements, and operations in real-time
- **Multi-location Support**: Manage inventory across multiple warehouses and locations
- **Comprehensive Operations**: Handle receipts, deliveries, internal transfers, and stock adjustments
- **Product Management**: Complete CRUD operations for products with categories and variants
- **Reporting & Analytics**: Generate detailed reports on inventory movements and history

### User Experience

- **Responsive Design**: Fully responsive interface for desktops, tablets, and mobile devices
- **Intuitive Navigation**: Collapsible sidebar with clear menu structure
- **Data-rich Tables**: High-density tables with advanced filtering and search
- **Status Indicators**: Color-coded badges for quick status recognition
- **Empty States**: Beautiful empty state designs with clear call-to-actions

### Technical Features

- **Modern Tech Stack**: Built with React 19, Vite, and Tailwind CSS
- **Component Library**: Modular, reusable components following design system principles
- **Performance Optimized**: Fast loading with modern bundling and optimization
- **Accessibility**: WCAG compliant components and interactions

## 🛠️ Tech Stack

- **Frontend Framework**: React 19 with Hooks
- **Build Tool**: Vite
- **Styling**: Tailwind CSS v4
- **Icons**: Lucide React
- **State Management**: React useState/useEffect (expandable to Redux/Zustand)
- **Routing**: React Router (planned for multi-page navigation)
- **Backend**: Node.js with Express (planned)
- **Database**: MongoDB/PostgreSQL (planned)

## 📋 Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Git

## 🚀 Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/dhruvpatel0007/OdooHackathon01.git
   cd OdooHackathon01
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Environment Setup**
   - The project uses MongoDB Atlas. Update `.env` with your connection string if needed
   - Default: `MONGODB_URI=mongodb+srv://jaineelnkansara_db_user:Jaineel@odoohackathon.5qtvlvd.mongodb.net/coreinventory`

4. **Start the backend server**
   ```bash
   npm run dev
   ```

5. **Start the frontend (in a separate terminal)**
   ```bash
   npx vite
   ```

6. **Open your browser**
   - Frontend: `http://localhost:5173/`
   - Backend API: `http://localhost:3000/`

## 📖 Usage

### Navigation

- **Dashboard**: Overview of inventory metrics and recent operations
- **Products**: Manage product catalog, categories, and stock levels
- **Operations**: Handle receipts, deliveries, transfers, and adjustments
- **Reports**: View inventory movement history and generate reports
- **Settings**: Configure warehouses, users, and system preferences

### Key Workflows

1. **Receiving Goods**: Navigate to Operations → Receipts to process incoming inventory
2. **Shipping Orders**: Use Operations → Deliveries for outgoing shipments
3. **Stock Transfers**: Internal transfers between locations via Operations → Transfers
4. **Inventory Adjustments**: Correct stock discrepancies through Operations → Adjustments

## 🏗️ Project Structure

```
CoreInventory/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── Sidebar.jsx      # Navigation sidebar
│   │   ├── Header.jsx       # Top navigation bar
│   │   ├── Dashboard.jsx    # Main dashboard view
│   │   └── ...
│   ├── App.jsx              # Main application component
│   ├── main.jsx             # Application entry point
│   └── index.css            # Global styles and Tailwind imports
├── public/                  # Static assets
├── package.json             # Dependencies and scripts
├── vite.config.js           # Vite configuration
├── tailwind.config.js       # Tailwind CSS configuration
├── postcss.config.cjs       # PostCSS configuration
└── README.md               # Project documentation
```

## 🎨 Design System

### Color Palette

- **Primary**: Indigo (#6366f1)
- **Success**: Green (#10b981)
- **Warning**: Amber (#f59e0b)
- **Danger**: Red (#ef4444)
- **Background**: Gray-50 (#f9fafb)
- **Surface**: White (#ffffff)

### Typography

- **Font Family**: Inter/Roboto (system fonts)
- **Text Sizes**: Responsive scaling from xs to 4xl
- **Line Heights**: Optimized for readability

### Components

- **Buttons**: Primary, secondary, and ghost variants
- **Inputs**: Text, select, and custom form controls
- **Tables**: Data-dense with sorting and filtering
- **Cards**: KPI cards and content containers
- **Badges**: Status indicators with semantic colors

## 🔧 Development

### Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

### Code Quality

- **ESLint**: Configured for React and modern JavaScript
- **Prettier**: Code formatting (recommended extension)
- **Modular Architecture**: Separation of concerns between UI and business logic

### Contributing Guidelines

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📊 Current Implementation Status

### ✅ Completed

- [x] Project setup with Vite and React
- [x] Tailwind CSS configuration and styling
- [x] Responsive layout with sidebar and header
- [x] Dashboard with KPI cards
- [x] Recent operations table
- [x] Status badge components
- [x] Backend API with Express and MongoDB
- [x] Authentication system (JWT-based)
- [x] Warehouse CRUD operations (API ready)
- [x] Product CRUD operations (API ready)
- [x] Complete API routes for all entities

### 🚧 In Progress

- [ ] Database connectivity (MongoDB Atlas IP whitelisting required)
- [ ] Frontend-backend integration
- [ ] Authentication UI components
- [ ] Product management interface
- [ ] Operations workflows UI

### 📋 Planned

- [ ] Advanced filtering and search
- [ ] Barcode scanning integration
- [ ] Real-time notifications
- [ ] Multi-warehouse support
- [ ] Reporting dashboard
- [ ] User role management

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

### Development Setup

1. Follow the installation steps above
2. Ensure you have Node.js v18+
3. Use the provided ESLint configuration
4. Write tests for new features
5. Follow the existing code style

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Inspired by Odoo ERP's inventory management
- Built with modern web technologies
- Designed for enterprise inventory workflows

## 📞 Support

For questions or support, please open an issue on GitHub or contact the development team.

---

**CoreInventory** - Transforming inventory management with modern web technology.</content>
<parameter name="filePath">c:\Users\Admin\OneDrive\Desktop\ODOOHackathon\README.md
