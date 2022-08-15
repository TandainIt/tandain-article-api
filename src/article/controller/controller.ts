import { Router } from 'express';

import Article from '../service';
import authenticate from '@/middleware/authenticate';
import TandainError from '@/utils/TandainError';

const router = Router();

router.get('/article/:id', authenticate, async (req, res) => {
	const articleId = +req.params.id;

	try {
		const article = await Article.get(articleId);

		if (!article) {
			throw new TandainError('Article is not found', {
				code: 404,
				name: 'ARTICLE_NOT_FOUND',
			});
		}

		res.send(article);
	} catch (err) {
		res.status(err.code).json({ ...err, message: err.message });
	}
});

router.post('/article', authenticate, async (req, res) => {
	const { url } = req.body;

	try {
		const result = await Article.add(url, req.user.id);

		res.send(result);
	} catch (err) {
		res.status(err.code).json({ ...err, message: err.message });
	}
});

export default router;
