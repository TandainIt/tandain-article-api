import pool from '@/config/db/postgresql';
import { QueryResult } from 'pg';

import { generateOrderByQuery, getInsertValue, joinQuery } from '@/utils/model';
import TandainError from '@/utils/TandainError';
import { WhereArticleOne, InsertArticle, QueryOptions } from './model.types';
import { IArticle } from '../service/service.types';

class ArticleModel {
	static async findMany(
		wheres: Partial<IArticle>,
		options?: QueryOptions
	): Promise<IArticle[]> {
		const {
			limit = null,
			offset = null,
			orderBy = { id: 'desc' },
		} = options || {};
		const whereQuery = joinQuery(wheres);
		const orderByQuery = generateOrderByQuery(orderBy);

		try {
			const query = `SELECT * FROM articles WHERE ${whereQuery} ORDER BY ${orderByQuery} LIMIT ${limit} OFFSET ${offset}`;
			const result: QueryResult<IArticle> = await pool.query(query);

			const article = result.rows;

			return article;
		} catch (err) {
			throw new TandainError(err.message, {
				code: 500,
			});
		}
	}

	static async findOne(wheres: WhereArticleOne): Promise<IArticle | null> {
		try {
			const resArticles = await this.findMany(wheres, { limit: 1 });

			return resArticles[0] || null;
		} catch (err) {
			throw new TandainError(err.message, {
				code: 500,
			});
		}
	}

	static async insertOne(inserts: InsertArticle) {
		const { columns, values } = getInsertValue(inserts);

		try {
			const query = `INSERT INTO articles (${columns}) VALUES(${values}) RETURNING *`;

			const result: QueryResult<IArticle> = await pool.query(query);

			return result.rows[0];
		} catch (err) {
			throw new TandainError(err.message);
		}
	}
}

export default ArticleModel;
