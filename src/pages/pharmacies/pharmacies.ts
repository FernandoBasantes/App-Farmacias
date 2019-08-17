import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, DateTime } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import { LaunchNavigator } from '@ionic-native/launch-navigator';
import {
    GoogleMaps,
    GoogleMap,
    GoogleMapsEvent,
    GoogleMapOptions,
    CameraPosition,
    MarkerOptions,
    Marker,
    LatLng,
    HtmlInfoWindow,
    LatLngBounds
} from '@ionic-native/google-maps';
import { PharmaciesService } from './pharmacies.service';
import { Pharmacy } from '../../models/pharmacy';
import { Notifications } from '../../providers/providers'

import { AndroidPermissions } from '@ionic-native/android-permissions';

@IonicPage()
@Component({
    selector: 'page-pharmacies',
    templateUrl: 'pharmacies.html',
})
export class PharmaciesPage {
    lat: any;
    lng: any;
    map: GoogleMap;
    State:string;
    CurrentLatLng:LatLng = new LatLng(-1.664823,-78.647734);
    zoom:number = 1;
    currentMarkers:Array<any> = new Array<any>();
    bounds = new LatLngBounds();
    currentChangeRange:boolean = false;

    constructor(private launchNavigator:LaunchNavigator, private notifications:Notifications, private androidPermissions: AndroidPermissions, private pharmaciesService:PharmaciesService, private googleMaps: GoogleMaps, private geolocation: Geolocation, public navCtrl: NavController, public navParams: NavParams) {
        this.State = (this.navParams.get("State") == null || this.navParams.get("State") == undefined)?"Opened":this.navParams.get("State");
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad pharmacies');
        this.loadMap();
    }

    loadMap() {

        let mapOptions: GoogleMapOptions = {
            camera: {
                target: {
                    lat: 43.0741904,
                    lng: -89.3809802
                },
                tilt: 30,
                zoom:20
            },
            controls:{
                zoom:true,
                indoorPicker:false,
                mapToolbar:false
            }
        };

        this.map = GoogleMaps.create('map_canvas', mapOptions);
        // Wait the MAP_READY before using any methods.
        this.map.one(GoogleMapsEvent.MAP_READY)
            .then(() => {
                // Now you can use all methods safely.
                var permission = this.androidPermissions.PERMISSION.ACCESS_FINE_LOCATION;
                this.androidPermissions.checkPermission(permission).then(
                    result => {
                        console.log('Has permission?', result.hasPermission)
                        if (!result.hasPermission) {
                            this.androidPermissions.requestPermission(permission).then(()=>{
                                this.getPosition();
                            })
                        }else{
                            this.getPosition();
                        }
                    },
                    err => {
                    console.log(err);
                    this.androidPermissions.requestPermission(permission)
                    }
                );
                
            })
            .catch(error => {
                console.log(error);
            });

    }

    getPosition(): Promise<boolean> {
        console.log("Get Position");
        return new Promise((resolve, reject) => {
            this.geolocation.getCurrentPosition().then((resp) => {
                // resp.coords.latitude
                // resp.coords.longitude
                console.log("Get Position success: ", resp);
                var position = new LatLng(resp.coords.latitude,resp.coords.longitude);
                this.map.moveCamera({
                    target: position
                });
                this.map.addMarker({
                    title: 'Mi Ubicación',
                    icon: 'red',
                    animation: 'DROP',
                    position: position
                }).then(marker => {
                    marker.on(GoogleMapsEvent.MARKER_CLICK)
                        .subscribe(() => {
                        
                        });
                    });
    
                this.CurrentLatLng = position
                
                this.bounds = new LatLngBounds();
                this.bounds.extend(this.CurrentLatLng);
    
                this.map.setMyLocationEnabled(true);
                this.loadMarkers();
                resolve();
            }).catch((error) => {
                console.log('Error getting location', error);
                reject();
            });
        });
    }

    loadMarkers(){
        var now = new Date();
        var method = (this.State == "Opened")?"getAllOpenNearlyPharmacies":(this.State == "Turn")?"getAllTurnNearlyPharmacies":""
        this.pharmaciesService[method](`${this.CurrentLatLng.lat.toString()}/${this.CurrentLatLng.lng.toString()}/${this.zoom}${(this.State == "Opened")?`/${now.getHours()}:${now.getMinutes()}`:""}`).then((data:Array<Pharmacy>)=>{
            
            data.forEach(pharmacy => {
                let htmlInfoWindow = new HtmlInfoWindow();
                let frame: HTMLElement = document.createElement('div');
                var buttonNav:HTMLElement = document.createElement('div');
                buttonNav.classList.add("buttonLocateMap");
                buttonNav.innerHTML = '<img src="assets/img/navigator.png" alt="">';
                buttonNav.addEventListener("click",this.goNavigator.bind(this, pharmacy.latitud, pharmacy.longitud));
                frame.innerHTML = [
                `<div style="width:200px; margin: 0 auto;"><img style="width: 100%" src="http://farmaciappriobamba.000webhostapp.com/modules/medicines/foto/${pharmacy.foto}"></div>`,
                `<h3>${pharmacy.nombre}</h3>`,
                `<strong>Dir: </strong>${pharmacy.direccion}`,
                `<br><strong>Teléfono: </strong>${pharmacy.telefono}`,
                `<br><strong>Hora Inicio: </strong>${pharmacy.horaInicioHorario}`,
                `&nbsp;&nbsp;<strong>Hora Fin: </strong>${pharmacy.horaFinHorario}`,
                `<br><strong>Distancia: </strong>${pharmacy.distancia} Km`
                ].join("");
                frame.appendChild(buttonNav);
                frame.getElementsByTagName("img")[0].addEventListener("click", () => {
                htmlInfoWindow.setBackgroundColor('white');
                });
                htmlInfoWindow.setContent(frame, {width: "280px"});
                
                this.map.addMarker({
                    //title: pharmacy.nombre,
                    icon: 'http://farmaciappriobamba.000webhostapp.com/images/marcadorFarmaciapp.png',
                    animation: 'DROP',
                    position: {
                      lat: parseFloat(pharmacy.latitud),
                      lng: parseFloat(pharmacy.longitud)
                    }
                })
                .then(marker => {
                    marker.on(GoogleMapsEvent.MARKER_CLICK)
                    .subscribe(() => {
                        htmlInfoWindow.open(marker);
                    });
                });

                this.bounds.extend(new LatLng(parseFloat(pharmacy.latitud),parseFloat(pharmacy.longitud)));
            })
            
            this.map.animateCamera({
                target:this.bounds
            }).then(()=>{
                this.currentChangeRange = false;
            });
        },(error)=>{
            this.notifications.ShowAlert("Farmacias",error,null);
            this.currentChangeRange = false;
        });

    }

    morePharmacies(){
        this.navCtrl.push('PharmaciesListPage',{
            State:this.State,
            Zoom:this.zoom
        });
    }

    zoomChange(){
        if(!this.currentChangeRange){
            this.currentChangeRange = true;
            this.map.clear();
            this.getPosition();
        }
    }

    centerLocation(){
        this.notifications.ShowLoading("Obteniendo Posicion Actual ...")
        if(!this.currentChangeRange){
            this.currentChangeRange = true;
            this.map.clear();
            this.getPosition().then(()=>{
                this.notifications.HideLoading();
            },()=>{
                this.notifications.HideLoading();
            });
        }
    }

    goNavigator(lat, lng){
        this.launchNavigator.navigate(`${lat}, ${lng}`,{
            start:`${this.CurrentLatLng.lat.toString()}, ${this.CurrentLatLng.lng.toString()}`
        });
    }
}