import { Injectable } from '@angular/core'

import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore'

import { Observable, from } from 'rxjs'
import { map } from 'rxjs/operators'
import { QueryConfig } from '@core/models/firebase/queryconfig'
import { classify } from '@angular-devkit/core/src/utils/strings'

@Injectable()
export class FirebaseAppService {

  appsCollection: AngularFirestoreCollection<any>
  appDocument: AngularFirestoreDocument<any>
  private query: QueryConfig
  totalCollectionSize: number

  constructor(private afs: AngularFirestore) {
    this.appsCollection = this.afs.collection('apps', (ref) => ref.orderBy('time', 'desc').limit(5))
  }

  getAllappData(): Observable<any[]> {
    // ['added', 'modified', 'removed']
    return this.appsCollection.snapshotChanges().pipe(
      map((actions) => {
        return actions.map((a) => {
          const data = a.payload.doc.data()
          return { id: a.payload.doc.id, ...data }
        })
      })
    )
  }

  getCollectionData(): Observable<any[]> {
    return this.afs.collection('apps').valueChanges()
  }

  getCollectionSize() {
    return this.afs.collection('apps').get().subscribe()
  }

  getApp(appId) {
    return this.afs.doc<any>(`apps/${appId}`)
  }


  getAppsByPage(query: QueryConfig, categoryId?, filter?, sortOrder?) {
    // console.log('query: ', query)

    let queryRef

    return this.afs.collection(query.path, ref => {

      // to get the total number of documents in a collection
      ref.get().then(data => {
        this.totalCollectionSize = data.size
      })

      //0: changePageSize, 1: prevPage, 2: nextPage
      if (query.pageMode == 0) {
        queryRef = ref
          .orderBy(query.field, query.reverse ? 'desc' : 'asc')
          // .startAt(query.startAt)
          .limit(query.limit)
      } else if (query.pageMode == 1) {
        queryRef = ref
          .where(query.field, '>', query.endBefore)
          .orderBy(query.field, 'asc')
          .limit(query.limit)
        // .orderBy('createdAt', 'desc')
        // .orderBy(query.field, 'asc')
        // .limit(query.limit)
        // .endBefore(query.endBefore)


      } else if (query.pageMode == 2) {
        queryRef = ref
          .where(query.field, '<', query.startAfter)
          .orderBy(query.field, 'desc')
          .limit(query.limit)
        // .limit(query.limit)
        // .orderBy(query.field, query.reverse ? 'desc' : 'asc')
        // .startAfter(query.startAfter)
      }
      return queryRef
    })
  }

  getPageBy(query: QueryConfig) {
    // console.log('getPageBy|query: ', query)

    let queryRef

    return this.afs.collection(query.path, ref => {
      if (query.pageMode == 0) {
        queryRef = ref
          .orderBy(query.field, query.reverse ? 'desc' : 'asc')
          // .startAt(query.startAt)
          .limit(query.limit)
      } else if (query.pageMode == 1) { // prevPage
        queryRef = ref
          .where(query.field, '<', query.endBefore)
          .orderBy(query.field, 'desc')
          .limit(query.limit)
          // .orderBy(query.field)
          // .endBefore(query.endBefore)
          // .limitToLast(query.limit) // added since firebase@7.3.0
      } else if (query.pageMode == 2) { // nextPage
        queryRef = ref
          .where(query.field, '>', query.startAfter)
          .orderBy(query.field, 'asc')
          .limit(query.limit)
      }
      return queryRef
    })
  }



  createApp(data: Object) {
    //this.logger.debug('AppService/addApp: ', data)
    // console.log("addApp/data: ", data)
    // const app = {
    //   title: data.get('title'),
    // }
    return from(this.appsCollection.add(data))
  }

  updateApp(id, data: Object) {
    // console.log("updateApp/data: ", data)
    return from(this.getApp(id).update(data))
  }

  deleteApp(id) {
    return from(this.getApp(id).delete())
  }
}


