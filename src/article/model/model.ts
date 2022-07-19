import pool from '@/config/posgresql';

import { getColumns } from '@/utils/model/model';
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

		const { columns, values } = getColumns(inserts);

		try {
			const query = `INSERT INTO articles (${columns}) VALUES(${values}) RETURNING *`;

			const result: QueryResult<InsertArticle> = await pool.query(query);

			return result.rows[0];
		} catch (err) {
			console.log('Err: ', err);
		}
	}
}

export default ArticleModel;
