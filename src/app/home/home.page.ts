import { Component } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularDelegate, NavController } from '@ionic/angular';
import { AngularFireAuth } from '@angular/fire/auth';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  email:string;
  pwd:string;

  constructor(public fs: AngularFirestore, public af: AngularFireAuth, public nav : NavController, private authService: AuthService) {}

  login(){
    this.af.auth.signInWithEmailAndPassword(this.email,this.pwd).then(()=>{
      this.nav.navigateRoot('main')
    }).catch(err=>{
      alert(err.message)
    })
  }
  goto_singup(){
    console.log("jj")
    this.nav.navigateForward('signup')
  }
  ano(){
    this.authService.loginWithTwitter();
  }
}
