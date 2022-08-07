import { Router } from 'express';

import Article from '../service'
import authenticate from '@/middleware/authenticate';

const router = Router();

router.post('/article', authenticate, async (req, res) => {
  const { url } = req.body

  try {
    const result = await Article.add(url, req.user.id)

    res.send(result)
  } catch(err) {
    res.status(err.code).json({ ...err, message: err.message });
  }
  
});

export default router;
