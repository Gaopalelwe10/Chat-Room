import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { NavController, AlertController } from '@ionic/angular';
import { AngularFireAuth } from '@angular/fire/auth';
import { auth } from 'firebase';
import { promise } from 'protractor';
import * as firebase from "firebase/app"
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private angularfirestore: AngularFirestore, private nacCtrl: NavController, public afAuth: AngularFireAuth , private alertCtrl :AlertController) { 
    afAuth.auth.onAuthStateChanged((user)=>{
      if(user){
        this.nacCtrl.navigateRoot("main");
      }else{
        this.nacCtrl.navigateRoot("");
      }
    })
  }

  async  loginWithTwitter(): Promise <firebase.auth.UserCredential> {
    return await firebase.auth().signInAnonymously();
  }
}
