import { Component, ViewChild } from '@angular/core';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { TranslateService } from '@ngx-translate/core';
import { Config, Nav, Platform } from 'ionic-angular';

import { Settings, AuthData, Notifications } from '../providers/providers';

import { AndroidPermissions } from '@ionic-native/android-permissions';

import { MainPage } from '../pages/pages';

@Component({
  template: `<ion-menu [content]="content">
    <ion-header>
      <ion-toolbar color="antSiemb_primary1">
        <ion-title>FarmaciApp</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <ion-list>
        <ion-item menuClose *ngFor="let p of pages" (click)="openPage(p)">
          <ion-grid>
              <ion-row>
                  <ion-col col-3>
                      <ion-icon name="{{p.Icon}}"></ion-icon>
                  </ion-col>
                  <ion-col col-9>
                      {{p.title}}
                  </ion-col>
              </ion-row>
          </ion-grid>
        </ion-item>
      </ion-list>
    </ion-content>

  </ion-menu>
  <ion-nav #content [root]="rootPage"></ion-nav>`
})
export class MyApp {
  rootPage = MainPage;
  showBeacon = false;
  @ViewChild(Nav) nav: Nav;

  user:any;

  pages: any[] = [
    { title: 'Farmacias Abiertas', Icon:"medkit", component: 'PharmaciesPage', params:{ State:"Opened"} },
    { title: 'Farmacias de Turno', Icon:"medkit", component: 'PharmaciesPage', params:{ State:"Turn"} },
    { title: 'Ayuda', Icon:"help-circle", component: 'HelpPage' },
    { title: 'Soporte', Icon:"settings", component: 'SettingsPage' }
  ]

  constructor(private androidPermissions: AndroidPermissions, private notifications: Notifications, private translate: TranslateService, private auth:AuthData, platform: Platform, settings: Settings, private config: Config, private statusBar: StatusBar, private splashScreen: SplashScreen) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });

    var permissions: string[] = [
      this.androidPermissions.PERMISSION.FOREGROUND_SERVICE,
      this.androidPermissions.PERMISSION.CAMERA,
      this.androidPermissions.PERMISSION.ACCESS_FINE_LOCATION,
      this.androidPermissions.PERMISSION.ACCESS_COARSE_LOCATION
    ]

    permissions.forEach(permission => {
      this.androidPermissions.checkPermission(permission).then(
        result => {
          console.log('Has permission?', result.hasPermission)
          if (!result.hasPermission) {
            this.androidPermissions.requestPermission(permission)
          }
        },
        err => {
          console.log(err);
          this.androidPermissions.requestPermission(permission)
        }
      );
    });

    this.initTranslate();
  }

  initTranslate() {
    // Set the default language for translation strings, and the current language.
    this.translate.setDefaultLang('en');

    if (this.translate.getBrowserLang() !== undefined) {
      this.translate.use(this.translate.getBrowserLang());
    } else {
      this.translate.use('en'); // Set your language here
    }

    this.translate.get(['BACK_BUTTON_TEXT']).subscribe(values => {
      this.config.set('ios', 'backButtonText', values.BACK_BUTTON_TEXT);
    });
  }

  ngAfterViewInit() {
    // this.nav.viewDidEnter.subscribe((data) => {
    //   var view = data.component.name;
    //   var aus = this.auth.verifyLogin().subscribe(data => {
    //     if (view != "LoginPage" && view != "SignUpPage") {
    //       if (data) {
    //         if (!data.isAnonymous) {
    //           this.user = JSON.parse(localStorage["Userdata"]);
    //         }
    //         else {
    //           this.nav.setRoot("LoginPage");
    //         }
    //       } else {
    //         this.nav.setRoot("LoginPage");
    //       }
    //     } else {
    //       if (data) {
    //         if (!data.isAnonymous) {
    //           this.user = JSON.parse(localStorage["Userdata"]);
    //           this.nav.setRoot(MainPage);
    //         }
    //       }
    //     }
    //     aus.unsubscribe();
    //   });

    // })

  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    if(page.params != null){
      this.nav.setRoot(page.component,page.params);
    }else{
      this.nav.setRoot(page.component);
    }
    
  }
}
