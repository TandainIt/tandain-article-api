import { Router } from 'express';

import Article from '../service'

const router = Router();

router.post('/article', async (req, res) => {
  const { url } = req.body

  const userId = 1; // TODO: Get userId from authentication

  try {
    const result = await Article.extract(url, userId)

    res.send(result)
  } catch(err) {
    res.status(err.code).json({ ...err, message: err.message });
  }
  
});

export default router;
