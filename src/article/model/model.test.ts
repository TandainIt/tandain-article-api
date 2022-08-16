import TandainError from '@/utils/TandainError';
import { Pool } from 'pg';
import ArticleModel from './model';

jest.mock('pg', () => {
	const mPool = {
		query: jest.fn(),
		end: jest.fn(),
		on: jest.fn(),
	};
	return { Pool: jest.fn(() => mPool) };
});

describe('article/model', () => {
	let pool: any; // TODO: Change type to be more specific

	beforeEach(async () => {
		pool = new Pool();
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	describe('findMany', () => {
		it('should return all items of article', async () => {
			const mockRows = {
				rows: [
					{
						id: 1,
						user_id: 1,
						source_url: 'https://reactjs.org/',
						source_name: 'reactjs.org',
						title: 'React – A JavaScript library for building user interfaces',
						description: 'A JavaScript library for building user interfaces',
						image: 'https://reactjs.org/logo-og.png',
						author: null,
						published: null,
						ttr: 67,
						created_at: null,
						updated_at: null,
						file_path:
							'content/2022/8/1-dfbd4fdb-00f6-48bc-8cb3-ff168799f07d.html',
					},
					{
						id: 2,
						user_id: 1,
						source_url: 'https://reactjs.org/',
						source_name: 'reactjs.org',
						title: 'React – A JavaScript library for building user interfaces',
						description: 'A JavaScript library for building user interfaces',
						image: 'https://reactjs.org/logo-og.png',
						author: null,
						published: null,
						ttr: 67,
						created_at: null,
						updated_at: null,
						file_path:
							'content/2022/8/1-dfbd4fdb-00f6-48bc-8cb3-ff168799f07d.html',
					},
					{
						id: 3,
						user_id: 1,
						source_url: 'https://reactjs.org/',
						source_name: 'reactjs.org',
						title: 'React – A JavaScript library for building user interfaces',
						description: 'A JavaScript library for building user interfaces',
						image: 'https://reactjs.org/logo-og.png',
						author: null,
						published: null,
						ttr: 67,
						created_at: null,
						updated_at: null,
						file_path:
							'content/2022/8/1-dfbd4fdb-00f6-48bc-8cb3-ff168799f07d.html',
					},
				],
			};

			pool.query.mockResolvedValue(mockRows);

			const articles = await ArticleModel.findMany({ user_id: 1 });

			expect(articles).toEqual(mockRows.rows);
		});

		it('should return items of article based on limit option', async () => {
			const mockRows = {
				rows: [
					{
						id: 1,
						user_id: 1,
						source_url: 'https://reactjs.org/',
						source_name: 'reactjs.org',
						title: 'React – A JavaScript library for building user interfaces',
						description: 'A JavaScript library for building user interfaces',
						image: 'https://reactjs.org/logo-og.png',
						author: null,
						published: null,
						ttr: 67,
						created_at: null,
						updated_at: null,
						file_path:
							'content/2022/8/1-dfbd4fdb-00f6-48bc-8cb3-ff168799f07d.html',
					},
					{
						id: 2,
						user_id: 1,
						source_url: 'https://reactjs.org/',
						source_name: 'reactjs.org',
						title: 'React – A JavaScript library for building user interfaces',
						description: 'A JavaScript library for building user interfaces',
						image: 'https://reactjs.org/logo-og.png',
						author: null,
						published: null,
						ttr: 67,
						created_at: null,
						updated_at: null,
						file_path:
							'content/2022/8/1-dfbd4fdb-00f6-48bc-8cb3-ff168799f07d.html',
					},
				],
			};

			pool.query.mockResolvedValue(mockRows);

			const articles = await ArticleModel.findMany(
				{ user_id: 1 },
				{
					limit: 2,
				}
			);

			expect(articles).toEqual(mockRows.rows);
		});

		it('should return items of article based on offset option', async () => {
			const mockRows = {
				rows: [
					{
						id: 2,
						user_id: 1,
						source_url: 'https://reactjs.org/',
						source_name: 'reactjs.org',
						title: 'React – A JavaScript library for building user interfaces',
						description: 'A JavaScript library for building user interfaces',
						image: 'https://reactjs.org/logo-og.png',
						author: null,
						published: null,
						ttr: 67,
						created_at: null,
						updated_at: null,
						file_path:
							'content/2022/8/1-dfbd4fdb-00f6-48bc-8cb3-ff168799f07d.html',
					},
					{
						id: 3,
						user_id: 1,
						source_url: 'https://reactjs.org/',
						source_name: 'reactjs.org',
						title: 'React – A JavaScript library for building user interfaces',
						description: 'A JavaScript library for building user interfaces',
						image: 'https://reactjs.org/logo-og.png',
						author: null,
						published: null,
						ttr: 67,
						created_at: null,
						updated_at: null,
						file_path:
							'content/2022/8/1-dfbd4fdb-00f6-48bc-8cb3-ff168799f07d.html',
					},
				],
			};

			pool.query.mockResolvedValue(mockRows);

			const articles = await ArticleModel.findMany(
				{ user_id: 1 },
				{
					offset: 1,
				}
			);

			expect(articles).toEqual(mockRows.rows);
		});

		it('should return empty array if article is not exists', async () => {
			const mockRows = {
				rows: [],
			};

			pool.query.mockResolvedValue(mockRows);

			const articles = await ArticleModel.findMany({ user_id: 1 });

			expect(articles).toEqual([]);
		});

		it('should throw an error if something went wrong', async () => {
			const posgresqlError = {
				name: 'system_error',
				code: '58000',
				message: 'Failed to retrieve memory usage at process exit',
			};

			pool.query.mockRejectedValue(posgresqlError);

			await expect(ArticleModel.findMany({ user_id: 1 })).rejects.toThrowError(
				new TandainError('Failed to retrieve memory usage at process exit')
			);
		});
	});

	describe('findOne', () => {
		it('should return article by id', async () => {
			const mockArticleId = 49;
			const mockRows = {
				rows: [
					{
						id: mockArticleId,
						user_id: 1,
						source_url: 'https://reactjs.org/',
						source_name: 'reactjs.org',
						title: 'React – A JavaScript library for building user interfaces',
						description: 'A JavaScript library for building user interfaces',
						image: 'https://reactjs.org/logo-og.png',
						author: null,
						published: null,
						ttr: 67,
						created_at: null,
						updated_at: null,
						file_path:
							'content/2022/8/1-dfbd4fdb-00f6-48bc-8cb3-ff168799f07d.html',
					},
				],
			};

			pool.query.mockResolvedValue(mockRows);

			const article = await ArticleModel.findOne({ id: mockArticleId });

			expect(article).toEqual(mockRows.rows[0]);
		});

		it('should return null if article is not exists', async () => {
			const mockArticleId = 49;
			const mockRows = {
				rows: [],
			};

			pool.query.mockResolvedValue(mockRows);

			const article = await ArticleModel.findOne({ id: mockArticleId });

			expect(article).toEqual(null);
		});

		it('should throw an error if something went wrong', async () => {
			const posgresqlError = {
				name: 'system_error',
				code: '58000',
				message: 'Failed to retrieve memory usage at process exit',
			};

			pool.query.mockRejectedValue(posgresqlError);

			await expect(ArticleModel.findOne({ id: 49 })).rejects.toThrowError(
				new TandainError('Failed to retrieve memory usage at process exit')
			);
		});
	});

	describe('insertOne', () => {
		it('should success store the article', async () => {
			const queries = {
				user_id: 1,
				file_path: '/file-path',
				title: 'Title Description',
				description: 'description example',
				image: 'https://www.image-example.com',
				author: 'Test',
				published: new Date().toISOString(),
				source_name: 'Source Example',
				source_url: 'https://www.article-example.com',
				ttr: 120,
			};

			const mockRows = {
				rows: [queries],
			};

			pool.query.mockResolvedValueOnce(mockRows);

			const result = await ArticleModel.insertOne(queries);

			expect(result).toEqual(queries);
		});

		it('should throw an error when posgresql went wrong', async () => {
			const posgresqlError = {
				name: 'system_error',
				code: '58000',
				message: 'Failed to retrieve memory usage at process exit',
			};

			const queries = {
				user_id: 1,
				file_path: '/file-path',
				title: 'Title Description',
				description: 'description example',
				image: 'https://www.image-example.com',
				author: 'Test',
				published: new Date().toISOString(),
				source_name: 'Source Example',
				source_url: 'https://www.article-example.com',
				ttr: 120,
			};

			pool.query.mockRejectedValue(posgresqlError);

			await expect(ArticleModel.insertOne(queries)).rejects.toThrowError(
				new TandainError('Failed to retrieve memory usage at process exit')
			);
		});
	});
});
