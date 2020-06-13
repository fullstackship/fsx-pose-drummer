import { AppLayoutModule } from './shared/components/app-layout/app-layout.module';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SharedModule } from './shared';
import { environment } from '../environments/environment';
import { HomeLayoutComponent } from './pages/layout/home-layout/home-layout.component';
import { HttpClientModule } from '@angular/common/http';
import { AppSettings } from './app.settings';
import { CoreModule } from './core/core.module';
//Firebase
import { AngularFireModule } from '@angular/fire';


@NgModule({
  declarations: [
    AppComponent,
    HomeLayoutComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    CoreModule,
    AppLayoutModule,
    SharedModule,

    //Firebase
    AngularFireModule.initializeApp(environment.firebase, 'App'),

  ],
  providers: [
    AppSettings
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
