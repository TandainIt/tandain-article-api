import { NextFunction, Request, Response } from 'express';

export const validateObj = (values: { [key: string]: any }, keys: string[]) => {
	if (keys.length === 0) {
		return true;
	}

	const options = Array.from(new Set(keys)); // NOTE: Make sure body option items are unique
	const requests = new Set(Object.keys(values));

	const notExistKeys = options.filter((key) => !requests.has(key));

	if (notExistKeys.length === 0) {
		return true;
	}

	return notExistKeys;
};

export const validateQuery = (keys: string[]) => {
	return (req: Request, res: Response, next: NextFunction) => {
		const validatedQuery = validateObj(req.query, keys);

		if (Array.isArray(validatedQuery)) {
			const notExistQueryStr = validatedQuery.join(', ');

			const message = `Required parameter '${notExistQueryStr}' ${
				validatedQuery.length > 1 ? 'are' : 'is'
			} required`;

			return res.status(400).send({
				code: 400,
				name: 'Bad Request',
				message,
			});
		}

		return next();
	};
};
