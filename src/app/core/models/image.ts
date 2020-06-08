import { Tag } from './tag'

export class Image {
  imgOne: string
  imgID?: string
  category?: string
  tags?: Tag[]
  imgUrls?: string[]
  imgType?: string
  imgVersion?: string
  imgFiles?: ImageFile[]
  //imgFiles?: []
}

export class ImageFile {
  destination: string
  encoding: string
  filename: string
  originalname: string
  path: string
  mimetype: string
  size: number
}

export class ImageFileData {
  event? : Event
  file?: File
  base64?: string
  contentType?: string
  pureBase64Data?: string
  croppedBase64?: string
}
