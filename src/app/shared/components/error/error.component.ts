import { Component, OnInit, Inject } from '@angular/core'
import { MAT_DIALOG_DATA } from '@angular/material/dialog'


@Component({
	selector: 'app-error',
	templateUrl: './error.component.html',
	styleUrls: [ './error.component.scss' ]
})
export class ErrorComponent {
	// data: { message: string };
	// private errorSub: Subscription;
	constructor(@Inject(MAT_DIALOG_DATA) public data: { message: string }) {}
	// constructor(private errorService: ErrorService) {}

	// ngOnInit() {
	//   this.errorSub = this.errorService.getErrorListener().subscribe(message => {
	//     this.data = { message: message };
	//   });
	// }

	// onHandleError() {
	//   this.errorService.handleError();
	// }

	// ngOnDestroy() {
	//   this.errorSub.unsubscribe();
	// }
}
