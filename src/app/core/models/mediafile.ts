import { ContentType } from './enums';
import { Collection } from './collection';

export class Mediafile {

  id: string;
  mediaType: string; //image,youtube,pdf,audio,video
  MediafileData?: Mediafile;
  fileObj?: File;
  title?: string;
  subtitle?: string;
  url?: string;
  shorturl?: string;
  content?: string;
  userId?: string;
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
  createdAt?: number;
  updatedAt?: number;
  extra?: any;

}
