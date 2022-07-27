import pool from '@/config/db/posgresql';

import { getInsertValue } from '@/utils/model/model';
import TandainError from '@/utils/TandainError';
import { QueryResult } from 'pg';

import Article from '../service';

interface InsertArticle
	extends Omit<Partial<Article>, 'id' | 'userId' | 'filePath' | 'sourceURL' | 'sourceName'> {
	user_id: number;
  file_path: string | null;
  source_url?: string | null;
  source_name?: string | null;
}

class ArticleModel {
	static async insertOne(inserts: InsertArticle) {

		const { columns, values } = getInsertValue(inserts);

		try {
			const query = `INSERT INTO articles (${columns}) VALUES(${values}) RETURNING *`;

			const result: QueryResult<InsertArticle> = await pool.query(query);

			return result.rows[0];
		} catch (err) {
			throw new TandainError(err.message);
		}
	}
}

export default ArticleModel;
