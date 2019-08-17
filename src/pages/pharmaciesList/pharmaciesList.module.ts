import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PharmaciesListPage } from './pharmaciesList';
import { PharmaciesListService } from './pharmaciesList.service'
import { LaunchNavigator } from '@ionic-native/launch-navigator'

@NgModule({
  declarations: [
    PharmaciesListPage,
  ],
  imports: [
    IonicPageModule.forChild(PharmaciesListPage),
  ],
  providers:[PharmaciesListService,LaunchNavigator]
})
export class PharmaciesListPageModule {}
