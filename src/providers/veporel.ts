import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Api } from './api';
import { Util } from './util';
import 'rxjs/Rx';


@Injectable()
export class VePorEl {


	constructor(
		public http: Http,
		public api: Api,
		public util: Util,
		) {

	}

	login(body:any){
		const seq = this.api.post('login_company', body).share();
		seq
		.subscribe(res => {
			return res;
		}, err => {
			return err;
		});
		return seq;
	}

	register(formData:any){
		const seq = this.api.post('companies/create_with_user', formData).share();
		seq
		.map(res => res.json())
		.subscribe(res => {
			return res;
		}, err => {
			console.error('ERROR', err);
		});
		return seq;
	}

	get_location(){
		const seq = this.api.get('https://freegeoip.net/json/').share();
		seq
		.map(res => res.json())
		.subscribe(data => {

			return data;
		}, err => {
			console.error('ERROR', err);
		});
		return seq;
	}

	create_branch(branch){
		const seq = this.api.post('branchs/create_branch', branch).share();
		seq
		.subscribe(res => {
			return res;
		}, err => {
			console.error('ERROR', err);
		});
		return seq;
	}

	get_brachs(){
		const seq = this.api.post('branchs/find_by_company_id', {}).share();
		seq
		.subscribe(res => {
			return res;
		}, err => {
			console.error('ERROR', err);
		});
		return seq;
	}

	delete_branch(branch_id){
		let body={
			id:branch_id
		};
		const seq = this.api.post('branchs/delete', body).share();
		seq
		.subscribe(res => {
			return res;
		}, err => {
			console.error('ERROR', err);
		});
		return seq;
	}

	get_branch(branc_id:number){
		let body={
			id:branc_id
		};
		const seq = this.api.post('branchs/find_by_id', body).share();
		seq
		.subscribe(res => {
			return res;
		}, err => {
			return err;
		});
		return seq;
	}
	save_available_state(user:any){
		const seq = this.api.post('user/save_user', user).share();
		seq
		.subscribe(res => {
			return res;
		}, err => {
			return err;
		});
		return seq;
	}
	create_transaction(transaction:any){
		const seq = this.api.post('transaction/create_transaction', transaction).share();
		seq
		.subscribe(res => {
			return res;
		}, err => {
			return err;
		});
		return seq;
	}
	get_available_state(){
		const seq = this.api.post('user/find_user',{}).share();
		seq
		.subscribe(res => {
			return res;
		}, err => {
			return err;
		});
		return seq;
	}

	edit_branch(branch:any){
		const seq = this.api.post('branchs/edit', branch).share();
		seq
		.subscribe(res => {
			return res;
		}, err => {
			return err;
		});
		return seq;
	}

	create_offer(offer:any){

		const seq = this.api.post('offers/', offer).share();
		seq
		.subscribe(res => {
			return res;
		}, err => {
			return err;
		});
		return seq;
	}

	get_offers(){
		const seq = this.api.get('offers/find_by_company_id').share();
		seq
		.subscribe(res => {
			return res;
		}, err => {
			return err;
		});
		return seq;
	}

	get_banners_company(){
		const seq = this.api.post('banners/find_banners_company',{}).share();
		seq
		.subscribe(res => {
			return res;
		}, err => {
			return err;
		});
		return seq;
	}

	get_companies(){
		const seq = this.api.post('companies/findCompanies',{}).share();
		seq
		.subscribe(res => {
			return res;
		}, err => {
			return err;
		});
		return seq;
	}

	delete_offer(offer_id:number){
		let body={
			id: offer_id
		};
		const seq = this.api.post('offers/delete', body).share();
		seq
		.subscribe(res => {
			return res;
		}, err => {
			return err;
		});
		return seq;
	}
	delete_banner(bannerId:number){
		let body={
			id: bannerId
		};
		const seq = this.api.post('banners/delete', body).share();
		seq
		.subscribe(res => {
			return res;
		}, err => {
			return err;
		});
		return seq;
	}

	get_offers_user(){
		const seq = this.api.get('offersuser/find_by_company_id', {}).share();
		seq
		.subscribe(res => {
			return res;
		}, err => {
			return err;
		});
		return seq;
	}

