import pool from '@/config/db/postgresql';
import { QueryResult } from 'pg';

import { getInsertValue, joinQuery } from '@/utils/model/model';
import TandainError from '@/utils/TandainError';
import Article from '../service';
import { WhereArticleOne, InsertArticle } from './model.types';

class ArticleModel {
	static async findOne(wheres: WhereArticleOne): Promise<Article | null> {
		const whereQuery = joinQuery(wheres);

		try {
			const query = `SELECT * FROM articles WHERE ${whereQuery}`;
			const result: QueryResult<Article> = await pool.query(query);

			const article = result.rows[0] || null;

			return article;
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

			const result: QueryResult<Article> = await pool.query(query);

			return result.rows[0];
		} catch (err) {
			throw new TandainError(err.message);
		}
	}
}

export default ArticleModel;
