import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { NavController, PopoverController } from '@ionic/angular';


import {IonContent} from "@ionic/angular";
import { PopoverPage } from '../popover/popover.page';

import { File } from '@ionic-native/file/ngx';
import { FileChooser } from '@ionic-native/file-chooser/ngx';
import { FilePath } from '@ionic-native/file-path/ngx';
import * as firebase from 'firebase';
import * as firestore from 'firebase';

@Component({
  selector: 'app-main',
  templateUrl: './main.page.html',
  styleUrls: ['./main.page.scss'],
})
export class MainPage implements OnInit {

  text:string;
  chatRef:any;
  uid: string;
   skel=false;

   nativepath: any;
   firestore = firebase.storage();

  @ViewChild('scrollArea', {static: false}) content: IonContent;
  constructor(public fs: AngularFirestore, public af: AngularFireAuth, public nav : NavController, private popoverController: PopoverController, public filechooser: FileChooser) {
    // this.uid=localStorage.getItem('userid');
    this.uid=this.af.auth.currentUser.uid;
    this.chatRef=this.fs.collection('chats', ref=>ref.orderBy('Timestamp')).valueChanges();
    // if(this.content.ionScroll) this.content.scrollToBottom(0);
    this.scorllTo();
  }

  ngOnInit() {
    this.scorllTo();
  }


 async openPopover(ev: any){
  const popover= await this.popoverController.create({
    component: PopoverPage,
    event: ev,
    translucent: true
  });
  return await popover.present();
}

  scorllTo(){
    setTimeout(()=>{
      this.skel=true;
      this.content.scrollToBottom();
    },1000);
    
  }

  send(){
    if(this.text !=''){
      this.fs.collection('chats').add({
        Name:this.af.auth.currentUser.displayName,
        Message:this.text,
        Userid: this.af.auth.currentUser.uid,
        Timestamp:firestore.firestore.FieldValue.serverTimestamp(),
      });
      this.content.scrollToBottom();
      this.text="";
      
    }
  }
  sendPicMsg() {
    var promise = new Promise((resolve, reject) => {
        this.filechooser.open().then((url) => {
          (<any>window).FilePath.resolveNativePath(url, (result) => {
            this.nativepath = result;
            (<any>window).resolveLocalFileSystemURL(this.nativepath, (res) => {
              res.file((resFile) => {
                var reader = new FileReader();
                reader.readAsArrayBuffer(resFile);
                reader.onloadend = (evt: any) => {
                  var imgBlob = new Blob([evt.target.result], { type: 'image/jpeg' });
                  var uuid = this.guid();
                  var imageStore = this.firestore.ref('/picmsgs').child(firebase.auth().currentUser.uid).child('picmsg' + uuid);
                  imageStore.put(imgBlob).then((res) => {
                      resolve(res.downloadURL);
                    }).catch((err) => {
                        reject(err);
                    })
                  .catch((err) => {
                    reject(err);
                  })
                }
              })
            })
          })
      })
    })    
     return promise;   
  }

  guid() {
    function s4() {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
      s4() + '-' + s4() + s4() + s4();
  }

  logout(){
    this.af.auth.signOut().then((success)=>{
      console.log(success);
      console.log("success");
      this.nav.navigateRoot("home");
    }).catch((error)=>{
      console.log(error)
    })
  }
}