	create_banner(offer:any){

		const seq = this.api.post('banners/add', offer).share();
		seq
		.subscribe(res => {
			return res;
		}, err => {
			return err;
		});
		return seq;
	}

	get_banners(city_name: string) {

		const body = {
			city_name : city_name
		};

		const seq = this.api.post('banners/get', body).share();
		seq
		.map(res => res.json())
		.subscribe(res => {
			return res;
		}, err => {
			console.error('ERROR', err);
		});
		return seq;
	}




	get_promotions_by_location(latitude: number, longitude: number){
		let options = JSON.parse(this.util.getPreference('options'));
		if (!options){
			options = { 
				notifications: false,
				range : 2
			};
		}
		const body = {
			latitude : latitude,
			longitude : longitude,
			range: options.range
		};
		const dialog = this.util.show_dialog('Obteniendo las ofertas');
		const seq = this.api.post('offers/find_by_location', body).share();
		seq
		.map(res => res.json())
		.subscribe(res => {
			//dialog.dismiss().catch(() => {console.log('ERROR CATCH: LoadingController dismiss'); });
			return res;
		}, err => {
			//dialog.dismiss().catch(() => {console.log('ERROR CATCH: LoadingController dismiss'); });
			console.error('ERROR', err);
		});

		return seq;

	}

	get_categories(){
		const dialog = this.util.show_dialog('Obteniendo las categorias');
		const seq = this.api.get('find_all_categories').share(); 
		seq
		.map(res => res.json())
		.subscribe(res => {
			//dialog.dismiss().catch(() => {console.log('ERROR CATCH: LoadingController dismiss'); });
			return res;
		}, err => {
			//dialog.dismiss().catch(() => {console.log('ERROR CATCH: LoadingController dismiss'); });
			console.error('ERROR', err);
		});

		return seq;
	}

	get_subcategories(category_id: number){
		const dialog = this.util.show_dialog('Obteniendo las subcategorias');
		const seq = this.api.get('subcategories', {category_id: category_id}).share();
		seq
		.map(res => res.json())
		.subscribe(res => {
			//dialog.dismiss().catch(() => {console.log('ERROR CATCH: LoadingController dismiss'); });
			return res;
		}, err => {
			//dialog.dismiss().catch(() => {console.log('ERROR CATCH: LoadingController dismiss'); });
			console.error('ERROR', err);
		});

		return seq;
	}

	get_offers_by_subcategory(subcategory_id: number){
		const body = {
			latitude : this.util.getPreference(this.util.constants.latitude),
			longitude : this.util.getPreference(this.util.constants.longitude),
			city_name : this.util.getPreference(this.util.constants.city_name),
			subcategory_id : subcategory_id,
		};
		const dialog = this.util.show_dialog('Obteniendo las ofettas');
		const seq = this.api.post('offers/find_by_subcategorie', body).share();
		seq
		.map(res => res.json())
		.subscribe(res => {
			//dialog.dismiss().catch(() => {console.log('ERROR CATCH: LoadingController dismiss'); });
			return res;
		}, err => {
			//dialog.dismiss().catch(() => {console.log('ERROR CATCH: LoadingController dismiss'); });
			console.error('ERROR', err);
		});

		return seq;
	}

	get_offer_by_id(offer_id: number){
		const body = {
			id : offer_id
		};
		const dialog = this.util.show_dialog('Buscando la oferta');
		const seq = this.api.post('offers/find_by_id', body).share();
		seq
		.map(res => res.json())
		.subscribe(res => {
			//dialog.dismiss().catch(() => {console.log('ERROR CATCH: LoadingController dismiss'); });
			return res;
		}, err => {
			//dialog.dismiss().catch(() => {console.log('ERROR CATCH: LoadingController dismiss'); });
			console.error('ERROR', err);
		});

		return seq;
	}

	get_offers_by_user_id(){
		const dialog = this.util.show_dialog('Obteniendo mis ofertas');
		const body = {
			latitude : this.util.getPreference(this.util.constants.latitude),
			longitude : this.util.getPreference(this.util.constants.longitude),
		};
		const seq = this.api.post('offers/find_by_user_id', body).share();
		seq
		.map(res => res.json())
		.subscribe(res => {
			//dialog.dismiss().catch(() => {console.log('ERROR CATCH: LoadingController dismiss'); });
			return res;
		}, err => {
			//dialog.dismiss().catch(() => {console.log('ERROR CATCH: LoadingController dismiss'); });
			console.error('ERROR', err);
		});

		return seq;
	}

