import { Injectable } from '@angular/core';
//import {Observable} from 'rxjs/Observable';
import { Api } from '../../providers/providers';
import { Pharmacy } from '../../models/pharmacy';
import {Headers} from '@angular/http';
import 'rxjs/add/operator/map';


@Injectable()
export class PharmaciesService {

        constructor(private api:Api) {
         
    }
    
    public getAllOpenNearlyPharmacies(params) {
        return new Promise((resolve, reject)=>{

            var obs = this.api.get(`GetAll/${params}`).subscribe((data: any) => {
                obs.unsubscribe();
                if(data.ERROR != undefined){
                    reject(data.ERROR)
                }else{
                    resolve(data);
                }
            },(error) => {
                obs.unsubscribe();
                reject(error);
            });
            
        });
    }

    public getAllTurnNearlyPharmacies(params) {
        return new Promise((resolve, reject)=>{

            var obs = this.api.get(`GetAllTurno/${params}`).subscribe((data: any) => {
                obs.unsubscribe();
                if(data.ERROR != undefined){
                    reject(data.ERROR)
                }else{
                    resolve(data);
                }
            },(error) => {
                obs.unsubscribe();
                reject(error);
            });
            
        });
    }
}