const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/coreinventory')
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

// Schemas
const productSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: String,
  sku: String,
  category: String,
  unit: String,
  stock: Number,
  warehouse: String,
  location: String,
  reorderLevel: Number
});

const warehouseSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: String,
  code: String,
  address: String
});

const locationSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  warehouse: String,
  name: String
});

const supplierSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: String
});

const receiptSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  ref: String,
  supplier: String,
  warehouse: String,
  status: String,
  date: String,
  items: Array
});

const deliverySchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  ref: String,
  customer: String,
  warehouse: String,
  status: String,
  date: String,
  items: Array
});

const transferSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  from: String,
  to: String,
  status: String,
  date: String,
  responsible: String,
  items: Array
});

const adjustmentSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  ref: String,
  product: String,
  location: String,
  recorded: Number,
  counted: Number,
  status: String,
  date: String,
  reason: String
});

const historySchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  date: String,
  type: String,
  ref: String,
  product: String,
  qty: String,
  location: String,
  user: String
});

const userSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: String,
  role: String,
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

// Models
const Product = mongoose.model('Product', productSchema);
const Warehouse = mongoose.model('Warehouse', warehouseSchema);
const Location = mongoose.model('Location', locationSchema);
const Supplier = mongoose.model('Supplier', supplierSchema);
const Receipt = mongoose.model('Receipt', receiptSchema);
const Delivery = mongoose.model('Delivery', deliverySchema);
const Transfer = mongoose.model('Transfer', transferSchema);
const Adjustment = mongoose.model('Adjustment', adjustmentSchema);
const History = mongoose.model('History', historySchema);
const User = mongoose.model('User', userSchema);

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Authentication Middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

// Authentication Routes
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ error: 'User with this email already exists' });
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create user
    const userId = 'U' + Date.now().toString(36).slice(-3).toUpperCase();
    const user = new User({
      id: userId,
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      role: role || 'Warehouse Staff'
    });

    await user.save();

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, name: user.name, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Find user
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, name: user.name, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/auth/logout', (req, res) => {
  // For stateless JWT, logout is handled on client side by removing token
  res.json({ message: 'Logged out successfully' });
});

app.get('/api/auth/verify', authenticateToken, (req, res) => {
  res.json({
    user: {
      id: req.user.id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role
    }
  });
});