	take_offer(offer_id: number, branch_id: number){
		const body = {
			offer_id : offer_id,
			branch_id: branch_id
		};
		const dialog = this.util.show_dialog('Tomando la oferta');
		const seq = this.api.post('offers/reserve', body).share();
		seq
		.map(res => res.json())
		.subscribe(res => {
			//dialog.dismiss().catch(() => {console.log('ERROR CATCH: LoadingController dismiss'); });
			return res;
		}, err => {
			//dialog.dismiss().catch(() => {console.log('ERROR CATCH: LoadingController dismiss'); });
			console.error('ERROR', err);
		});

		return seq;
	}
	send_calification(body: any)
	{
		const dialog = this.util.show_dialog('Calificando');
		const seq = this.api.post('offers/qualification', body).share();
		seq
		.map(res => res.json())
		.subscribe(res => {
			//dialog.dismiss().catch(() => {console.log('ERROR CATCH: LoadingController dismiss'); });
			return res;
		}, err => {
			//dialog.dismiss().catch(() => {console.log('ERROR CATCH: LoadingController dismiss'); });
			console.error('ERROR', err);
		});

		return seq;
	}
	send_message(message: string){
		const body = {
			message: message
		};
		const dialog = this.util.show_dialog('Enviando mensaje');
		const seq = this.api.post('messages', body).share();
		seq
		.map(res => res.json())
		.subscribe(res => {
			//dialog.dismiss().catch(() => {console.log('ERROR CATCH: LoadingController dismiss'); });
			return res;
		}, err => {
			//dialog.dismiss().catch(() => {console.log('ERROR CATCH: LoadingController dismiss'); });
			console.error('ERROR', err);
		});

		return seq;
	}
	get_countries(){
		const dialog = this.util.show_dialog('Listando los paises');
		const seq = this.api.get('countries', {}).share();
		seq
		.map(res => res.json())
		.subscribe(res => {
			//dialog.dismiss().catch(() => {console.log('ERROR CATCH: LoadingController dismiss'); });
			return res;
		}, err => {
			//dialog.dismiss().catch(() => {console.log('ERROR CATCH: LoadingController dismiss'); });
			console.error('ERROR', err);
		});

		return seq;
	}

	get_cities_by_country(country_code: string){
		const dialog = this.util.show_dialog('Listando las ciudades');
		const seq = this.api.post('cities', {country_code: country_code}).share();
		seq
		.map(res => res.json())
		.subscribe(res => {
			//dialog.dismiss().catch(() => {console.log('ERROR CATCH: LoadingController dismiss'); });
			return res;
		}, err => {
			//dialog.dismiss().catch(() => {console.log('ERROR CATCH: LoadingController dismiss'); });
			console.error('ERROR', err);
		});

		return seq;
	}	
	get_cities_by_departament(departament_id:number){
		const dialog = this.util.show_dialog('Listando las ciudades');
		const seq = this.api.post('cities/get_cities_by_departament', {departament_id: departament_id}).share();
		seq
		.map(res => res.json())
		.subscribe(res => {
			//dialog.dismiss().catch(() => {console.log('ERROR CATCH: LoadingController dismiss'); });
			return res;
		}, err => {
			//dialog.dismiss().catch(() => {console.log('ERROR CATCH: LoadingController dismiss'); });
			console.error('ERROR', err);
		});

		return seq;
	}
	get_departaments_by_country(country_id: number){
		const dialog = this.util.show_dialog('Listando los departamentos');
		const seq = this.api.post('departament/departaments_by_country', {country_id: country_id}).share();
		seq
		.map(res => res.json())
		.subscribe(res => {
			//dialog.dismiss().catch(() => {console.log('ERROR CATCH: LoadingController dismiss'); });
			return res;
		}, err => {
			//dialog.dismiss().catch(() => {console.log('ERROR CATCH: LoadingController dismiss'); });
			console.error('ERROR', err);
		});

		return seq;
	}
	recovery_password(email: string){
		const body = {
			email: email
		};
		const dialog = this.util.show_dialog('Solicitando contraseña temporal');
		const seq = this.api.post('recovery_password', body).share();
		seq
		.map(res => res.json())
		.subscribe(res => {
			//dialog.dismiss().catch(() => {console.log('ERROR CATCH: LoadingController dismiss'); });
			return res;
		}, err => {
			//dialog.dismiss().catch(() => {console.log('ERROR CATCH: LoadingController dismiss'); });
			console.error('ERROR', err);
		});

		return seq;
	}
	reset_password(email: string, temp_password: number, new_password: string){
		const body = {
			email: email,
			temp_password: temp_password,
			new_password: new_password
		};
		const dialog = this.util.show_dialog('Cambiando contraseña');
		const seq = this.api.post('reset_password', body).share();
		seq
		.map(res => res.json())
		.subscribe(res => {
			//dialog.dismiss().catch(() => {console.log('ERROR CATCH: LoadingController dismiss'); });
			return res;
		}, err => {
			//dialog.dismiss().catch(() => {console.log('ERROR CATCH: LoadingController dismiss'); });
			console.error('ERROR', err);
		});

		return seq;
	}

