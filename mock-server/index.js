const express = require('express');
const cors = require('cors');

const app = express();
const port = process.env.MOCK_PORT || process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const testUsers = [
  {
    email: "test.admin@gmail.com",
    password: "123456",
    role: "ADMIN",
    fullName: "admin khan",
    phone: "01833347848",
    address: "address ...",
  },
  {
    email: "test.salesman@gmail.com",
    password: "123456",
    role: "SALESMAN",
    fullName: "salesman khan",
    phone: "01833347848",
    address: "address ...",
  },
  {
    email: "test.manager@gmail.com",
    password: "123456",
    role: "MANAGER",
    fullName: "manager khan",
    phone: "01833347848",
    address: "address ...",
  },
];

app.get('/api', (_req, res) => {
  res.json({ statusCode: 200, success: true, message: 'Pharmacy Engine API (mock) is functional' });
});

app.get('/api/auth/get-role-wise-test-account-credentials-and-token', (_req, res) => {
  const accounts = testUsers.map((u, i) => ({
    email: u.email,
    password: u.password,
    fullName: u.fullName,
    role: u.role,
    phone: u.phone,
    address: u.address,
    token: `mock-token-${i}`,
  }));
  res.status(201).json({ message: 'Mock test accounts', accounts });
});

app.get('/api/drugs', (_req, res) => {
  const data = [
    { id: '1', name: 'Paracetamol', brand: 'Acme', mrp: 10, available: 100, unit: 'tablet' },
    { id: '2', name: 'Ibuprofen', brand: 'HealthCorp', mrp: 20, available: 50, unit: 'tablet' },
  ];
  res.json({ statusCode: 200, success: true, data });
});

app.get('/api/purchases', (_req, res) => {
  res.json({ statusCode: 200, success: true, data: [] });
});

app.get('/api/sales', (_req, res) => {
  res.json({ statusCode: 200, success: true, data: [] });
});

app.get('/api/dashboard/stats', (_req, res) => {
  res.json({ statusCode: 200, success: true, data: { totalSales: 0, totalPurchases: 0, totalDrugs: 2 } });
});

app.use((req, res) => {
  res.status(404).json({ statusCode: 404, success: false, message: 'Mock: Not Found', path: req.originalUrl });
});

app.listen(port, () => {
  console.log(`Mock API server listening on port ${port}`);
});
