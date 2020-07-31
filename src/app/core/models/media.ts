import { ContentType } from './enums';
import { Collection } from './collection';

export class Media {

  id: string;
  mediaType: string; //image,youtube,pdf,audio,video
  MediafileData?: Media;
  fileObj?: File;
  title?: string;
  subtitle?: string;
  url?: string;
  shorturl?: string;
  content?: string;
  uid?: string
  username?: string;
  isDone?: boolean = false;
  totalLikes?: number;
  likes?: string[];
  downloadURL: string; //firebase storage absolute path
  path: string; //relative path
  labels?: any;
  contentType?: ContentType = ContentType.AudioSound;
  collections?: Collection[];
  tags?: string[];
  is_published?: boolean;
  createdAt?: any;
  updatedAt?: any;
  extra?: any;

}
