import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import {
    GoogleMaps,
    GoogleMap,
    LatLng
} from '@ionic-native/google-maps';

import { LaunchNavigator } from '@ionic-native/launch-navigator';
import { PharmaciesListService } from './pharmaciesList.service';
import { Pharmacy } from '../../models/pharmacy';
import { Notifications } from '../../providers/providers'

import { AndroidPermissions } from '@ionic-native/android-permissions';

@IonicPage()
@Component({
    selector: 'page-pharmacies-list',
    templateUrl: 'pharmaciesList.html',
})
export class PharmaciesListPage {
    lat: any;
    lng: any;
    map: GoogleMap;
    State:string;
    Zoom:number = 0;
    CurrentLatLng:LatLng = new LatLng(-1.664823,-78.647734);
    pharmacies:Array<Pharmacy>;

    constructor(private launchNavigator: LaunchNavigator, private notifications:Notifications, private androidPermissions: AndroidPermissions, private pharmaciesListService:PharmaciesListService, private googleMaps: GoogleMaps, private geolocation: Geolocation, public navCtrl: NavController, public navParams: NavParams) {
        this.State = (this.navParams.get("State") == null || this.navParams.get("State") == undefined)?"Opened":this.navParams.get("State");
        this.Zoom = (this.navParams.get("Zoom") == null || this.navParams.get("Zoom") == undefined)?1:this.navParams.get("Zoom");
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad pharmacies list');
        this.getPosition();
    }
    loadPharmacies(){
        var now = new Date();
        var method = (this.State == "Opened")?"getAllOpenNearlyPharmacies":(this.State == "Turn")?"getAllTurnNearlyPharmacies":""
        this.notifications.ShowLoading("Cargando Farmacias ...");
        this.pharmaciesListService[method](`${this.CurrentLatLng.lat.toString()}/${this.CurrentLatLng.lng.toString()}/${this.Zoom}${(this.State == "Opened")?`/${now.getHours()}:${now.getMinutes()}`:""}`).then((data:Array<Pharmacy>)=>{
            this.pharmacies = new Array<Pharmacy>();
            data.forEach(pharmacy => {
                this.pharmacies.push(pharmacy);
            })
            this.notifications.HideLoading();
        },(error)=>{
            this.notifications.HideLoading();
            this.notifications.ShowAlert("Farmacias",error,null);
        });

    }

    getPosition(): Promise<boolean> {
        console.log("Get Position");
        return new Promise((resolve, reject) => {
            this.geolocation.getCurrentPosition().then((resp) => {
                // resp.coords.latitude
                // resp.coords.longitude
                console.log("Get Position success: ", resp);
                var position = new LatLng(resp.coords.latitude, resp.coords.longitude);
                this.CurrentLatLng = position
                this.loadPharmacies();
                resolve();
            }).catch((error) => {
                console.log('Error getting location', error);
                reject();
            });
        });
    }

    goNavigator(lat, lng){
        this.launchNavigator.navigate(`${lat}, ${lng}`,{
            start:`${this.CurrentLatLng.lat.toString()}, ${this.CurrentLatLng.lng.toString()}`
        });
    }
}