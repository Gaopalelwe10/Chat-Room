import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit {
  email:string;
  pwd:string;
  username: string;
  constructor(public fs: AngularFirestore, public af: AngularFireAuth, public nav : NavController) {}

  ngOnInit() {
  }
  signup(){
    this.af.auth.createUserWithEmailAndPassword(this.email,this.pwd).then(()=>{
      localStorage.setItem('userid', this.af.auth.currentUser.uid);
      this.af.auth.currentUser.updateProfile({
        displayName:this.username,
        photoURL:''
      }).then(()=>{
        this.nav.navigateRoot('main');
      }).catch(err=>{
        alert(err.message)
      })
    }).catch(err=>{
      alert(err.message)
    })
  }

  goto_login(){
    this.nav.navigateForward('home')
  }
}
