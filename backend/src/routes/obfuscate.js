import express from 'express';
import { Obfuscator } from '../obfuscator/index.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.post('/', authenticate, async (req, res) => {
  try {
    const { script, level = 'medium', options = {} } = req.body;
    
    if (!script || typeof script !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'Invalid script input'
      });
    }

    const obfuscator = new Obfuscator({
      level,
      ...options
    });

    const result = obfuscator.obfuscate(script);
    
    // Log obfuscation (for history)
    if (req.user) {
      // Save to database here
    }

    res.json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

export default router;
