import { Component, OnInit } from '@angular/core';
import PerfectScrollbar from 'perfect-scrollbar';
import {Util} from '../../providers/util';
import {Router} from '@angular/router';

declare const $: any;

//Metadata
export interface RouteInfo {
	path: string;
	title: string;
	type: string;
	icontype: string;
	collapse?: string;
	children?: ChildrenItems[];
}

export interface ChildrenItems {
	path: string;
	title: string;
	ab: string;
	type?: string;
}

//Menu Items
export const ROUTES: RouteInfo[] = [
	{path: '/dashboard', title: 'Dashboard', type: 'link',icontype: 'material-icons' },

	{
		path: '/branchs',
		title: 'Sucursales',
		type: 'sub',
		icontype: 'apps',
		collapse: 'components',
		children: [
			{ path: '/branchs/create', title: 'Crear sucursal', ab:'o' }
		]
	},


	{ path: '/offers/create', title: 'Crear oferta', type: 'link',icontype:'material-icons' },
	{ path: '/offers', title: 'Ofertas', type: 'link',icontype:'material-icons' },
	{ path: '/offers/reports', title: 'Reportes', type: 'link',icontype:'material-icons' },

	{ path: '/banners/create', title: 'Crear banner', type: 'link',icontype:'material-icons' },
	{ path: '/banners/list', title: 'Banners', type: 'link',icontype:'material-icons' },

	{ path: '/admin/companies', title: 'Compañias', type: 'link',icontype:'material-icons' },
	{ path: '/admin/offers', title: 'Ofertas', type: 'link',icontype:'material-icons' },
	{ path: '/admin/banners', title: 'Banners', type: 'link',icontype:'material-icons' },

	{ path: '/shop/shoping', title: 'Paquetes', type: 'link',icontype:'material-icons' },

];
// declare let $: any;
declare let swal: any;
var sidebarTimer;
@Component({
	selector: 'app-sidebar-cmp',
	templateUrl: 'sidebar.component.html',
})

export class SidebarComponent implements OnInit {
	public menuItems: any[];
	public user:any;
	public group:number;
	constructor(
		public util: Util,
		private router: Router
	) {
		/*if (this.util.constants.group) this.group = true;*/
		this.group = this.util.getPreference(this.util.constants.group);
	}

	isMobileMenu() {
		if ($(window).width() > 991) {
			return false;
		}
		return true;
	};

	ngOnInit() {
		// Obtengo el usuario
		this.user = JSON.parse(this.util.getPreference(this.util.constants.user));
		this.menuItems = ROUTES.filter(menuItem => menuItem);
	}
	updatePS(): void  {
		if (window.matchMedia(`(min-width: 960px)`).matches && !this.isMac()) {
			const elemSidebar = <HTMLElement>document.querySelector('.sidebar .sidebar-wrapper');
			let ps = new PerfectScrollbar(elemSidebar, { wheelSpeed: 2, suppressScrollX: true });
		}
	}
	isMac(): boolean {
		let bool = false;
		if (navigator.platform.toUpperCase().indexOf('MAC') >= 0 || navigator.platform.toUpperCase().indexOf('IPAD') >= 0) {
			bool = true;
		}
		return bool;
	}
	closeSession() {
		const self = this;
		swal({
			title: 'Estas seguro que deseas cerrar sesión?',
			text: 'Cerrar Sesión',
			type: 'warning',
			showCancelButton: true,
			confirmButtonText: 'Si, Cerrar Sesión!',
			cancelButtonText: 'No, Permanecer aquí',
			confirmButtonClass: 'btn btn-success',
			cancelButtonClass: 'btn btn-danger',
			buttonsStyling: false
		}).then(() => {
			this.util.savePreference(this.util.constants.logged, 'false');
			this.util.savePreference(this.util.constants.user, null);
			this.util.savePreference(this.util.constants.token, null);
			this.util.savePreference(this.util.constants.group, null);
			this.router.navigate(['/pages/login']);
		});

	}
}
