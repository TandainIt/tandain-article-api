import { ObjectQuery } from './model.types';

export const joinQuery = (obj: ObjectQuery, joinedBy: string = ', ') => {
	return Object.keys(obj)
		.map((key) => {
			const value = obj[key];

			if (value === null) {
				return `${key} IS NULL`;
			}

			return `${key}='${value}'`;
		})
		.join(joinedBy);
};

export const getInsertValue = (obj: ObjectQuery) => {
	const keys = Object.keys(obj);
	const columns = keys.join(', ');
	const values = keys
		.map((key) => {
			const value = obj[key];

			return value ? `'${value}'` : 'null';
		})
		.join(', ');

	return { columns, values };
};

export const generateOrderByQuery = (obj: ObjectQuery) => {
	return Object.keys(obj)
		.map((key) => `${key} ${obj[key].toUpperCase()}`)
		.join(', ');
};
