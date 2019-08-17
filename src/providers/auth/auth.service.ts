import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';

@Injectable()

export class AuthData {
  fireAuth: any;
  user: Observable<firebase.User>;

  constructor(public afAuth: AngularFireAuth) {
     this.user = afAuth.authState;
  }

  verifyLogin(){
      return this.user;
  }

  login(Email:string, Password:string){
      return this.afAuth.auth.signInWithEmailAndPassword(Email, Password);
    //   this.afAuth.auth.signInWithPopup(new firebase.auth.EmailAuthProvider());
  }
  
  signUp(Email:string, Password:string){
    return this.afAuth.auth.createUserWithEmailAndPassword(Email, Password);
  }

  facebookLogin(){
    return this.afAuth.auth.signInWithRedirect(new firebase.auth.FacebookAuthProvider());
  }

  getUserInfo():Promise<any>{
    return new Promise((resolve, reject)=>{
      this.user.subscribe((data)=>{
        
      });
    });
  }
  
  logout() {
    this.afAuth.auth.signOut();
  }
  
}
// TODO: Add scope for social login functions
// end file
