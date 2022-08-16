import { extract } from 'article-parser';
import { v4 as uuidv4 } from 'uuid';

import ArticleModel from '../model';
import s3 from '@/config/S3';
import TandainError from '@/utils/TandainError';
import { QueryOptions } from '../model/model.types';
import { IArticle } from './service.types';

interface Article extends IArticle {}

class Article {
	constructor(userId: number) {
		this.user_id = userId;
	}

	private static async upload(article: string, userId: number) {
		// NOTE: Upload article to AWS S3

		const date = new Date();
		const year = date.getFullYear();
		const month = date.getMonth() + 1;
		const uuid = uuidv4();

		const filename = `${userId}-${uuid}.html`;
		const path = `content/${year}/${month}/${filename}`;

		try {
			await s3.putObject({
				Bucket: 'tandainbucket',
				Key: path,
				ContentType: 'text/html',
				Body: Buffer.from(article),
			});

			return path;
		} catch (err) {
			throw new TandainError('Failed to store the article', {
				name: err.code,
				code: err.statusCode,
			});
		}
	}

	static async get(articleId: number) {
		try {
			return await ArticleModel.findOne({ id: articleId });
		} catch ({ message, code, name }) {
			throw new TandainError(message, { code, name });
		}
	}

	static async add(contentURL: string, userId: number) {
		try {
			// NOTE: Extract article from given URL
			const {
				content,
				title,
				description,
				image,
				author,
				published,
				source,
				url,
				ttr,
			} = await extract(contentURL);

			if (!content) {
				throw new TandainError('Failed to read the article to be saved', {
					code: 400,
					name: 'FAILED_TO_PARSE',
				});
			}

			const filePath = await this.upload(content, userId);

			// NOTE: Store article information to database
			const insertedArticle = await ArticleModel.insertOne({
				user_id: userId,
				file_path: filePath,
				title,
				description,
				image,
				author,
				published,
				source_name: source,
				source_url: url,
				ttr,
			});

			return insertedArticle;
		} catch (err) {
			throw new TandainError(err.message);
		}
	}

	async getMany(options?: QueryOptions) {
		try {
			return await ArticleModel.findMany({ user_id: this.user_id }, options);
		} catch ({ message, code, name }) {
			throw new TandainError(message, { code, name });
		}
	}
}

export default Article;
