import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument, DocumentReference } from '@angular/fire/firestore';

import { Observable, from } from 'rxjs';
import { map } from 'rxjs/operators';
import { QueryConfig } from '@core/models/firebase/queryconfig';
import * as firebase from 'firebase';
import { Logger } from '@app/shared/services/logger.service';
import { Media } from '@app/core/models/media';


@Injectable({
  providedIn: 'root'
})
export class MediaFireService {

  private mediaCollection: AngularFirestoreCollection<any>;
  private mediaDocument: AngularFirestoreDocument<any>;
  private totalCollectionSize: number;
  private query: QueryConfig;

  constructor(private afs: AngularFirestore, private logger: Logger) {
    this.mediaCollection = this.afs.collection('notes',
      (ref) => ref.orderBy('createdAt', 'desc') //.limit(5);
    );
  }


  getAllDocs(): Observable<any[]> {
    return this.mediaCollection.snapshotChanges().pipe(
      map((actions) => {
        return actions.map((a) => {
          // console.log(" a.payload.doc: ", a.payload.doc.data())
          const data: Object = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id, ...data };
        });
      })
    );
  }

  getCollectionData(): Observable<any[]> {
    return this.afs.collection('notes').valueChanges();
  }

  getCollectionSize() {
    return this.afs.collection('notes').get().subscribe();
  }

  getMediaById(noteId) {
    return this.afs.doc<any>(`notes/${noteId}`);
  }


  getMediaPageBy(query: QueryConfig) {
    this.logger.log('getMediaPageBy|query: ', query);

    let queryRef;

    return this.afs.collection(query.path, ref => {

      // to get the total number of documents in a collection
      ref.get().then(data => {
        this.totalCollectionSize = data.size;
        this.logger.log("  --> total docs#: ", this.totalCollectionSize);
      });

      if (query.pageMode == 0) {
        queryRef = ref
          .orderBy(query.field, query.reverse ? 'desc' : 'asc')
          // .startAt(query.startAt)
          .limit(query.limit);
      } else if (query.pageMode == 1) { // prevPage
        queryRef = ref
          .where(query.field, '<', query.endBefore)
          .orderBy(query.field, 'desc')
          .limit(query.limit);
        // .orderBy(query.field)
        // .endBefore(query.endBefore)
        // .limitToLast(query.limit) // added since firebase@7.3.0
      } else if (query.pageMode == 2) { // nextPage
        queryRef = ref
          .where(query.field, '>', query.startAfter)
          .orderBy(query.field, 'asc')
          .limit(query.limit);
      }
      return queryRef;
    });
  }

  getMediaPageByTags(query: QueryConfig, tags) {
    this.logger.log('getMediaPageByTags|query&tags: ', query, tags);

    let queryRef;
    let tagsArray;

    if (!tags) return;
    if (!Array.isArray(tags)) {
      tagsArray = tags.split();
    }

    this.logger.log("  --> tagsArray: ", tagsArray);
    return this.afs.collection(query.path, ref => {
      const q = ref.where('tags', 'in', tagsArray);
      if (query.pageMode == 0) { // LatestPage
        queryRef = q
          .orderBy(query.field, query.reverse ? 'desc' : 'asc')
          .limit(query.limit);
      } else if (query.pageMode == 1) { // prevPage
        queryRef = q
          .where(query.field, '<', query.endBefore)
          .orderBy(query.field, 'desc')
          .limit(query.limit);
        // .orderBy(query.field)
        // .endBefore(query.endBefore)
        // .limitToLast(query.limit) // added since firebase@7.3.0
      } else if (query.pageMode == 2) { // nextPage
        queryRef = q
          .where(query.field, '>', query.startAfter)
          .orderBy(query.field, 'asc')
          .limit(query.limit);
      }
      return queryRef;
    });
  }

  upsertMedia(path: string, data: any): Promise<any> {
    this.logger.log("upsertMedia|path: ", path, " , data: ", data);
    const segments = path.split('/').filter(v => v);
    if (segments.length % 2) { // Odd: collection, Even: document
      data.createdAt = firebase.firestore.FieldValue.serverTimestamp();
      return this.afs.collection(path).add(data);
    } else {
      data.updatedAt = firebase.firestore.FieldValue.serverTimestamp();
      return this.afs.doc(path).set(data, { merge: true });
    }
  }

  addMedia(data: Media): Observable<DocumentReference> {
    this.logger.log("addMedia/data: ", data);
    data.createdAt = firebase.firestore.FieldValue.serverTimestamp();
    return from(this.mediaCollection.add({ ...data })); //use {...}
  }

  updateMedia(data: Media) {
    this.logger.log("updateMedia/data: ", data);
    data.updatedAt = firebase.firestore.FieldValue.serverTimestamp();
    return from(this.getMediaById(data.id).update({ ...data })); //use {...}
  }

  deleteMedia(id) {
    return from(this.getMediaById(id).delete());
  }
}
