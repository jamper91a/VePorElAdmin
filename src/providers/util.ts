
import { Injectable } from '@angular/core';
import {environment} from '../environments/environment';
/**
 * Created by Usuario on 02/06/2017.
 */
declare var $:any;
@Injectable()
export class Util {

  public constants;
  public url: string;
  public google_api_key: string;
  public payu_api_key: string;
  public payu_merchant_id: string;
  public payu_account_id: string;
  public payu_test: string;
  public redirectUrl: string;
  public confirmationUrl: string;
  public formPayUUrl: string;
  constructor(
  ) {
    this.constants = {
      logged: 'logged',
      tutorial: 'tutorial',
      user: 'user',
      token: 'token',
      latitude: 'latitude',
      longitude: 'longitude',
      type_find_promotio: 'type_find_promotio',
      find_promotio_by_location: 'find_promotio_by_location',
      find_promotion_by_subcategory: 'find_promotion_by_subcategory',
      category_id: 'category_id',
      city_name: 'city_name',
      address: 'address',
      subcategory_id: 'subcategory_id',
      offer_id: 'offer_id',
      branch_id: 'branch_id',
      offers_user: 'offers_user',
      offer: 'offer',
      kind_map: 'kind_map',
      map_offer: 'map_offer',
      map_branch: 'map_branch',
      branch: 'branch',
      company: 'company',
      country_code: 'country_code',
      find_promotion_by_user_id: 'find_promotion_by_user_id'
    };
    //this.url = 'https://backend.veporel.com.co:85/';
    this.url = environment.apiUrl;
    this.google_api_key = 'AIzaSyDvZFVr2cdCCVyLmMBg0-8MaJTJDaHD8pE';
    this.payu_api_key = "9f2SQhIj8Gyhn4357tgFQSABy8";
    this.payu_merchant_id = "672895";
    this.payu_account_id = "675567";
    this.payu_test = "1";
    /*
    this.payu_api_key = "4Vj8eK4rloUd272L48hsrarnUA";
    this.payu_merchant_id = "508029";
    this.payu_account_id = "512321";
    this.payu_test = "1";*/

    //this.formPayUUrl = "https://sandbox.gateway.payulatam.com/ppp-web-gateway/";
    this.formPayUUrl = "https://gateway.payulatam.com/ppp-web-gateway";
    
    this.confirmationUrl = "https://backend.veporel.com.co:85/transaction/save_state";
  }

  public savePreference(key: string, value: any) {
    localStorage.setItem(key, value);
  }
  public getPreference(key): any {
    var value = localStorage.getItem(key);
    return value;
  }
  public removePreference(key):void{
    localStorage.removeItem(key);
  }

  public clearAllData() {
    localStorage.clear();
  }

  public show_toast(message: string, type?:string, from?: string, align?:string) {
    // this.translateService.get(message).subscribe((value) => {
      if (!from)
        from= 'bottom';
      if (!align)
        align= 'center';
      if (!type)
        type = 'success';
      $.notify({
        icon: "add_alert",
        message: message

      },{
        type: type,
        timer: 4000,
        placement: {
          from: from,
          align: align
        }
      });


  }

  public show_dialog(message: string) {
    // const loading = this.loadingCtrl.create({
    //   content: message,
    //   dismissOnPageChange: false
    // });
    // loading.present();
    // return loading;

  }

  public isLoggedIn(){
    if(this.getPreference(this.constants.logged)=="true"){
      return true;
    }else{
      return false;
    }
  }
}
