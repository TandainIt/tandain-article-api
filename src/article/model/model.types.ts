import AtLeastOne from '@/types/AtLeastOne.types';
import Article from '../service';

export interface QueryOptions {
	limit?: number | null;
	offset?: number | null;
	orderBy?: { [key: string]: string };
}

export type ArticleUniqueColumn = {
	id: Pick<Article, 'id'>;
};

export type WhereArticleOne = AtLeastOne<Article, ArticleUniqueColumn>;

export type InsertArticle = Omit<Partial<Article>, 'id'>;
