export interface Keywords {
    KeywordId: number;
    KeywordsText: string;
    KeywordsSource: string;
    CreateDate: Date;
}

export class keywords{
    KeywordId :number;
    KeywordsText :string;
    KeywordsSource :string;
    CreateDate :Date;
    Category:string;
    constructor(){
        this.KeywordId =0;
        this.KeywordsText =null;
        this.KeywordsSource =null;
        this.CreateDate =new Date();
        this.Category=null;
    }
}
