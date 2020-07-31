import { Component, OnInit, ViewChild, ElementRef, Renderer2, ChangeDetectorRef, ApplicationRef, TemplateRef, Input, ChangeDetectionStrategy, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { SoundFileData } from '@app/core/models';
import { b64toBlob } from '@app/shared/utils/mediaUtils';
import { ContentType } from '@app/core/models/enums';
import { MatDialog, MatDialogConfig, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NotifyService } from '@app/core/services/notify.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage, AngularFireUploadTask, AngularFireStorageReference } from '@angular/fire/storage';
import { Observable, Subscription } from 'rxjs';
import { tap, finalize } from 'rxjs/operators';
import { ENTER, COMMA } from '@angular/cdk/keycodes';
import { NotificationService } from '@app/shared/services/notification.service';
import { AuthFireService } from '@app/core/services/firebase/fire.auth.service';
import { MatChipInputEvent } from '@angular/material/chips';
import { MediaFireService } from '../service/media-fire.service';
import { Media } from '@app/core/models/media';

@Component({
  selector: 'fsx-sound-uploader',
  templateUrl: './sound-uploader.component.html',
  styleUrls: ['./sound-uploader.component.scss']
})
export class SoundUploaderComponent implements OnInit {

  @ViewChild('vc', { read: ElementRef }) vc: ElementRef;
  @ViewChild('tpl', { read: TemplateRef }) tpl: TemplateRef<any>;

  @ViewChild('fileInput') fileInput: ElementRef;

  @Input() file: File;

  task: AngularFireUploadTask;
  fireUploadTasks: { task: AngularFireUploadTask, ref: AngularFireStorageReference, path: string, percentage?: any, snapshot?: any; }[] = [];

  percentage: Observable<number>;
  snapshot: Observable<any>;
  downloadURL;

  showControl = true;
  showControl2 = false;
  showControl3 = false;

  private subscription: Subscription;


  title: string;
  isHovering: boolean;

  files: File[] = [];
  selectedFiles: File[] = [];
  soundFileData: SoundFileData[] = [];
  uploadedFiles: Media[] = [];


  isLoading = false;
  isFetching = false;
  form: FormGroup;
  mode: 'create' | 'update' = 'create';

  media: Media = new Media();
  private uid: string;
  contentType_List;

  // for Tags
  tags: string[] = [];
  chipSelectable = true;
  chipRemovable = true;
  chipAddOnBlur = true;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];

  constructor(
    @Inject(MAT_DIALOG_DATA) public dialogData: any,
    private dialogRef: MatDialogRef<SoundUploaderComponent>,
    private notifySV: NotifyService,
    public dialog: MatDialog,
    private fb: FormBuilder,
    private renderer: Renderer2,
    private el: ElementRef,
    private notificationService: NotificationService,
    private fireAuthSV: AuthFireService,
    public mediaFireSV: MediaFireService,
    private storage: AngularFireStorage,
    private db: AngularFirestore,
    private cdr: ChangeDetectorRef,
    private appRef: ApplicationRef,
  ) {

  }
  ngOnInit() {

    this.form = new FormGroup({
      title: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3)]
      }),
      subtitle: new FormControl(null, {
        validators: [Validators.minLength(5)]
      }),
      url: new FormControl(null, {
        validators: [Validators.minLength(3)]
      }),
      tags: new FormControl(null)
    });

    this.contentType_List = Object.keys(ContentType);

    this.notifySV.notifyObs$.subscribe((uploadedFile: Media) => {
      console.log("  -->uploadedFile: ", uploadedFile);
      this.uploadedFiles = [...this.uploadedFiles, uploadedFile];
      // this.uploadedFiles.push(uploadedFile)
    });

  }

  ngAfterViewInit() {
  }

  ngAfterContentInit(): void {
    // console.log("ngAfterContentInit#vc: ", this.vc)
  }

  ngAfterContentChecked(): void {

  }

  detectFiles($event) {
    console.log(" detectFiles $event: ", $event);
    // console.log("  --> $event.target: ", $event.target)
    const files = $event.target.files;
    for (let i = 0; i < files.length; i++) {

      const file = files.item(i);
      console.log("  --> file: ", file);

      this.selectedFiles.push(file);
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (e) => {
        console.log("  --> $event: ", $event);
        const newIData = { event: $event, file: file, base64: reader.result } as SoundFileData;
        console.log("  --> newIData: ", newIData);
        this.soundFileData.push(newIData);
      };
    }
    // console.log("detectFiles: ", this.selectedFiles)
  }

  detectFiles2(files: FileList) {
    for (let i = 0; i < files.length; i++) {
      const f = files.item(i);

      this.selectedFiles.push(f);
      const reader = new FileReader();
      reader.readAsDataURL(f);
      reader.onload = (e) => {
        this.soundFileData.push({ file: f, base64: reader.result as string });
      };
    }
    // console.log("detectFiles: ", this.selectedFiles)
  }


  toggleHover(event: boolean) {
    this.isHovering = event;
  }

  onDrop(files: FileList) {
    for (let i = 0; i < files.length; i++) {
      this.files.push(files.item(i));
    }
  }

  onDropManual(files: FileList) {
    for (let i = 0; i < files.length; i++) {
      this.selectedFiles.push(files.item(i));
    }
  }

  onSaveForm() {
  }


  trackBySoundData(index: number, item: SoundFileData): string {
    return item.file.name;
  }

  async save() {

    console.log('form.value: ', this.form.value);
    if (this.form.invalid) {
      // TODO: find the invalid form control
      console.log("form invalid!!!");
      return;
    }


    if (!this.uid) {
      this.uid = await this.fireAuthSV.getCurrentUser$().then((user) => {
        return user.uid;
      });
    }

    let mediaData: Media = {
      'username': 'author',
      'uid': this.uid,
      ...this.form.value
    };


    if (this.mode === 'create') {
      this.mediaFireSV.addMedia(mediaData).subscribe((res) => {

      });
    } else if (this.mode === 'update') {
      mediaData.id = this.dialogData.id;
      this.mediaFireSV.updateMedia(mediaData).subscribe((res) => {

      });
    }

    this.dialogRef.close(mediaData);
  }

  closeDialog() {
    this.onClear();
    this.dialogRef.close(this.media);
  }


  chipAdd(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;
    console.log(" chipAdd|tags: ", this.tags);
    console.log(" chipAdd|input: ", input, " ,  value: ", value);

    if (!this.tags) {
      this.form.get('tags').setValue([]);
      this.tags = this.form.get('tags').value;

    }
    if ((value || '').trim()) {
      this.tags.push(value.trim());
    }

    if (input) {
      input.value = '';
    }
  }

  chipRemove(tag: string): void {
    const index = this.tags.indexOf(tag);

    if (index >= 0) {
      this.tags.splice(index, 1);
    }
  }

  isCreateMode() {
    return this.mode === 'create';
  }

  isUpdateMode() {
    return this.mode === 'update';
  }

  initializeFormGroup() {
    this.form.setValue({
      title: '',
      subtitle: '',
      url: '',
      tags: [''],
    });
  }

  onClear(msg: String = '') {
    this.form.reset();
    this.initializeFormGroup();
    if (msg != '') this.notificationService.success(msg);
  }

  onClose() {
    this.onClear();
    // this.dialogRef.close()
  }



  /************************************************************************
   *  Media Upload Part
   *
   *
   */

  resetUpload() {
    this.form.reset();
    this.soundFileData = [];
    this.fileInput.nativeElement.value = null;
  }


  notifyUpload() {
    this.notifySV.notifyOther({ downloadURL: this.downloadURL });
  }

  formUpload() {
    console.log("  --> SoundFileData: ", this.soundFileData);
    console.log("  --> form.value: ", this.form.value);

    // The storage path
    const allPercentage: Observable<number>[] = [];

    for (let iData of this.soundFileData) {
      const filename = `${Date.now()}_${iData.file.name}`;
      const path = `filetest/${filename}`;
      console.log("   ---> path: ", path);

      // Reference to storage bucket
      const ref = this.storage.ref(path);

      const blob = b64toBlob(iData.base64);

      try {
        const task = ref.put(blob);
        this.fireUploadTasks.push({ task, ref, path });

        // Progress monitoring
        const _percentage$ = task.percentageChanges();

        allPercentage.push(_percentage$);
        this.percentage = task.percentageChanges();
        // console.log("   ---> percentage: ", this.percentage)

        task.snapshotChanges().pipe(
          finalize(() => {
            ref.getDownloadURL().subscribe((downloadURL) => {
              console.log("  ---> finalize downloadURL: ", downloadURL);
              const mediaObj = {
                downloadURL: downloadURL,
                path: path,
                createdAt: new Date().getTime(),
                ...this.form.value
              } as Media;

              console.log("  --> mediaObj: ", mediaObj);

              this.db.collection('medias').add(mediaObj);
            });
          })
        ).subscribe();
      } catch (e) {
        console.log(e);
      }
    }

  }

  startUpload() {
    //console.log("startUpload#vc,tpl: ", this.vc, this.tpl);
    // this.vc.createEmbeddedView(this.tpl)
    // console.log("  --> files: ", this.files);

    // The storage path

    for (let file of this.files) {
      const filename = `${Date.now()}_${file.name}`;
      const path = `filetest/${filename}`;
      console.log("   ---> path: ", path);

      // Reference to storage bucket
      const ref = this.storage.ref(path);

      // The main task
      this.task = this.storage.upload(path, file);
      //console.log("   ---> task: ", this.task);

      // Progress monitoring
      this.percentage = this.task.percentageChanges();
      //console.log("   ---> percentage: ", this.percentage);

      this.snapshot = this.task.snapshotChanges().pipe(
        tap(t => {
          this.doManualCD();
          console.log(this.percentage, t, this.snapshot);
        }),
        finalize(async () => {
          this.downloadURL = await ref.getDownloadURL().toPromise();
          const mediaObj = {

            downloadURL: this.downloadURL,
            path: path
          } as Media;
          this.db.collection('files').add(mediaObj);
          this.showControl = false;
          this.doManualCD();
        }),
      );
    }

  }


  isActive(snapshot) {
    return snapshot.state === 'running' && snapshot.bytesTransferred < snapshot.totalBytes;
  }

  doManualCD() {
    this.cdr.detectChanges();
    this.appRef.tick();
  }

  //TODO:  Bacause snapshot state changes super fast, needs double trigger
  uploadPause(snapshot) {
    this.task.pause();
    console.log("uploadPause()#snapshot: ", snapshot);
    this.doManualCD();


  }
  uploadCancel2() {
    console.log("uploadCancel2()#");
    try {
      // this.vc.remove()  //Doesn't work
      this.renderer.removeChild(this.el.nativeElement, this.vc.nativeElement);
      this.task.cancel();
      this.doManualCD();
    } catch (e) {
      // throw e

    } finally {

    }

  }

  uploadCancel() {

    this.snapshot = null;
    this.task.cancel();
    this.doManualCD();
  }

  uploadResume() {
    this.task.resume();
    this.doManualCD();
  }

}
