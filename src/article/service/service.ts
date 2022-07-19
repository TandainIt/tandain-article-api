import { ArticleData, extract } from 'article-parser';
import { v4 as uuidv4 } from 'uuid';

import ArticleModel from '../model';
import s3 from '@/config/S3';
import TandainError from '@/utils/TandainError';

interface ConstructorArgs extends ArticleData {
	id: number;
	userId: number;
}

class Article {
	public id: number;
	public userId: number;
	public filePath: string;
	public title: string | null; // NOTE: Not added yet to ERD
	public description: string | null;
	public image: string | null;
	public author: string | null;
	public published: string | null; // NOTE: Published ISO date
	public sourceName: string | null;
	public sourceURL: string | null;
	public ttr: number | null;

	private static async upload(article: string, userId: number) {
		// NOTE: Upload article to AWS S3

		const date = new Date();
		const year = date.getFullYear();
		const month = date.getMonth() + 1;
		const uuid = uuidv4();

		const filename = `${userId}-${uuid}.html`;
		const path = `content/${year}/${month}/${filename}`;

		try {
			await s3
				.putObject({
					Bucket: 'tandainbucket',
					Key: path,
					ContentType: 'text/html',
					Body: Buffer.from(article),
				})
				.promise();

			return path;
		} catch (err) {
			throw new TandainError('Failed to store the article');
		}
	}

	static async extract(contentURL: string, userId: number) {
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
				throw new TandainError('Failed to read the article to be saved');
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
}

export default Article;
