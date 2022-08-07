import { app, server } from '@/app';
import request from 'supertest';

import Article from '../service';
import mockArticle from '../../../__mock__/article.mock';

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

const articleAddMock = jest.spyOn(Article, 'add');

const BASE_URL = '/api/v1';

describe('article/controller', () => {
	afterEach(() => {
		jest.clearAllMocks();
	});

	afterAll((done) => {
		server.close();
		done();
	});

	it('should return inserted article from given URL', async () => {
		const filePathMock = 'content/2022/07/filename';
		const insertedArticleMock = {
			id: 1,
			user_id: 1,
			source_url: mockArticle.url,
			source_name: mockArticle.source,
			title: mockArticle.title,
			description: mockArticle.description,
			image: mockArticle.image,
			author: mockArticle.author,
			published: mockArticle.published,
			ttr: mockArticle.ttr,
			created_at: new Date().toISOString(),
			updated_at: new Date().toISOString(),
			file_path: filePathMock,
		};

		articleAddMock.mockResolvedValue(insertedArticleMock);

		const res = await request(app)
			.post(`${BASE_URL}/article`)
			.send({
				url: 'https://www.cnbc.com/2022/07/02/tesla-tsla-q2-2022-vehicle-delivery-and-production-numbers.html',
			})
			.expect(200);

		expect(res.body).toEqual(insertedArticleMock);
	});

	it('should throw "Failed to read the article to be saved" if article cannot be parsed', async () => {
		const errorMock = {
			name: 'ARTICLE_NOT_FOUND',
			code: 400,
			message: 'Failed to read the article to be saved',
		};

		articleAddMock.mockRejectedValue(errorMock);

		const res = await request(app)
			.post(`${BASE_URL}/article`)
			.send({
				url: 'https://www.cnbc.com/2022/07/02/tesla-tsla-q2-2022-vehicle-delivery-and-production-numbers.html',
			})
			.expect(400);

		expect(res.body).toEqual(errorMock);
	});
});
