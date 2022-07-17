import { ArticleData, extract } from 'article-parser';

interface ConstructorArgs extends ArticleData {
	id: number;
	userId: number;
}

class Article {
	public id: number;
	public userId: number;
	public url?: string; // NOTE: Not added yet to ERD
	public title?: string; // NOTE: Not added yet to ERD
	public description?: string;
	public image?: string;
	public content?: string;
	public author?: string;
	public published?: string; // NOTE: Published ISO date
	public source?: string;
	public ttr?: number;
	public createdAt: string;

	constructor({
		id,
		userId,
		url,
		title,
		description,
		image,
		content,
		author,
		published,
		source,
		ttr,
	}: ConstructorArgs) {
		this.id = id;
		this.userId = userId;
		this.url = url;
		this.title = title;
		this.description = description;
		this.image = image;
		this.content = content;
		this.author = author;
		this.published = published;
		this.source = source;
		this.ttr = ttr; // NOTE: Time to read
		this.createdAt = new Date().toISOString();
	}

	static async extract(contentURL: string) {
		try {
			const extractedArticle = await extract(contentURL);

      return extractedArticle
		} catch (err) {}
	}
}

export default Article;
