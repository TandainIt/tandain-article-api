import AtLeastOne from '@/types/AtLeastOne.types';
import Article from '../service';

export type ArticleUniqueColumn = {
	id: Pick<Article, 'id'>;
};

export type WhereArticleOne = AtLeastOne<Article, ArticleUniqueColumn>;

export type InsertArticle = Omit<Partial<Article>, 'id'>;
