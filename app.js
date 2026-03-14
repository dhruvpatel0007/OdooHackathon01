/* ═══════════════════════════════════════════════════════════════
   CoreInventory — Shared Application Logic (app.js)
   ═══════════════════════════════════════════════════════════════ */

// ── Seed Data ──────────────────────────────────────────────────
const SEED_PRODUCTS = [
  { id: 'P001', name: 'Industrial Drill',   sku: 'DRL-001', category: 'Tools',      unit: 'Units',  stock: 150, warehouse: 'WH-Main',  location: 'Rack A', reorderLevel: 20 },
  { id: 'P002', name: 'Steel Bolts',        sku: 'BLT-992', category: 'Hardware',   unit: 'Box',    stock: 15,  warehouse: 'WH-Main',  location: 'Rack B', reorderLevel: 25 },
  { id: 'P003', name: 'Hydraulic Oil',      sku: 'OIL-023', category: 'Lubricants', unit: 'Liters', stock: 0,   warehouse: 'WH-East',  location: 'Zone C', reorderLevel: 50 },
  { id: 'P004', name: 'Safety Goggles',     sku: 'SFT-441', category: 'PPE',        unit: 'Pairs',  stock: 500, warehouse: 'WH-Main',  location: 'Rack D', reorderLevel: 30 },
  { id: 'P005', name: 'Copper Wire 2.5mm',  sku: 'COP-210', category: 'Electrical', unit: 'Meters', stock: 2400,warehouse: 'WH-North', location: 'Rack A', reorderLevel: 500 },
  { id: 'P006', name: 'Circuit Board Rev 2',sku: 'CB-802',  category: 'Electronics',unit: 'Units',  stock: 78,  warehouse: 'WH-East',  location: 'Rack E', reorderLevel: 20 },
  { id: 'P007', name: 'Steel Enclosure (S)',sku: 'ENC-51',  category: 'Hardware',   unit: 'Units',  stock: 42,  warehouse: 'WH-Main',  location: 'Rack B', reorderLevel: 15 },
  { id: 'P008', name: 'Ultra-Light Frame X1',sku:'UL-293-FRM',category:'Hardware',  unit: 'Units',  stock: 142, warehouse: 'WH-Main',  location: 'Rack A', reorderLevel: 30 },
  { id: 'P009', name: 'Hydraulic Valve S-Type',sku:'HV-VAL-009',category:'Tools',   unit: 'Units',  stock: 12,  warehouse: 'WH-North', location: 'Rack C', reorderLevel: 20 },
  { id: 'P010', name: 'Steel Rods 10mm',    sku: 'STL-100', category: 'Hardware',   unit: 'Kg',     stock: 340, warehouse: 'WH-Main',  location: 'Zone A', reorderLevel: 100 },
];

const SEED_WAREHOUSES = [
  { id: 'WH-Main',  name: 'Main Warehouse',       code: 'WH-Main',  address: '123 Industrial Park, Building A' },
  { id: 'WH-East',  name: 'East Terminal',         code: 'WH-East',  address: '456 Logistics Avenue, Suite 12' },
  { id: 'WH-North', name: 'North Distribution',    code: 'WH-North', address: '789 Commerce Blvd, Unit 5' },
];

const SEED_LOCATIONS = [
  { id: 'L01', warehouse: 'WH-Main',  name: 'Rack A' },
  { id: 'L02', warehouse: 'WH-Main',  name: 'Rack B' },
  { id: 'L03', warehouse: 'WH-Main',  name: 'Rack D' },
  { id: 'L04', warehouse: 'WH-Main',  name: 'Zone A' },
  { id: 'L05', warehouse: 'WH-East',  name: 'Zone C' },
  { id: 'L06', warehouse: 'WH-East',  name: 'Rack E' },
  { id: 'L07', warehouse: 'WH-North', name: 'Rack A' },
  { id: 'L08', warehouse: 'WH-North', name: 'Rack C' },
  { id: 'L09', warehouse: 'WH-Main',  name: 'Production Floor' },
];

const SEED_SUPPLIERS = [
  { id: 'S01', name: 'Global Logistics Inc.' },
  { id: 'S02', name: 'Tech Parts Co.' },
  { id: 'S03', name: 'Apex Manufacturing' },
  { id: 'S04', name: 'Nordic Supply' },
  { id: 'S05', name: 'Pacific Hardware Ltd.' },
];

