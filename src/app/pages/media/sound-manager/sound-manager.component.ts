import { Component, OnInit, ViewChild } from '@angular/core';
import { TableColumn } from '@app/core/models/interfaces/table-column.interface';
import { ReplaySubject, Observable, Subject, Subscription } from 'rxjs';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { FormControl } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { PageMode } from '@app/core/models/enums';
import { map } from 'rxjs/operators';
import { MatSelectChange } from '@angular/material/select';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS, MatFormFieldDefaultOptions } from '@angular/material/form-field';
import { QueryConfig } from '@app/core/models';
import { Logger } from '@app/shared/services/logger.service';
import { SoundUploaderComponent } from '../sound-uploader/sound-uploader.component';
import { MediaFireService } from '../service/media-fire.service';
import { AuthFireService } from '@app/core/services/firebase/fire.auth.service';
import { Media } from '@app/core/models/media';

@Component({
  selector: 'fsx-sound-manager',
  templateUrl: './sound-manager.component.html',
  styleUrls: ['./sound-manager.component.scss'],

  providers: [
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: {
        appearance: 'standard' // or outline
      } as MatFormFieldDefaultOptions
    }
  ]
})
export class SoundManagerComponent implements OnInit {

  subject$: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  data$: Observable<any[]> = this.subject$.asObservable();
  medias: Media[] = [];

  currPageLimit = 8;
  isLoading = false;
  totalNotes = 0;
  pageNumber = 0;
  pageIndex = 0;

  private unsubscribe$: Subject<any> = new Subject();
  private mediasSub: Subscription = null;
  private authSub: Subscription = null;
  userIsAuthenticated = false;
  userId: string;

  columns: TableColumn<Media>[] = [
    { label: 'Checkbox', property: 'checkbox', type: 'checkbox', visible: true },
    { label: 'Title', property: 'title', type: 'text', visible: true },
    { label: 'Type', property: 'contentType', type: 'text', visible: true },
    { label: 'Date', property: 'createdAt', type: 'text', visible: true, cssClasses: ['text-date'] },
    { label: 'Tags', property: 'tags', type: 'text', visible: false },
    { label: 'Actions', property: 'actions', type: 'button', visible: true }
  ];

  @ViewChild(MatTable, { static: true }) matTable: MatTable<any>;

  pageSize = 10;
  pageSizeOptions: number[] = [5, 10, 20, 50];
  dataSource: MatTableDataSource<Media> | null;
  selection = new SelectionModel<Media>(true, []);
  searchCtrl = new FormControl();

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(
    private dialog: MatDialog,
    public mediaFireSV: MediaFireService,
    private authFireSV: AuthFireService,
    private logger: Logger
  ) {
  }


  get visibleColumns() {
    return this.columns.filter(column => column.visible).map(column => column.property);
  }

  ngOnInit() {
    this.dataSource = new MatTableDataSource();

    this.loadData();
  }

  ngAfterViewInit() {

    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadData() {
    const query: QueryConfig = {
      path: 'medias',
      field: 'createdAt',
      pageMode: PageMode.LatestPage,
      limit: this.currPageLimit,
      reverse: true,
      prepend: false
    };

    this.mediasSub = this.mediaFireSV.getAllDocs()
      .subscribe(
        (noteData: Media[]) => {
          this.logger.log("noteData from query: ", noteData);

          this.isLoading = false;
          this.medias = noteData.sort();

          this.dataSource.data = this.medias;
        });

    // this.searchCtrl.valueChanges.subscribe(
    //   value => this.onFilterChange(value)
    // );
  }


  applyFilter(event: Event) {

    if (!this.dataSource) {
      return;
    }
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  createItem() {
    const dialogConfig: MatDialogConfig = {
      panelClass: 'my-panel',
      disableClose: true,
      autoFocus: true,

      minWidth: '485px',
      // Set maxWidht,maxHeight to 100vw,100vh to prevent shrinking
      maxWidth: '100vw',
      maxHeight: '100vh',
      // for full screen
      // height: '70%',
      // width: '80%'
    };
    this.dialog.open(SoundUploaderComponent, dialogConfig).afterClosed().subscribe((item: any) => {

    });
  }

  updateItem(item: Media) {
    const dialogConfig: MatDialogConfig = {
      panelClass: 'my-panel',
      disableClose: true,
      autoFocus: true,

      minWidth: '485px',
      // Set maxWidht,maxHeight to 100vw,100vh to prevent shrinking
      maxWidth: '100vw',
      maxHeight: '100vh',
      // for full screen
      // height: '70%',
      // width: '80%'
    };

    dialogConfig.data = item;

    this.dialog.open(SoundUploaderComponent, dialogConfig).afterClosed().subscribe((item: any) => {
      // TODO

    });
  }

  fixedBtnClicked() {
    const dialogConfig: MatDialogConfig = {
      panelClass: 'my-panel',
      disableClose: false,
      autoFocus: true,
      minWidth: '485px',
      // Set maxWidht,maxHeight to 100vw,100vh to prevent shrinking
      maxWidth: '100vw',
      maxHeight: '100vh'
    };
    this.dialog.open(SoundUploaderComponent, dialogConfig).afterClosed().subscribe((item: any) => { });
  }

  deleteItem(item: Media) {
    // this.medias.splice(this.medias.findIndex((existingItem) => existingItem.id === item.id), 1);
    // this.selection.deselect(item);
    // this.subject$.next(this.medias);

    this.mediaFireSV.deleteMedia(item.id);

  }

  deleteItems(medias: Media[]) {
    // medias.forEach(i => this.deleteItem(i));
  }

  onFilterChange(value: string) {
    if (!this.dataSource) {
      return;
    }
    value = value.trim();
    value = value.toLowerCase();
    this.dataSource.filter = value;
  }

  toggleColumnVisibility(column, event) {
    event.stopPropagation();
    event.stopImmediatePropagation();
    column.visible = !column.visible;
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => this.selection.select(row));
  }

  trackByProperty<T>(index: number, column: TableColumn<T>) {
    return column.property;
  }

  onLabelChange(change: MatSelectChange, row: Media) {
    const index = this.medias.findIndex(c => c === row);
    this.medias[index].labels = change.value;
    this.subject$.next(this.medias);
  }


  ngOnDestroy() {
    if (this.mediasSub != null) {
      this.mediasSub.unsubscribe();
    }
  }

}