	get_companies_by_city_subcategorie_and_name(body: any){
		const dialog = this.util.show_dialog('Obteniendo compañias');
		const seq = this.api.post('companies/find', body).share();
		seq
		.map(res => res.json())
		.subscribe(res => {
			//dialog.dismiss().catch(() => {console.log('ERROR CATCH: LoadingController dismiss'); });
			return res;
		}, err => {
			//dialog.dismiss().catch(() => {console.log('ERROR CATCH: LoadingController dismiss'); });
			console.error('ERROR', err);
		});

		return seq;
	}

	get_company_by_id(company_id: number){
		const dialog = this.util.show_dialog('Obteniendo información del negocio');
		const body = {
			company_id: company_id
		};
		const seq = this.api.post('companies/find_by_company_id', body).share();
		seq
		.map(res => res.json())
		.subscribe(res => {
			//dialog.dismiss().catch(() => {console.log('ERROR CATCH: LoadingController dismiss'); });
			return res;
		}, err => {
			//dialog.dismiss().catch(() => {console.log('ERROR CATCH: LoadingController dismiss'); });
			console.error('ERROR', err);
		});

		return seq;
	}
	saveCompanyState(companyId:number,companyState:number){
		const body = {
			id : companyId,
			state : companyState
		};  
		const seq = this.api.post('companies/save_company_state', body).share();
		seq
		.subscribe(res => {
			return res;
		}, err => {
			console.error('ERROR', err);
		});
		return seq;
	}
	saveOffersState(offerId:number,offerState:number){
		const body = {
			id : offerId,
			state : offerState
		};  
		const seq = this.api.post('offers/save_offer_state', body).share();
		seq
		.subscribe(res => {
			return res;
		}, err => {
			console.error('ERROR', err);
		});
		return seq;
	}
	saveBannerState(bannerId:number,bannerState:number){
		const body = {
			id : bannerId,
			state : bannerState
		};  
		const seq = this.api.post('banners/save_banner_state', body).share();
		seq
		.subscribe(res => {
			return res;
		}, err => {
			console.error('ERROR', err);
		});
		return seq;
	}
	save_banner(banner:any){
		const seq = this.api.post('banners/save_banner', banner).share();
		seq
		.subscribe(res => {
			return res;
		}, err => {
			console.error('ERROR', err);
		});
		return seq;
	}
	uploadFileCompany(company:any){
		const seq = this.api.post('companies/save_company_file', company).share();
		seq
		.subscribe(res => {
			return res;
		}, err => {
			console.error('ERROR', err);
		});
		return seq;
	}
	get_all_offers(){
		const seq = this.api.post('offers/find_all_offers',{}).share();
		seq
		.subscribe(res => {
			return res;
		}, err => {
			return err;
		});
		return seq;
	}
	get_all_banners(){
		const seq = this.api.post('banners/find_all_banners',{}).share();
		seq
		.subscribe(res => {
			return res;
		}, err => {
			return err;
		});
		return seq;
	}

}
