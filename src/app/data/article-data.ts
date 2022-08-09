export class ArticleData {
    constructor(
        public _id: {}, public title: string, public description: string, public content: string, public category: string[], public author: string, public createBy: string, public createdOn: Date
    ) { }
}