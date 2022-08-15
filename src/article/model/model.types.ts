import AtLeastOne from '@/types/AtLeastOne.types';
import Article from '../service';

export type ArticleUniqueColumn = {
	id: Pick<Article, 'id'>;
};

export type WhereArticleOne = AtLeastOne<Article, ArticleUniqueColumn>;

export interface InsertArticle
	extends Omit<
		Partial<Article>,
		'id' | 'userId' | 'filePath' | 'sourceURL' | 'sourceName'
	> {
	user_id: number;
	file_path: string | null;
	source_url?: string | null;
	source_name?: string | null;
}