// Routes
app.get('/api/products', authenticateToken, async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/products', authenticateToken, async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/products/:id', authenticateToken, async (req, res) => {
  try {
    const product = await Product.findOneAndUpdate({ id: req.params.id }, req.body, { new: true });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/products/:id', authenticateToken, async (req, res) => {
  try {
    await Product.findOneAndDelete({ id: req.params.id });
    res.json({ message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Similar routes for other entities
app.get('/api/warehouses', authenticateToken, async (req, res) => {
  try {
    const warehouses = await Warehouse.find();
    res.json(warehouses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/locations', authenticateToken, async (req, res) => {
  try {
    const locations = await Location.find();
    res.json(locations);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/suppliers', authenticateToken, async (req, res) => {
  try {
    const suppliers = await Supplier.find();
    res.json(suppliers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/receipts', authenticateToken, async (req, res) => {
  try {
    const receipts = await Receipt.find();
    res.json(receipts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/deliveries', authenticateToken, async (req, res) => {
  try {
    const deliveries = await Delivery.find();
    res.json(deliveries);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/transfers', authenticateToken, async (req, res) => {
  try {
    const transfers = await Transfer.find();
    res.json(transfers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/adjustments', authenticateToken, async (req, res) => {
  try {
    const adjustments = await Adjustment.find();
    res.json(adjustments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/history', authenticateToken, async (req, res) => {
  try {
    const history = await History.find();
    res.json(history);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/user', authenticateToken, async (req, res) => {
  try {
    const users = await User.find().select('-password'); // Exclude password field
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Warehouse CRUD routes
app.post('/api/warehouses', authenticateToken, async (req, res) => {
  try {
    const warehouse = new Warehouse(req.body);
    await warehouse.save();
    res.json(warehouse);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/warehouses/:id', authenticateToken, async (req, res) => {
  try {
    const warehouse = await Warehouse.findOneAndUpdate({ id: req.params.id }, req.body, { new: true });
    res.json(warehouse);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/warehouses/:id', authenticateToken, async (req, res) => {
  try {
    await Warehouse.findOneAndDelete({ id: req.params.id });
    res.json({ message: 'Warehouse deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Location CRUD routes
app.post('/api/locations', authenticateToken, async (req, res) => {
  try {
    const location = new Location(req.body);
    await location.save();
    res.json(location);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/locations/:id', authenticateToken, async (req, res) => {
  try {
    const location = await Location.findOneAndUpdate({ id: req.params.id }, req.body, { new: true });
    res.json(location);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/locations/:id', authenticateToken, async (req, res) => {
  try {
    await Location.findOneAndDelete({ id: req.params.id });
    res.json({ message: 'Location deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Supplier CRUD routes
app.post('/api/suppliers', authenticateToken, async (req, res) => {
  try {
    const supplier = new Supplier(req.body);
    await supplier.save();
    res.json(supplier);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/suppliers/:id', authenticateToken, async (req, res) => {
  try {
    const supplier = await Supplier.findOneAndUpdate({ id: req.params.id }, req.body, { new: true });
    res.json(supplier);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/suppliers/:id', authenticateToken, async (req, res) => {
  try {
    await Supplier.findOneAndDelete({ id: req.params.id });
    res.json({ message: 'Supplier deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Receipt CRUD routes
app.post('/api/receipts', authenticateToken, async (req, res) => {
  try {
    const receipt = new Receipt(req.body);
    await receipt.save();
    res.json(receipt);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/receipts/:id', authenticateToken, async (req, res) => {
  try {
    const receipt = await Receipt.findOneAndUpdate({ id: req.params.id }, req.body, { new: true });
    res.json(receipt);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/receipts/:id', authenticateToken, async (req, res) => {
  try {
    await Receipt.findOneAndDelete({ id: req.params.id });
    res.json({ message: 'Receipt deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delivery CRUD routes
app.post('/api/deliveries', authenticateToken, async (req, res) => {
  try {
    const delivery = new Delivery(req.body);
    await delivery.save();
    res.json(delivery);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/deliveries/:id', authenticateToken, async (req, res) => {
  try {
    const delivery = await Delivery.findOneAndUpdate({ id: req.params.id }, req.body, { new: true });
    res.json(delivery);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/deliveries/:id', authenticateToken, async (req, res) => {
  try {
    await Delivery.findOneAndDelete({ id: req.params.id });
    res.json({ message: 'Delivery deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Transfer CRUD routes
app.post('/api/transfers', authenticateToken, async (req, res) => {
  try {
    const transfer = new Transfer(req.body);
    await transfer.save();
    res.json(transfer);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/transfers/:id', authenticateToken, async (req, res) => {
  try {
    const transfer = await Transfer.findOneAndUpdate({ id: req.params.id }, req.body, { new: true });
    res.json(transfer);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/transfers/:id', authenticateToken, async (req, res) => {
  try {
    await Transfer.findOneAndDelete({ id: req.params.id });
    res.json({ message: 'Transfer deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Adjustment CRUD routes
app.post('/api/adjustments', authenticateToken, async (req, res) => {
  try {
    const adjustment = new Adjustment(req.body);
    await adjustment.save();
    res.json(adjustment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/adjustments/:id', authenticateToken, async (req, res) => {
  try {
    const adjustment = await Adjustment.findOneAndUpdate({ id: req.params.id }, req.body, { new: true });
    res.json(adjustment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/adjustments/:id', authenticateToken, async (req, res) => {
  try {
    await Adjustment.findOneAndDelete({ id: req.params.id });
    res.json({ message: 'Adjustment deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// History CRUD routes
app.post('/api/history', authenticateToken, async (req, res) => {
  try {
    const history = new History(req.body);
    await history.save();
    res.json(history);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/history/:id', authenticateToken, async (req, res) => {
  try {
    const history = await History.findOneAndUpdate({ id: req.params.id }, req.body, { new: true });
    res.json(history);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/history/:id', authenticateToken, async (req, res) => {
  try {
    await History.findOneAndDelete({ id: req.params.id });
    res.json({ message: 'History entry deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// User CRUD routes
app.post('/api/user', authenticateToken, async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/user/:id', authenticateToken, async (req, res) => {
  try {
    const user = await User.findOneAndUpdate({ id: req.params.id }, req.body, { new: true });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/user/:id', authenticateToken, async (req, res) => {
  try {
    await User.findOneAndDelete({ id: req.params.id });
    res.json({ message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Seed data endpoint
app.post('/api/seed', authenticateToken, async (req, res) => {
  try {
    // Clear existing data
    await Product.deleteMany();
    await Warehouse.deleteMany();
    await Location.deleteMany();
    await Supplier.deleteMany();
    await Receipt.deleteMany();
    await Delivery.deleteMany();
    await Transfer.deleteMany();
    await Adjustment.deleteMany();
    await History.deleteMany();

    // Insert seed data
    await Product.insertMany([
      { id: 'P001', name: 'Industrial Drill', sku: 'DRL-001', category: 'Tools', unit: 'Units', stock: 150, warehouse: 'WH-Main', location: 'Rack A', reorderLevel: 20 },
      { id: 'P002', name: 'Steel Bolts', sku: 'BLT-992', category: 'Hardware', unit: 'Box', stock: 15, warehouse: 'WH-Main', location: 'Rack B', reorderLevel: 25 },
      { id: 'P003', name: 'Hydraulic Oil', sku: 'OIL-023', category: 'Lubricants', unit: 'Liters', stock: 0, warehouse: 'WH-East', location: 'Zone C', reorderLevel: 50 },
      { id: 'P004', name: 'Safety Goggles', sku: 'SFT-441', category: 'PPE', unit: 'Pairs', stock: 500, warehouse: 'WH-Main', location: 'Rack D', reorderLevel: 30 },
      { id: 'P005', name: 'Copper Wire 2.5mm', sku: 'COP-210', category: 'Electrical', unit: 'Meters', stock: 2400, warehouse: 'WH-North', location: 'Rack A', reorderLevel: 500 },
      { id: 'P006', name: 'Circuit Board Rev 2', sku: 'CB-802', category: 'Electronics', unit: 'Units', stock: 78, warehouse: 'WH-East', location: 'Rack E', reorderLevel: 20 },
      { id: 'P007', name: 'Steel Enclosure (S)', sku: 'ENC-51', category: 'Hardware', unit: 'Units', stock: 42, warehouse: 'WH-Main', location: 'Rack B', reorderLevel: 15 },
      { id: 'P008', name: 'Ultra-Light Frame X1', sku: 'UL-293-FRM', category: 'Hardware', unit: 'Units', stock: 142, warehouse: 'WH-Main', location: 'Rack A', reorderLevel: 30 },
      { id: 'P009', name: 'Hydraulic Valve S-Type', sku: 'HV-VAL-009', category: 'Tools', unit: 'Units', stock: 12, warehouse: 'WH-North', location: 'Rack C', reorderLevel: 20 },
      { id: 'P010', name: 'Steel Rods 10mm', sku: 'STL-100', category: 'Hardware', unit: 'Kg', stock: 340, warehouse: 'WH-Main', location: 'Zone A', reorderLevel: 100 },
    ]);

    await Warehouse.insertMany([
      { id: 'WH-Main', name: 'Main Warehouse', code: 'WH-Main', address: '123 Industrial Park, Building A' },
      { id: 'WH-East', name: 'East Terminal', code: 'WH-East', address: '456 Logistics Avenue, Suite 12' },
      { id: 'WH-North', name: 'North Distribution', code: 'WH-North', address: '789 Commerce Blvd, Unit 5' },
    ]);

    await Location.insertMany([
      { id: 'L01', warehouse: 'WH-Main', name: 'Rack A' },
      { id: 'L02', warehouse: 'WH-Main', name: 'Rack B' },
      { id: 'L03', warehouse: 'WH-Main', name: 'Rack D' },
      { id: 'L04', warehouse: 'WH-Main', name: 'Zone A' },
      { id: 'L05', warehouse: 'WH-East', name: 'Zone C' },
      { id: 'L06', warehouse: 'WH-East', name: 'Rack E' },
      { id: 'L07', warehouse: 'WH-North', name: 'Rack A' },
      { id: 'L08', warehouse: 'WH-North', name: 'Rack C' },
      { id: 'L09', warehouse: 'WH-Main', name: 'Production Floor' },
    ]);

    await Supplier.insertMany([
      { id: 'S01', name: 'Global Logistics Inc.' },
      { id: 'S02', name: 'Tech Parts Co.' },
      { id: 'S03', name: 'Apex Manufacturing' },
      { id: 'S04', name: 'Nordic Supply' },
      { id: 'S05', name: 'Pacific Hardware Ltd.' },
    ]);

    await Receipt.insertMany([
      { id: 'R001', ref: 'PO-2024-001', supplier: 'Global Logistics Inc.', warehouse: 'WH-Main', status: 'done', date: '2024-10-24', items: [{ productId: 'P001', ordered: 50, received: 50 }] },
      { id: 'R002', ref: 'PO-2024-042', supplier: 'Tech Parts Co.', warehouse: 'WH-East', status: 'ready', date: '2024-10-24', items: [{ productId: 'P006', ordered: 30, received: 0 }] },
      { id: 'R003', ref: 'PO-2024-089', supplier: 'Apex Manufacturing', warehouse: 'WH-Main', status: 'waiting', date: '2024-10-23', items: [{ productId: 'P010', ordered: 100, received: 0 }] },
      { id: 'R004', ref: 'PO-2024-112', supplier: 'Nordic Supply', warehouse: 'WH-North', status: 'draft', date: '2024-10-23', items: [{ productId: 'P005', ordered: 500, received: 0 }] },
    ]);

    await Delivery.insertMany([
      { id: 'D001', ref: 'SO-2023-4420', customer: 'Acme Corp', warehouse: 'WH-Main', status: 'processing', date: '2024-10-24', items: [{ productId: 'P001', qty: 10 }] },
      { id: 'D002', ref: 'SO-2023-4425', customer: 'BuildRight Inc.', warehouse: 'WH-North', status: 'done', date: '2024-10-23', items: [{ productId: 'P004', qty: 50 }] },
      { id: 'D003', ref: 'SO-2023-4430', customer: 'MetalWorks LLC', warehouse: 'WH-Main', status: 'draft', date: '2024-10-22', items: [{ productId: 'P010', qty: 20 }] },
    ]);

    await Transfer.insertMany([
      { id: 'T001', from: 'WH-Main / Rack A', to: 'WH-Main / Production Floor', status: 'done', date: '2024-10-24', responsible: 'Alex Morgan', items: [{ productId: 'P008', qty: 25 }] },
      { id: 'T002', from: 'WH-East / Zone C', to: 'WH-Main / Rack B', status: 'waiting', date: '2024-10-23', responsible: 'Jane Smith', items: [{ productId: 'P003', qty: 10 }] },
    ]);

    await Adjustment.insertMany([
      { id: 'A001', ref: 'ADJ-1022', product: 'P010', location: 'WH-Main / Zone A', recorded: 340, counted: 337, status: 'done', date: '2024-10-23', reason: 'Damaged items' },
      { id: 'A002', ref: 'ADJ-1023', product: 'P002', location: 'WH-Main / Rack B', recorded: 15, counted: 18, status: 'draft', date: '2024-10-22', reason: 'Recount correction' },
    ]);

    await History.insertMany([
      { id: 'H001', date: '2024-10-24', type: 'receipt', ref: 'PO-2024-001', product: 'Industrial Drill', qty: '+50', location: 'WH-Main / Rack A', user: 'Alex Morgan' },
      { id: 'H002', date: '2024-10-24', type: 'transfer', ref: 'TRF-001', product: 'Ultra-Light Frame X1', qty: '25', location: 'Rack A → Production Floor', user: 'Alex Morgan' },
      { id: 'H003', date: '2024-10-24', type: 'delivery', ref: 'SO-2023-4420', product: 'Industrial Drill', qty: '-10', location: 'WH-Main / Rack A', user: 'Alex Morgan' },
      { id: 'H004', date: '2024-10-23', type: 'adjustment', ref: 'ADJ-1022', product: 'Steel Rods 10mm', qty: '-3', location: 'WH-Main / Zone A', user: 'Jane Smith' },
      { id: 'H005', date: '2024-10-23', type: 'receipt', ref: 'PO-2024-042', product: 'Circuit Board Rev 2', qty: '+30', location: 'WH-East / Rack E', user: 'Alex Morgan' },
      { id: 'H006', date: '2024-10-23', type: 'delivery', ref: 'SO-2023-4425', product: 'Safety Goggles', qty: '-50', location: 'WH-North / Rack A', user: 'Jane Smith' },
      { id: 'H007', date: '2024-10-22', type: 'receipt', ref: 'PO-2024-055', product: 'Copper Wire 2.5mm', qty: '+200', location: 'WH-North / Rack A', user: 'Alex Morgan' },
      { id: 'H008', date: '2024-10-22', type: 'adjustment', ref: 'ADJ-1023', product: 'Steel Bolts', qty: '+3', location: 'WH-Main / Rack B', user: 'Jane Smith' },
    ]);

    res.json({ message: 'Database seeded successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});