import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PharmaciesPage } from './pharmacies';
import { PharmaciesService } from './pharmacies.service'
import { LaunchNavigator } from '@ionic-native/launch-navigator';

@NgModule({
  declarations: [
    PharmaciesPage,
  ],
  imports: [
    IonicPageModule.forChild(PharmaciesPage),
  ],
  providers:[PharmaciesService, LaunchNavigator]
})
export class PharmaciesPageModule {}