const SEED_RECEIPTS = [
  { id: 'R001', ref: 'PO-2024-001', supplier: 'Global Logistics Inc.', warehouse: 'WH-Main', status: 'done',    date: '2024-10-24', items: [{ productId: 'P001', ordered: 50, received: 50 }] },
  { id: 'R002', ref: 'PO-2024-042', supplier: 'Tech Parts Co.',        warehouse: 'WH-East', status: 'ready',   date: '2024-10-24', items: [{ productId: 'P006', ordered: 30, received: 0 }] },
  { id: 'R003', ref: 'PO-2024-089', supplier: 'Apex Manufacturing',    warehouse: 'WH-Main', status: 'waiting', date: '2024-10-23', items: [{ productId: 'P010', ordered: 100, received: 0 }] },
  { id: 'R004', ref: 'PO-2024-112', supplier: 'Nordic Supply',         warehouse: 'WH-North',status: 'draft',   date: '2024-10-23', items: [{ productId: 'P005', ordered: 500, received: 0 }] },
];

const SEED_DELIVERIES = [
  { id: 'D001', ref: 'SO-2023-4420', customer: 'Acme Corp',         warehouse: 'WH-Main',  status: 'processing', date: '2024-10-24', items: [{ productId: 'P001', qty: 10 }] },
  { id: 'D002', ref: 'SO-2023-4425', customer: 'BuildRight Inc.',   warehouse: 'WH-North', status: 'done',       date: '2024-10-23', items: [{ productId: 'P004', qty: 50 }] },
  { id: 'D003', ref: 'SO-2023-4430', customer: 'MetalWorks LLC',    warehouse: 'WH-Main',  status: 'draft',      date: '2024-10-22', items: [{ productId: 'P010', qty: 20 }] },
];

const SEED_TRANSFERS = [
  { id: 'T001', from: 'WH-Main / Rack A',  to: 'WH-Main / Production Floor', status: 'done',    date: '2024-10-24', responsible: 'Alex Morgan', items: [{ productId: 'P008', qty: 25 }] },
  { id: 'T002', from: 'WH-East / Zone C',   to: 'WH-Main / Rack B',          status: 'waiting', date: '2024-10-23', responsible: 'Jane Smith',  items: [{ productId: 'P003', qty: 10 }] },
];

const SEED_ADJUSTMENTS = [
  { id: 'A001', ref: 'ADJ-1022', product: 'P010', location: 'WH-Main / Zone A', recorded: 340, counted: 337, status: 'done',  date: '2024-10-23', reason: 'Damaged items' },
  { id: 'A002', ref: 'ADJ-1023', product: 'P002', location: 'WH-Main / Rack B', recorded: 15,  counted: 18,  status: 'draft', date: '2024-10-22', reason: 'Recount correction' },
];

const SEED_HISTORY = [
  { id: 'H001', date: '2024-10-24', type: 'receipt',    ref: 'PO-2024-001', product: 'Industrial Drill',    qty: '+50',  location: 'WH-Main / Rack A',          user: 'Alex Morgan' },
  { id: 'H002', date: '2024-10-24', type: 'transfer',   ref: 'TRF-001',     product: 'Ultra-Light Frame X1',qty: '25',   location: 'Rack A → Production Floor',  user: 'Alex Morgan' },
  { id: 'H003', date: '2024-10-24', type: 'delivery',   ref: 'SO-2023-4420',product: 'Industrial Drill',    qty: '-10',  location: 'WH-Main / Rack A',           user: 'Alex Morgan' },
  { id: 'H004', date: '2024-10-23', type: 'adjustment', ref: 'ADJ-1022',    product: 'Steel Rods 10mm',     qty: '-3',   location: 'WH-Main / Zone A',           user: 'Jane Smith' },
  { id: 'H005', date: '2024-10-23', type: 'receipt',    ref: 'PO-2024-042', product: 'Circuit Board Rev 2', qty: '+30',  location: 'WH-East / Rack E',           user: 'Alex Morgan' },
  { id: 'H006', date: '2024-10-23', type: 'delivery',   ref: 'SO-2023-4425',product: 'Safety Goggles',      qty: '-50',  location: 'WH-North / Rack A',          user: 'Jane Smith' },
  { id: 'H007', date: '2024-10-22', type: 'receipt',    ref: 'PO-2024-055', product: 'Copper Wire 2.5mm',   qty: '+200', location: 'WH-North / Rack A',          user: 'Alex Morgan' },
  { id: 'H008', date: '2024-10-22', type: 'adjustment', ref: 'ADJ-1023',    product: 'Steel Bolts',         qty: '+3',   location: 'WH-Main / Rack B',           user: 'Jane Smith' },
];

