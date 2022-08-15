import { extract } from 'article-parser';
import { v4 as uuidv4 } from 'uuid';
import { S3 } from '@aws-sdk/client-s3';

import Article from './service';
import ArticleModel from '../model';
import TandainError from '@/utils/TandainError';
import mockParsedArticle from '../../../__mock__/article.mock';

jest.mock('uuid', () => ({
	v4: jest.fn().mockReturnValue('uuid'),
}));

jest.mock('@aws-sdk/client-s3', () => {
	let instance = {
		putObject: jest.fn(),
	};

	return { S3: jest.fn(() => instance) };
});

jest.mock('article-parser', () => {
	return { extract: jest.fn() };
});

const uploadMock = jest.spyOn(Article as any, 'upload');

const mockFindOne = jest.spyOn(ArticleModel, 'findOne');
const insertOneArticleMock = jest.spyOn(ArticleModel as any, 'insertOne');

describe('article/service', () => {
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

	describe('upload', () => {
		let mockS3: any;

		beforeEach(() => {
			mockS3 = new S3({});
		});

		it('should success store article html to S3 bucket', async () => {
			const mockUserId = 1;

			mockS3.putObject.mockResolvedValue({
				ETag: '"c7f8596979c3c51df566adf9a59bb88b"',
				VersionId: 'HLEXqHsq4m1p7cB8MyKIQQJWAXnPBLmq',
			});

			const date = new Date();
			const year = date.getFullYear();
			const month = date.getMonth() + 1;
			const uuid = uuidv4();

			const filename = `${mockUserId}-${uuid}.html`;
			const expectedPath = `content/${year}/${month}/${filename}`;

			const path = await Article['upload'](
				mockParsedArticle.content,
				mockUserId
			);

			expect(path).toEqual(expectedPath);
		});

		it('should throw  "Failed to store the article" and 500 code error when it missing AWS credentials', async () => {
			const mockUserId = 1;

			mockS3.putObject.mockRejectedValue({
				message:
					'Missing credentials in config, if using AWS_CONFIG_FILE, set AWS_SDK_LOAD_CONFIG=1',
				errno: -4062,
				code: 'CredentialsError',
				syscall: 'connect',
				address: '169.254.169.254',
				port: 80,
				time: '2022-07-20T16:06:08.999Z',
			});

			await expect(
				Article['upload'](mockParsedArticle.content, mockUserId)
			).rejects.toThrowError(
				new TandainError('Failed to store the article', {
					name: 'CredentialsError',
					code: undefined,
				})
			);
		});

		it('should throw  "Failed to store the article" and 404 code error when the specified bucket does not exist', async () => {
			const mockUserId = 1;

			mockS3.putObject.mockRejectedValue({
				code: 'NoSuchBucket',
				region: null,
				time: '2022-07-20T16:10:24.006Z',
				requestId: 'HBK681J6AZW5MXXS',
				extendedRequestId:
					'qQ1CyjI0sMg0J6o8007AtsYLTzvm4U8DEuDFej73c2KC2rHBM8Iw0Z7QRrmhq+jYu+jqGcYi6W8=',
				cfId: undefined,
				statusCode: 404,
				retryable: false,
				retryDelay: 97.55496658446089,
			});

			await expect(
				Article['upload'](mockParsedArticle.content, mockUserId)
			).rejects.toThrowError(
				new TandainError('Failed to store the article', {
					name: 'NoSuchBucket',
					code: 404,
				})
			);
		});
	});

	describe('get', () => {
		it('should return an article by id', async () => {
			mockFindOne.mockResolvedValue(mockArticle);

			const article = await Article.get(1);

			expect(article).toEqual(mockArticle);
		});

		it('should return null if article by id is not exist', async () => {
			mockFindOne.mockResolvedValue(null);

			const article = await Article.get(1);

			expect(article).toEqual(null);
		});

		it('should return error if there is something wrong when getting an article from database', async () => {
			mockFindOne.mockRejectedValue({
				message: 'Failed to retrieve memory usage at process exit',
				status: 500,
			});

			await expect(Article.get(1)).rejects.toThrowError(
				new TandainError('Failed to retrieve memory usage at process exit', {
					code: 500,
					name: 'Internal Server Error',
				})
			);
		});
	});

	describe('add', () => {
		let extractMock: any;

		beforeEach(() => {
			extractMock = extract;
		});

		it('should return inserted article from given URL', async () => {
			const urlMock = 'https://example.com';

			extractMock.mockResolvedValue(mockParsedArticle);
			uploadMock.mockResolvedValue(mockFilePath);
			insertOneArticleMock.mockResolvedValue(mockArticle);

			const article = await Article.add(urlMock, 1);

			expect(article).toEqual(mockArticle);
		});

		it('should throw "Failed to read the article to be saved" if content value is null', async () => {
			const urlMock = 'https://example.com';
			const nullContentMock = { ...mockParsedArticle, content: undefined };

			extractMock.mockResolvedValue(nullContentMock);

			await expect(Article.add(urlMock, 1)).rejects.toThrowError(
				new TandainError('Failed to read the article to be saved', {
					code: 400,
					name: 'ARTICLE_NOT_FOUND',
				})
			);
		});

		it('should throw "Failed to store the article" if uploading is error', async () => {
			const urlMock = 'https://example.com';

			extractMock.mockResolvedValue(mockParsedArticle);
			uploadMock.mockRejectedValue({
				message: 'Failed to store the article',
				status: 500,
			});

			await expect(Article.add(urlMock, 1)).rejects.toThrowError(
				new TandainError('Failed to store the article')
			);
		});
	});
});
