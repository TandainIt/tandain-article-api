import { app, server } from '@/app';
import request from 'supertest';

import Article from '../service';
import mockParsedArticle from '../../../__mock__/article.mock';
import { IArticle } from '../service/service.types';

jest.mock('@/middleware/authenticate', () =>
	jest.fn((req, _2, next) => {
		req.user = {
			id: 1,
			name: 'test',
			email: 'test@test.com',
		};

		next();
	})
);

jest.mock('../service');

const articleAddMock = jest.spyOn(Article, 'add');
const mockArticleGet = jest.spyOn(Article, 'get');

const BASE_URL = '/api/v1';

describe('article/controller', () => {
	const mockFilePath = 'content/2022/07/filename';
	const mockArticle = {
		id: 1,
		user_id: 1,
		source_url: mockParsedArticle.url,
		source_name: mockParsedArticle.source,
		title: mockParsedArticle.title,
		description: mockParsedArticle.description,
		image: mockParsedArticle.image,
		author: mockParsedArticle.author,
		published: mockParsedArticle.published,
		ttr: mockParsedArticle.ttr,
		created_at: new Date().toISOString(),
		updated_at: new Date().toISOString(),
		file_path: mockFilePath,
	};

	let mockArticleClass: any;

	beforeEach(() => {
		// NOTE: Clear all instances and calls to constructor and all methods:
		mockArticleClass = Article;
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	afterAll((done) => {
		server.close();
		done();
	});

	describe('GET /article', () => {
		it('should return a list of article that related to the user ID', async () => {
			const mockGetManyResult: IArticle[] = [
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
					created_at: '2022-08-16T16:25:41.540Z',
					updated_at: '2022-08-16T16:25:41.540Z',
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
					created_at: '2022-08-16T16:25:41.540Z',
					updated_at: '2022-08-16T16:25:41.540Z',
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
					created_at: '2022-08-16T16:25:41.540Z',
					updated_at: '2022-08-16T16:25:41.540Z',
					file_path:
						'content/2022/8/1-dfbd4fdb-00f6-48bc-8cb3-ff168799f07d.html',
				},
			];
			mockArticleClass.mockImplementation(() => ({
				getMany: () => mockGetManyResult,
			}));

			const res = await request(app).get(`${BASE_URL}/article`).expect(200);

			expect(res.body).toEqual(mockGetManyResult);
		});

		it('should return empty list of article that related to the user ID if article is not exists', async () => {
			const mockGetManyResult: IArticle[] = [];
			mockArticleClass.mockImplementation(() => ({
				getMany: () => mockGetManyResult,
			}));

			const res = await request(app).get(`${BASE_URL}/article`).expect(200);

			expect(res.body).toEqual(mockGetManyResult);
		});
	});

	describe('GET /article/:id', () => {
		it('should return an article by id', async () => {
			mockArticleGet.mockResolvedValue(mockArticle);

			const res = await request(app)
				.get(`${BASE_URL}/article/${mockArticle.id}`)
				.expect(200);

			expect(res.body).toEqual(mockArticle);
		});

		it('should return "Article is not found" error message if article is not found by id', async () => {
			mockArticleGet.mockResolvedValue(null);
			const mockError = {
				name: 'ARTICLE_NOT_FOUND',
				code: 404,
				message: 'Article is not found',
			};

			const res = await request(app)
				.get(`${BASE_URL}/article/${mockArticle.id}`)
				.expect(404);

			expect(res.body).toEqual(mockError);
		});
	});

	describe('POST /article', () => {
		it('should return inserted article from given URL', async () => {
			articleAddMock.mockResolvedValue(mockArticle);

			const res = await request(app)
				.post(`${BASE_URL}/article`)
				.send({
					url: 'https://www.cnbc.com/2022/07/02/tesla-tsla-q2-2022-vehicle-delivery-and-production-numbers.html',
				})
				.expect(200);

			expect(res.body).toEqual(mockArticle);
		});

		it('should throw "Failed to read the article to be saved" if article cannot be parsed', async () => {
			const errorMock = {
				name: 'ARTICLE_NOT_FOUND',
				code: 404,
				message: 'Failed to read the article to be saved',
			};

			articleAddMock.mockRejectedValue(errorMock);

			const res = await request(app)
				.post(`${BASE_URL}/article`)
				.send({
					url: 'https://www.cnbc.com/2022/07/02/tesla-tsla-q2-2022-vehicle-delivery-and-production-numbers.html',
				})
				.expect(404);

			expect(res.body).toEqual(errorMock);
		});
	});
});
