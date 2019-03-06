import { Injectable } from '@angular/core';
import { Http, RequestOptions, URLSearchParams, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import { Util } from './util';


/**
 * Api is a generic REST Api handler. Set your API url first.
 */
 @Injectable()
 export class Api {


   constructor(
     public http: Http,
     public util: Util,

   ) {


   }

   get(endpoint: string, params?: any, options?: RequestOptions) {
     if (!options) {
       options = new RequestOptions();
     }

     const token = this.util.getPreference(this.util.constants.token);
     if (token) {
       const headers = new Headers();
       headers.append('Authorization', 'Bearer ' + token);
       options.headers = headers;
     }

     // Support easy query params for GET requests
     if (params) {
       const p = new URLSearchParams();
       for(const k in params) {
         p.set(k, params[k]);
       }
       // Set the search field if we have params and don't already have
       // a search field set in options.
       options.search = !options.search && p || options.search;
     }
     if (endpoint.includes('http')) {
       return this.http.get(endpoint, options);
     }else {
       return this.http.get(this.util.url + endpoint, options);
     }
   }

   post(endpoint: string, body: any, options?: RequestOptions) {
     const token = this.util.getPreference(this.util.constants.token);
     if (token) {
       if (!options) {
         options = new RequestOptions();
       }

       const headers = new Headers();
       headers.append('Authorization', 'Bearer ' + token);
       options.headers = headers;
     }
     if (endpoint.includes('http')) {
       return this.http.get(endpoint, options);
     } else {
       return this.http.post(this.util.url + endpoint, body, options);
     }
   }

   put(endpoint: string, body: any, options?: RequestOptions) {
     if (endpoint.includes('http:')) {
       return this.http.get(endpoint, options);
     } else {
       return this.http.put(this.util.url + endpoint, body, options);
     }
   }

   delete(endpoint: string, params?: any,options?: RequestOptions) {
     if (!options) {
       options = new RequestOptions();
     }

     const token = this.util.getPreference(this.util.constants.token);
     if (token) {
       const headers = new Headers();
       headers.append('Authorization', 'Bearer ' + token);
       options.headers = headers;
     }
     if (endpoint.includes('http:')) {
       return this.http.get(endpoint, options);
     } else {
       return this.http.delete(this.util.url + endpoint, options);
     }
   }

   patch(endpoint: string, body: any, options?: RequestOptions) {
     if (endpoint.includes('http:')) {
       return this.http.get(endpoint, options);
     } else {
       return this.http.put(this.util.url + endpoint, body, options);
     }
   }

 }