// ── Data Store (API + IndexedDB Fallback) ──────────────────────
const API_BASE = 'http://localhost:3000/api';
const USE_API = true; // Set to true to use server API, false for IndexedDB

const Store = {
  db: null,
  dbName: 'CoreInventoryDB',
  dbVersion: 1,

  async openDB() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.dbVersion);
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve(this.db);
      };
      
      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        const stores = ['products', 'warehouses', 'locations', 'suppliers', 'receipts', 'deliveries', 'transfers', 'adjustments', 'history'];
        
        stores.forEach(store => {
          if (!db.objectStoreNames.contains(store)) {
            db.createObjectStore(store, { keyPath: 'id' });
          }
        });
        
        // User store (single record)
        if (!db.objectStoreNames.contains('user')) {
          db.createObjectStore('user', { keyPath: 'id' });
        }
      };
    });
  },
  async apiCall(endpoint, options = {}) {
    try {
      const response = await fetch(`${API_BASE}${endpoint}`, {
        headers: { 'Content-Type': 'application/json' },
        ...options
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return await response.json();
    } catch (error) {
      console.warn('API call failed, falling back to IndexedDB:', error);
      throw error;
    }
  },
  async _initIDB(storeName, seedData) {
    const db = await this.openDB();
    const transaction = db.transaction([storeName], 'readwrite');
    const store = transaction.objectStore(storeName);
    
    // Check if data exists
    const countRequest = store.count();
    countRequest.onsuccess = () => {
      if (countRequest.result === 0) {
        seedData.forEach(item => store.add(item));
      }
    };
    
    return new Promise((resolve, reject) => {
      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error);
    });
  },

  async init() {
    if (USE_API) {
      try {
        // Try to seed API if needed
        await this.apiCall('/seed', { method: 'POST' });
      } catch (error) {
        console.warn('API seeding failed:', error);
      }
    } else {
      // Use IndexedDB
      await this._initIDB('products', SEED_PRODUCTS);
      await this._initIDB('warehouses', SEED_WAREHOUSES);
      await this._initIDB('locations', SEED_LOCATIONS);
      await this._initIDB('suppliers', SEED_SUPPLIERS);
      await this._initIDB('receipts', SEED_RECEIPTS);
      await this._initIDB('deliveries', SEED_DELIVERIES);
      await this._initIDB('transfers', SEED_TRANSFERS);
      await this._initIDB('adjustments', SEED_ADJUSTMENTS);
      await this._initIDB('history', SEED_HISTORY);
      
      const user = await this.getUser();
      if (!user) {
        const db = await this.openDB();
        const transaction = db.transaction(['user'], 'readwrite');
        const store = transaction.objectStore('user');
        store.add({ id: 'current', name: 'Alex Rivera', role: 'Warehouse Admin', email: 'alex@coreinventory.com' });
      }
    }
  },

  async get(storeName) {
    if (USE_API) {
      try {
        return await this.apiCall(`/${storeName}`);
      } catch {
        // Fallback to IndexedDB
        return await this.getIDB(storeName);
      }
    } else {
      return await this.getIDB(storeName);
    }
  },

  async getIDB(storeName) {
    const db = await this.openDB();
    const transaction = db.transaction([storeName], 'readonly');
    const store = transaction.objectStore(storeName);
    const request = store.getAll();
    
    return new Promise((resolve, reject) => {
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  },

  async set(storeName, data) {
    if (USE_API) {
      try {
        // For API, we need to update each item
        for (const item of data) {
          await this.apiCall(`/${storeName}/${item.id}`, {
            method: 'PUT',
            body: JSON.stringify(item)
          });
        }
      } catch {
        // Fallback to IndexedDB
        await this.setIDB(storeName, data);
      }
    } else {
      await this.setIDB(storeName, data);
    }
  },

  async setIDB(storeName, data) {
    const db = await this.openDB();
    const transaction = db.transaction([storeName], 'readwrite');
    const store = transaction.objectStore(storeName);
    
    store.clear();
    data.forEach(item => store.add(item));
    
    return new Promise((resolve, reject) => {
      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error);
    });
  },

  async add(storeName, item) {
    const db = await this.openDB();
    const transaction = db.transaction([storeName], 'readwrite');
    const store = transaction.objectStore(storeName);
    const request = store.add(item);
    
    return new Promise((resolve, reject) => {
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  },

  async update(storeName, item) {
    const db = await this.openDB();
    const transaction = db.transaction([storeName], 'readwrite');
    const store = transaction.objectStore(storeName);
    const request = store.put(item);
    
    return new Promise((resolve, reject) => {
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  },

  async delete(storeName, id) {
    const db = await this.openDB();
    const transaction = db.transaction([storeName], 'readwrite');
    const store = transaction.objectStore(storeName);
    const request = store.delete(id);
    
    return new Promise((resolve, reject) => {
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  },

  async getUser() {
    try {
      const db = await this.openDB();
      const transaction = db.transaction(['user'], 'readonly');
      const store = transaction.objectStore('user');
      const request = store.get('current');
      
      return new Promise((resolve) => {
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => resolve(null);
      });
    } catch {
      return null;
    }
  },

  async setUser(user) {
    const db = await this.openDB();
    const transaction = db.transaction(['user'], 'readwrite');
    const store = transaction.objectStore('user');
    const request = store.put({ id: 'current', ...user });
    
    return new Promise((resolve, reject) => {
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  },

  isLoggedIn() {
    return !!localStorage.getItem('ci_logged_in');
  },

  login() {
    localStorage.setItem('ci_logged_in', 'true');
  },

  logout() {
    localStorage.removeItem('ci_logged_in');
  }
};

// ── Utilities ──────────────────────────────────────────────────
function generateId(prefix) {
  return prefix + '-' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function todayStr() {
  return new Date().toISOString().split('T')[0];
}

function statusBadge(status) {
  const s = status.toLowerCase();
  const labels = {
    done: 'Done', completed: 'Completed', ready: 'Ready', processing: 'Processing',
    waiting: 'Waiting', draft: 'Draft', cancelled: 'Cancelled', picking: 'Picking', packing: 'Packing'
  };
  const label = labels[s] || status;
  return `<span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold badge-${s}">
    <span class="size-1.5 rounded-full" style="background:currentColor;opacity:0.6"></span>${label}
  </span>`;
}

function typeIcon(type) {
  const icons = {
    receipt:    { icon: 'download',    color: 'text-blue-500' },
    delivery:   { icon: 'upload',      color: 'text-amber-500' },
    transfer:   { icon: 'swap_horiz',  color: 'text-indigo-500' },
    adjustment: { icon: 'tune',        color: 'text-purple-500' },
  };
  const t = icons[type] || { icon: 'help', color: 'text-slate-400' };
  return `<span class="material-symbols-outlined ${t.color} text-base">${t.icon}</span>`;
}

function stockStatus(stock, reorderLevel) {
  if (stock === 0) return '<span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"><span class="size-1.5 rounded-full bg-red-500"></span>Out of Stock</span>';
  if (stock <= reorderLevel) return '<span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400"><span class="size-1.5 rounded-full bg-amber-500"></span>Low Stock</span>';
  return '<span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"><span class="size-1.5 rounded-full bg-green-500"></span>In Stock</span>';
}

// ── Toast System ───────────────────────────────────────────────
function showToast(message, type = 'success', duration = 3500) {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    document.body.appendChild(container);
  }
  const icons = { success: 'check_circle', error: 'error', warning: 'warning', info: 'info' };
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `<span class="material-symbols-outlined" style="font-size:20px">${icons[type]||'info'}</span><span>${message}</span>`;
  container.appendChild(toast);
  setTimeout(() => {
    toast.classList.add('toast-exit');
    setTimeout(() => toast.remove(), 300);
  }, duration);
}

// ── Dark Mode ──────────────────────────────────────────────────
function initDarkMode() {
  const saved = localStorage.getItem('ci_dark');
  if (saved === 'true') document.documentElement.classList.add('dark');
}
function toggleDarkMode() {
  document.documentElement.classList.toggle('dark');
  localStorage.setItem('ci_dark', document.documentElement.classList.contains('dark'));
}

// ── Sidebar Active Link ────────────────────────────────────────
function initSidebar() {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.sidebar-nav a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage) {
      link.classList.add('bg-primary', 'text-white');
      link.classList.remove('text-slate-600', 'dark:text-slate-400', 'hover:bg-slate-100', 'dark:hover:bg-slate-800');
    } else {
      link.classList.remove('bg-primary', 'text-white');
      link.classList.add('text-slate-600', 'dark:text-slate-400', 'hover:bg-slate-100', 'dark:hover:bg-slate-800');
    }
  });
}

// ── Mobile Sidebar Toggle ──────────────────────────────────────
function initMobileSidebar() {
  const toggle = document.getElementById('sidebar-toggle');
  const sidebar = document.querySelector('.sidebar');
  const overlay = document.getElementById('sidebar-overlay');
  if (toggle && sidebar) {
    toggle.addEventListener('click', () => {
      sidebar.classList.toggle('open');
      if (overlay) overlay.classList.toggle('open');
    });
    if (overlay) {
      overlay.addEventListener('click', () => {
        sidebar.classList.remove('open');
        overlay.classList.remove('open');
      });
    }
  }
}

// ── Auth Guard ─────────────────────────────────────────────────
function requireAuth() {
  if (!Store.isLoggedIn()) {
    window.location.href = 'login.html';
    return false;
  }
  return true;
}

// ── KPI Calculations ───────────────────────────────────────────
async function getKPIs() {
  const products = await Store.get('products');
  const receipts = await Store.get('receipts');
  const deliveries = await Store.get('deliveries');
  const transfers = await Store.get('transfers');

  return {
    totalProducts: products.length,
    lowStock: products.filter(p => p.stock > 0 && p.stock <= p.reorderLevel).length,
    outOfStock: products.filter(p => p.stock === 0).length,
    pendingReceipts: receipts.filter(r => r.status !== 'done' && r.status !== 'cancelled').length,
    pendingDeliveries: deliveries.filter(d => d.status !== 'done' && d.status !== 'cancelled').length,
    scheduledTransfers: transfers.filter(t => t.status !== 'done').length,
  };
}

// ── Initialization ────────────────────────────────────────────
async function initApp() {
  try {
    await Store.init();
    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Failed to initialize database:', error);
  }
}

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', initApp);

// ── User Sidebar Menu ──────────────────────────────────────────
function initUserSidebar() {
  const userSection = document.querySelector('.sidebar > div:last-child');
  if (!userSection) return;
  const user = Store.getUser();
  if (!user) return;
  const initials = user.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);

  userSection.classList.add('relative');
  userSection.innerHTML = `
    <button onclick="document.getElementById('user-menu-sidebar').classList.toggle('hidden');event.stopPropagation()" class="w-full flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer">
      <div class="size-8 rounded-full bg-primary/20 flex items-center justify-center text-primary dark:text-slate-100 font-bold text-xs">${initials}</div>
      <div class="flex flex-col text-left flex-1">
        <span class="text-xs font-bold">${user.name}</span>
        <span class="text-[10px] text-slate-500">${user.role}</span>
      </div>
      <span class="material-symbols-outlined text-slate-400 text-base">expand_more</span>
    </button>
    <div id="user-menu-sidebar" class="hidden absolute bottom-full left-0 right-0 mb-2 mx-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl overflow-hidden z-50 animate-scale-in">
      <a href="profile.html" class="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-sm font-medium">
        <span class="material-symbols-outlined text-lg text-slate-400">person</span>My Profile
      </a>
      <a href="settings.html" class="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-sm font-medium">
        <span class="material-symbols-outlined text-lg text-slate-400">settings</span>Settings
      </a>
      <div class="border-t border-slate-100 dark:border-slate-800"></div>
      <button onclick="Store.logout(); window.location.href='login.html'" class="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors text-sm font-medium text-red-600">
        <span class="material-symbols-outlined text-lg">logout</span>Sign Out
      </button>
    </div>
  `;
}

// ── Init ───────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', async () => {
  await initApp();
  initDarkMode();
  initSidebar();
  initMobileSidebar();
  initUserSidebar();

  // Close user menu on outside click
  document.addEventListener('click', (e) => {
    const userMenu = document.getElementById('user-menu-sidebar');
    if (userMenu && !e.target.closest('#user-menu-sidebar') && !e.target.closest('.sidebar > div:last-child button')) {
      userMenu.classList.add('hidden');
    }
  });
});
