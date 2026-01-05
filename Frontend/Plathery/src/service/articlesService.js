import articles from "../data/articles.json";

export const getArticles = () => articles;

export const getArticleById = (id) => {
  return articles.find(article => article.id === Number(id));
};
