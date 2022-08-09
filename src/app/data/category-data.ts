export class CategoryData {
    constructor(
        public _id: {}, public title: string, public imageUrl: string, public imageId: string,
        public createBy: string,
        public createdOn: Date
    ) { }
}