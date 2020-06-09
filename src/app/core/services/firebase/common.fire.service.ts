import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, DocumentChangeAction } from '@angular/fire/firestore';
import { Observable, from } from 'rxjs';
import { map, take, mergeMap, expand, takeWhile } from 'rxjs/operators';
import * as firebase from 'firebase/app';

@Injectable({
  providedIn: 'root'
})
export class CommonFireService {


  constructor(private afs: AngularFirestore) {
  }

  collection$(path, query?) {
    return this.afs
      .collection(path, query)
      .snapshotChanges()
      .pipe(
        map(actions => {
          return actions.map(a => {
            const data: Object = a.payload.doc.data();
            const id = a.payload.doc.id;
            return { id, ...data };
          });
        })
      );
  }

  doc$(path): Observable<any> {
    return this.afs
      .doc(path)
      .snapshotChanges()
      .pipe(
        map(doc => {
          return { id: doc.payload.id, ...doc.payload.data() as any };
        })
      );
  }

  upsert(path: string, data: any): Promise<any> {

    const segments = path.split('/').filter(v => v);

    if (segments.length % 2) { // Odd: collection, Even: document
      data.createdAt = firebase.firestore.FieldValue.serverTimestamp();
      return this.afs.collection(path).add(data);
    } else {
      data.updatedAt = firebase.firestore.FieldValue.serverTimestamp();
      return this.afs.doc(path).set(data, { merge: true });
    }
  }

  delete(path) {
    return this.afs.doc(path).delete();
  }


  /// Firebase Server Timestamp
  get timestamp() {
    return firebase.firestore.FieldValue.serverTimestamp();
  }

  /// Just an example, you will need to customize this method.
  atomic() {
    const batch = firebase.firestore().batch();
    /// add your operations here

    const itemDoc = firebase.firestore().doc('items/myCoolItem');
    const userDoc = firebase.firestore().doc('users/userId');

    const currentTime = this.timestamp;

    batch.update(itemDoc, { timestamp: currentTime });
    batch.update(userDoc, { timestamp: currentTime });

    /// commit operations
    return batch.commit();
  }

  /**
   * Delete a collection, in batches of batchSize. Note that this does
   * not recursively delete subcollections of documents in the collection
   * from: https://github.com/AngularFirebase/80-delete-firestore-collections/blob/master/src/app/firestore.service.ts
   */
  deleteCollection(path: string, batchSize: number): Observable<any> {
    const source = this.deleteBatch(path, batchSize);

    // expand will call deleteBatch recursively until the collection is deleted
    return source.pipe(
      expand(val => this.deleteBatch(path, batchSize)),
      takeWhile(val => val > 0),
    );
  }

  // Detetes documents as batched transaction
  deleteBatch(path: string, batchSize: number): Observable<any> {
    const colRef = this.afs.collection(path, ref => ref.orderBy('__name__').limit(batchSize));

    return colRef.snapshotChanges().pipe(
      take(1),
      mergeMap((snapshot: DocumentChangeAction<{}>[]) => {
        // Delete documents in a batch
        const batch = this.afs.firestore.batch();
        snapshot.forEach(doc => {
          batch.delete(doc.payload.doc.ref);
        });

        return from(batch.commit()).pipe(map(() => snapshot.length));
      }),
    );
  }

}
