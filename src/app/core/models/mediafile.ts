import { CCT } from './cct'
import { Image } from "./image"
import { ContentType } from './enums'

export class Mediafile {

  id: string
  mediaType: string //image,youtube,pdf,audio,video
  MediafileData?: Mediafile
  fileObj?: File
  title?: string
  subtitle?: string
  url?: string
  shorturl?: string
  content?: string
  userId?: string
  username?: string
  contentType?: ContentType = ContentType.Image
  isDone?: boolean = false
  totalLikes?: number
  likes?: string[]
  downloadURL: string //firebase storage absolute path
  path: string //relative path
  labels?: any
  collections?: CCT[] = []
  tagsCCT?: CCT[] = []
  tags?: string
  tags_splited?: string[]
  is_published?: boolean
  createdAt?: number
  updatedAt?: number
  extra?: any

}
