import { Injectable } from '@angular/core';

@Injectable()
export class Permissions{
    private rol:any = {};
    constructor() {
        
    }

    public verifyPermision(Module:string, Action:string):boolean{
        // var stringRol = localStorage["Rol"];
        // if(stringRol != null && stringRol != undefined && stringRol != ""){
        //     this.rol = JSON.parse(stringRol);
            
        //     var permisos = this.rol.Permissions_Roles;
        //     var modulo = permisos.filter(m => m.Permissions.Modules.Name == Module);
    
        //     if(modulo.length == 0){
        //         return false;
        //     }else{
        //         return (modulo[0].Permissions[Action] == null || modulo[0].Permissions[Action] == undefined)?false:modulo[0].Permissions[Action];
        //     }
        // }
        return true;
    }
}