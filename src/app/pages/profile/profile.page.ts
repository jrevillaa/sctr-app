import { Component, OnInit } from "@angular/core";
import { AuthService } from "src/app/services/auth.service";
import { UserService } from "src/app/services/user.service";
import { ToastController } from "@ionic/angular";
import { LoadingController } from "@ionic/angular";
import { Router } from "@angular/router";

@Component({
  selector: "app-profile",
  templateUrl: "./profile.page.html",
  styleUrls: ["./profile.page.scss"]
})
export class ProfilePage implements OnInit {
  userInfo: object;
  file: File;
  loading: any;

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private router: Router,
    public toastController: ToastController,
    private loadingController: LoadingController
  ) {}

  ngOnInit() {
    this.userInfo = this.authService.getObject("user");
  }

  async changeListener($event) {
    console.log($event);
    this.file = await $event.target.files[0];
    this.saveProfilePhoto(this.file);
  }

  saveProfilePhoto(file) {
    this.userService.uploadImage(file).subscribe(res => {
      console.log(res["data"]);
      this.updateUserPhoto(res["data"]);
    });
  }

  updateUserPhoto(file) {
    this.authService.destroy("user");
    this.showLoading();

    this.userService.updateUser(file).subscribe(
      async res => {
        this.loading.dismiss();
        console.log(res["data"]);
        await this.authService.setObject("user", res["data"]);
        this.presentToastWithOptions();
        this.ngOnInit();
      },
      err => {
        console.log(err);
      }
    );
  }
  async presentToastWithOptions() {
    const toast = await this.toastController.create({
      header: "¡Listo!",
      message: "Has actualizado tu foto de perfil.",
      position: "bottom",
      duration: 3000,
      mode: "ios",
      buttons: [
        {
          text: "Cerrar",
          role: "cancel",
          handler: () => {
            console.log("Cancel clicked");
          }
        }
      ]
    });
    toast.present();
  }

  async showLoading() {
    this.loading = await this.loadingController.create({
      message: "Por favor, espere..."
    });

    this.loading.present();
  }
  navigateToHome() {
    this.router.navigate(["/home"]);
  }
}
