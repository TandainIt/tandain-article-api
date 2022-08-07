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
