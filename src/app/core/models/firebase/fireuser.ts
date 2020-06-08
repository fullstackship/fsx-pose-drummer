import { Image } from "../image";
import { Collection } from "../collection";
import { Tag } from "../tag";
import { Comment } from "../comment";

export class User {
  uid: string;
  data: {
    username: string;
    nickname: string;
    viewname: string;
    email: string;
    role: string;
    is_seller: Boolean;

    //firebase
    firebaseUser?: FireUser;

    avatar_image?: string[];
    images?: Image;
    bio?: string;
    personalization?: any;
    settings?: any;

    createdAt?: any;
    updatedAt?: any;
  };

}

export class FireUser {
  uid: string;
  data: {
    email?: string | null;
    photoURL?: string;
    avatar_image?: string[];
    images?: Image;
    displayName?: string;
    nickname?: string;
    role?: string;
    settings?: any;
    bio?: string;
    isAnonymous?: Boolean;
    extra?: any;

    createdAt?: any;
    updatedAt?: any;
  };

}
