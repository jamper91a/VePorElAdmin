import {Component, OnInit} from '@angular/core';
import {Util} from '../../../providers/util';
import {VePorEl} from '../../../providers/veporel';
import * as moment from 'moment';
import 'moment/locale/es';
import {Router} from '@angular/router';


declare interface DataTable {
	headerRow: string[];
	footerRow: string[];
	dataRows: string[][];
}
declare var swal:any;
declare var $:any;

@Component({
	moduleId: module.id,
	selector: 'admincompanyscomponent-cmp',
	templateUrl: 'admincompanyscomponent.component.html'
})

export class AdminCompanysComponent implements OnInit{

	public dataTable: DataTable;
	public loading: boolean;
	public rowSelected = {
		id: 0,
		name: 'Razer Games',
		user_id: '',
		kind_registration: '',
		kind_company: '',
		cellphone: '+573196485216',
		email: 'soporte@razer.com',
		fanpage: 'https://www.facebook.com/RazerColombia/?brand_redir=13848807575',
		domicilio: false,
		subcategories: [],
		photo: File,
		camara_comercio: File,
		rut: File,
		state: 1,
		cedula: File,
		referencias_personales: File,
		referencias_bancaria: File,
	};
	constructor(
		private  veporel: VePorEl, 
		private util: Util,
		private router: Router
		) {
		this.dataTable = {
			headerRow: [ 'Id', 'Nombre', 'Calificación', 'Email', 'Página', 'Usuario Registro', 'Estado', 'Fecha Creacion', 'Acciones' ],
			footerRow: [ 'Id', 'Nombre', 'Calificación', 'Email', 'Página', 'Usuario Registro', 'Estado', 'Fecha Creacion', 'Acciones' ],
			dataRows: []
		};
		this.loading = true;
	}

	ngOnInit(): void {
		var self=this;
		this.veporel.get_companies()
		.map(res => res.json())
		.subscribe(function (companies) {
			if (companies[0] != undefined) {
				self.rowSelected = companies[0];
			}
			self.dataTable.dataRows = companies;
			// $('#datatables').dataTable().fnAddData(companies);
			setTimeout(function () {
				self.init_datatable();
			}, 100);
			self.loading = false;
		});
	}
	private init_datatable(){
		var self=this;
		var table =$('#datatables').DataTable({
			"pagingType": "full_numbers",

			"lengthMenu": [[10, 25, 50, -1], [10, 25, 50, "Todos"]],
			responsive: true,
			language: {
				search: "_INPUT_",
				searchPlaceholder: "Buscar Compañias",
				"lengthMenu": "Mostrar _MENU_ Registros",
				"zeroRecords": "Vacío",
				"info": "Pagina _PAGE_ de _PAGES_",
				"infoEmpty": "Ningún registro disponible",
				"infoFiltered": "(filtrados de un total de _MAX_ registros)",
				"paginate": {
					"first": "Primero",
					"previous": "Anterior",
					"next": "Siguiente",
					"last": "Último"
				}
			}

		});

		var table = $('#datatables').DataTable();
		//  Activate the tooltips
		$('[rel="tooltip"]').tooltip();
	}
	changeState(row,event) {
		this.rowSelected = row;
		if ($(event.target).is(":checked")) 
			this.rowSelected.state = 1;
		else
			this.rowSelected.state = 0;
		this.veporel.saveCompanyState(this.rowSelected.id,this.rowSelected.state);
	}
	archiveClick(row) {
		this.rowSelected = row;
	}
}