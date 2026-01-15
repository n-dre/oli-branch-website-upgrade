const express = require('express');
const router = express.Router();

// Middleware to verify admin access
const verifyAdmin = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token || token !== process.env.ADMIN_TOKEN) {
    return res.status(403).json({ error: 'Access denied' });
  }
  next();
};

// Get all AI agents status
router.get('/agents', verifyAdmin, async (req, res) => {
  try {
    const agents = [
      {
        id: 'welcome_agent_v1',
        name: 'Welcome Agent',
        type: 'onboarding',
        status: 'running',
        version: '2.0.0',
        uptime: '7d 14h',
        metrics: {
          eventsProcessed: 12458,
          successRate: 99.8,
          avgResponseTime: 320,
          errors: 24
        }
      },
      // ... more agents
    ];
    
    res.json({ agents });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get agent metrics
router.get('/agents/:id/metrics', verifyAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { period = '24h' } = req.query;
    
    // Mock metrics data
    const metrics = {
      id,
      period,
      data: {
        events: Array.from({ length: 24 }, (_, i) => ({
          hour: i,
          count: Math.floor(Math.random() * 1000) + 500
        })),
        responseTimes: Array.from({ length: 24 }, (_, i) => ({
          hour: i,
          avgTime: Math.random() * 1000 + 200
        })),
        errors: Array.from({ length: 24 }, (_, i) => ({
          hour: i,
          count: Math.floor(Math.random() * 10)
        }))
      }
    };
    
    res.json(metrics);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get event logs
router.get('/events', verifyAdmin, async (req, res) => {
  try {
    const { page = 1, limit = 50, agentId, eventType } = req.query;
    
    // Mock events data
    const events = Array.from({ length: limit }, (_, i) => ({
      id: `evt_${Date.now()}_${i}`,
      agentId: agentId || ['welcome_agent_v1', 'support_agent_v1', 'report_delivery_agent_v1'][Math.floor(Math.random() * 3)],
      eventType: eventType || ['user.created', 'email.received', 'report.ready'][Math.floor(Math.random() * 3)],
      timestamp: new Date(Date.now() - Math.random() * 86400000).toISOString(),
      status: ['processed', 'processing', 'failed'][Math.floor(Math.random() * 3)],
      details: `Event processed successfully with ID ${Math.random().toString(36).substr(2, 9)}`
    }));
    
    res.json({
      events,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: 1000,
        pages: 20
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get alerts
router.get('/alerts', verifyAdmin, async (req, res) => {
  try {
    const alerts = [
      {
        id: 'alert_001',
        agentId: 'welcome_agent_v1',
        severity: 'critical',
        message: 'Email template not found',
        timestamp: new Date().toISOString(),
        status: 'active'
      },
      // ... more alerts
    ];
    
    res.json({ alerts });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update agent status
router.patch('/agents/:id/status', verifyAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    if (!['running', 'paused', 'stopped'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }
    
    // Update agent status in database
    // await AgentModel.updateOne({ id }, { status });
    
    res.json({
      success: true,
      message: `Agent ${id} status updated to ${status}`,
      agent: { id, status }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Restart agent
router.post('/agents/:id/restart', verifyAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    
    // Restart agent logic
    // await restartAgent(id);
    
    res.json({
      success: true,
      message: `Agent ${id} restart initiated`,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Acknowledge alert
router.patch('/alerts/:id/acknowledge', verifyAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    
    // Update alert status
    // await AlertModel.updateOne({ id }, { acknowledged: true });
    
    res.json({
      success: true,
      message: `Alert ${id} acknowledged`,
      alert: { id, acknowledged: true }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;