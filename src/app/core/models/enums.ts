export enum ContentType {
  Article = 'Article',
  Youtube = 'Youtube',
  VideoCourse = 'VideoCourse',
  PDF = 'PDF',
  Document = 'Document',
  GoogleDocs = 'GoogleDocs',
  Ebook = 'Ebook',
  Image = 'Image',
  ProductItem = 'ProductItem',
  Words = 'Words',
  SNS = 'SNS',
}

export enum StatusLevel {
  Temporary = 1 ,
  Normal = 2,
  Important = 3,
  VIP = 4, //Very Important
}

export enum SharedSNS {
  Twitter     = 1 << 0, //0b1
  Facebook    = 1 << 1, //0b10
  Youtube     = 1 << 2, //0b100
  Instagram   = 1 << 3, //0b1000

}

// Paginator Mode
export enum PageMode {
  LatestPage = 0,
  PrevPage = 1,
  NextPage = 2

}
