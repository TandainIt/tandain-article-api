export interface IArticle {
	id: number;
	user_id: number;
	file_path: string;
	title: string | null;
	description: string | null;
	image: string | null;
	author: string | null;
	published: string | null; // NOTE: Published ISO date
	source_name: string | null;
	source_url: string | null;
	ttr: number | null; // NOTE: Time to read the article
	created_at: string;
	updated_at: string;
}
