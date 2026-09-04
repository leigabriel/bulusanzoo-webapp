const express = require('express');
const path = require('path');
const authRoutes = require('./routes/auth-routes');
const googleAuthRoutes = require('./routes/google-auth-routes');
const predictionRoutes = require('./routes/prediction-routes');
const adminRoutes = require('./routes/admin-routes');
const staffRoutes = require('./routes/staff-routes');
const userRoutes = require('./routes/user-routes');
const aiRoutes = require('./routes/ai-routes');
const messageRoutes = require('./routes/message-routes');
const plantRoutes = require('./routes/plant-routes');
const reservationRoutes = require('./routes/reservation-routes');
const uploadRoutes = require('./routes/upload-routes');
const communityRoutes = require('./routes/community-routes');
const paymentRoutes = require('./routes/payment-routes');
const paymentController = require('./controllers/payment-controller');
const analyticsRoutes = require('./routes/analytics-routes');
const { decodeRequestIdentifiers } = require('./middleware/public-identifiers');

const app = express();
app.set('trust proxy', 1);

app.post('/api/payments/paymongo/webhook', express.raw({ type: 'application/json' }), paymentController.handleWebhook);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(decodeRequestIdentifiers);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/api/auth', authRoutes);
app.use('/auth', googleAuthRoutes);
app.use('/api/predictions', predictionRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/staff', staffRoutes);
app.use('/api/users', userRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/plants', plantRoutes);
app.use('/api/reservations', reservationRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/community', communityRoutes);
app.use('/api/analytics', analyticsRoutes);
app.get('/api/health', async (req, res) => {
  const health = { success: true, message: 'Zoo Bulusan API is running', timestamp: new Date().toISOString(), environment: process.env.NODE_ENV || 'development', uptime: process.uptime() };
  if (req.query.full === 'true') {
    try { await require('./config/database').query('SELECT 1'); health.database = 'connected'; }
    catch { health.database = 'disconnected'; health.success = false; }
  }
  res.status(health.success ? 200 : 503).json(health);
});
app.use((req, res) => res.status(404).json({ success: false, message: 'Route not found' }));
app.use((err, req, res, next) => {
  console.error('Server error');
  res.status(err.status || 500).json({ success: false, message: err.message || 'Internal server error', ...(process.env.NODE_ENV === 'development' && { stack: err.stack }) });
});

module.exports = app;
