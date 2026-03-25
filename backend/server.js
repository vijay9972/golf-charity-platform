require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
// Webhook needs raw body, so we conditionally apply express.json
app.use('/api/payment/webhook', express.raw({ type: 'application/json' }));
app.use(express.json());
app.use(cors());

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/score', require('./routes/scoreRoutes'));
app.use('/api/draw', require('./routes/drawRoutes'));
app.use('/api/charity', require('./routes/charityRoutes'));
app.use('/api/payment', require('./routes/paymentRoutes'));

// Error handling middleware
const { errorHandler } = require('./middleware/errorMiddleware');
app.use(errorHandler);

const path = require('path');
if (process.env.NODE_ENV === 'production' || true) {
  app.use(express.static(path.join(__dirname, '../frontend/dist')));
  app.use((req, res, next) => {
    res.sendFile(path.resolve(__dirname, '../frontend/dist', 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
