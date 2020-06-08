import { Image } from "./image"
import { Collection } from "./collection"
import { Tag } from "./tag"
import { Comment } from "./comment"

export class User {
  _id: string
  uid?: string
  username: string
  nickname: string
  viewname: string
  email: string
  role: string
  is_seller: Boolean


  avatar_image?: string[]
  images?: Image
  bio?: string
  personalization?: any
  settings?: any

  createdAt?: Date
  updatedAt?: Date
}
