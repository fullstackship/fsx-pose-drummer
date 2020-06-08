import { Injectable } from '@angular/core'
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'
import * as firebase from 'firebase/app'

@Injectable({
  providedIn: 'root'
})
export class FireService {

  constructor(private afs: AngularFirestore) {
  }

  /*
    Usage:
    .collection$('todos', ref =>
      ref.where('uid', '==', user.uid).orderBy('createdAt', 'desc').limit(20))
    */
  collection$(path, query?) {
    return this.afs
      .collection(path, query)
      .snapshotChanges()
      .pipe(
        map(actions => {
          return actions.map(a => {
            const data: Object = a.payload.doc.data()
            const id = a.payload.doc.id
            return { id, ...data }
          })
        })
      )
  }

  // Usage: this.todo$ = .doc$(`todos/${id}`)
  doc$(path): Observable<any> {
    return this.afs
      .doc(path)
      .snapshotChanges()
      .pipe(
        map(doc => {
          return { id: doc.payload.id, ...doc.payload.data() as any }
        })
      )
  }

  /**
   * @param  {string} path 'collection' or 'collection/docID'
   * @param  {any} data new data
   *
   * Creates or updates data on a collection(Odd num) or document(Even num)
   * Usage: this.db.upsert(`todos/${todo.id}`, { status })
   **/
  upsert(path: string, data: any): Promise<any> {

    const segments = path.split('/').filter(v => v)
    // Odd: collection, Even: document
    if (segments.length % 2) {
      data.createdAt = firebase.firestore.FieldValue.serverTimestamp()
      return this.afs.collection(path).add(data)
    } else {
      data.updatedAt = firebase.firestore.FieldValue.serverTimestamp()
      return this.afs.doc(path).set(data, { merge: true })
    }
  }

  /**
   * @param  {string} path path to document
   *
   * Deletes document from Firestore
   **/
  delete(path) {
    return this.afs.doc(path).delete()
  }
}
