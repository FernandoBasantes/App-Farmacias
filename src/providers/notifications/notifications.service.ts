import { LoadingController, AlertController, ToastController } from 'ionic-angular';
import { Injectable } from '@angular/core';

@Injectable()
export class Notifications {

    constructor(private loadingController: LoadingController, private alertController: AlertController, private toastController: ToastController) {
    }

    private loading;
    public ShowLoading = (Text) => {
        this.loading = this.loadingController.create({
            content: Text
        });

        this.loading.present();

        setTimeout(() => {

        }, 5000);
    }

    public HideLoading = () => {
        if (this.loading != null && this.loading != undefined) {
            this.loading.dismiss();
        }
    }

    private Alert;
    public ShowAlert = (Title, Message, handler) => {
        this.Alert = this.alertController.create({
            title: Title,
            subTitle: Message,
            buttons: [
                {
                    text: 'Ok',
                    handler: handler
                }
            ]
        });

        this.Alert.present();
    }

    public ShowConfirm = (Title, Message, handlerSi, handlerNo) => {
        this.Alert = this.alertController.create({
            title: Title,
            subTitle: Message,
            buttons: [
                {
                    text: 'Sí',
                    handler: handlerSi
                },
                {
                    text: 'No',
                    handler: handlerNo
                }
            ]
        });

        this.Alert.present();
    }

    public ShowToast = (Message: string, Duration: number, _Position:string, CloseButtonText?:string) => {
        let toast;
        if(CloseButtonText == null || CloseButtonText == undefined){
            toast = this.toastController.create({
                message: Message,
                position: _Position,
                duration: 3000
            });
        }else{
            toast = this.toastController.create({
                message: Message,
                position: _Position,
                showCloseButton: true,
                closeButtonText: 'Ok'
            });
        }
        toast.present();
    }
}