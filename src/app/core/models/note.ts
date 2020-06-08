import { User } from "./user"
import { Image } from "./image"
import { Collection } from "./collection"
import { Tag } from "./tag"
import { Comment } from "./comment"
import { Mediafile } from './mediafile'

export class Post {
  id: string
  pid?: number
  postData?: Post
  title: string
  subtitle: string
  content: string
  userId: string
  username?: string
  totalLikes?: number
  likes?: string[]
  mainImage?: Mediafile
  mediaFiles?: Mediafile[]
  labels?: any
  collections?: Collection[] = []
  tags?: string
  comments?: Comment[]
  trending?: string
  read_count?: number
  tags_splited?: string[]
  is_published?: boolean
  createdAt?: number
  updatedAt?: number
  extra?: any
	// getUrl(): string {
	//   return
	// }
}

// TODO
export class PostEx {
  id?: string //post id
  postData: Post
  extra?: string
}


