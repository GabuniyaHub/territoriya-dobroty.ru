exports.track = async (req, res) => {
  try {
    const { event, label, value } = req.body || {};
    // Minimal implementation: log to server. Can be extended to save to DB.
    console.log('Analytics event:', { event, label, value, user: req.user?.email || null });
    res.status(201).json({ ok: true });
  } catch (err) {
    console.error('Analytics track error', err);
    res.status(500).json({ error: 'Server error' });
  }
};
