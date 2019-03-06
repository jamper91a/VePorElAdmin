import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {Util} from '../../../providers/util';
import {VePorEl} from '../../../providers/veporel';

declare interface DataTable {
	headerRow: string[];
	footerRow: string[];
	dataRows: string[][];
}
declare var swal: any;
declare var $: any;
@Component({
	moduleId: module.id,
	selector: 'app-list-banners',
	templateUrl: 'listbannerscomponent.component.html'
})

export class ListBannersComponent implements OnInit {


	public dataTable: DataTable;
	public loading: boolean;
	public rowSelected: {
		name: string,
		description: string,
		url_destination: string,
		cities: string,
		end: string,
		photo: any,
		state: number,
		id: number
	};
	constructor(
		private  veporel: VePorEl,
		private util: Util,
		private router: Router
		) {
		this.dataTable = {
			headerRow: [ 'Id', 'Foto', 'Nombre', 'Ciudad', 'Finalización', 'Destino Url', 'Estado', 'Fecha Creacion', 'Acciones' ],
			footerRow: [ 'Id', 'Foto', 'Nombre', 'Ciudad', 'Finalización', 'Destino Url', 'Estado', 'Fecha Creacion', 'Acciones' ],
			dataRows: []
		};
		this.loading = true;
	}

	ngOnInit(): void {
		const self = this;
		this.veporel.get_banners_company()
		.map(res => res.json())
		.subscribe(function (banners) {
			self.dataTable.dataRows = banners;
			setTimeout(function () {
				self.init_datatable();
			}, 100);
			self.loading = false;
		}, function (error) {

		});
	}

	private init_datatable() {
		$('#datatables').DataTable({
			'pagingType': 'full_numbers',

			'lengthMenu': [[10, 25, 50, -1], [10, 25, 50, 'Todos']],
			responsive: true,
			language: {
				search: '_INPUT_',
				searchPlaceholder: 'Buscar Banners',
				'lengthMenu': 'Mostrar _MENU_ Registros',
				'zeroRecords': 'Vacío',
				'info': 'Pagina _PAGE_ de _PAGES_',
				'infoEmpty': 'Ningún registro disponible',
				'infoFiltered': '(filtrados de un total de _MAX_ registros)',
				'paginate': {
					'first': 'Primero',
					'previous': 'Anterior',
					'next': 'Siguiente',
					'last': 'Último'
				}
			}

		});

		$('#datatables').DataTable();


		$('[rel="tooltip"]').tooltip();
	}
	editBanner(row) {
		this.util.savePreference('bannerEditing', JSON.stringify(row));
		this.router.navigate(['/banners/edit']);
	}
	deleteBanner(row) {
		const self = this;
		swal({
			title: 'Estas seguro de eliminar este banner?',
			text: 'Una vez elimina los usuario ya no podran hacer uso de este banner!',
			type: 'warning',
			showCancelButton: true,
			confirmButtonText: 'Si, eliminar!',
			cancelButtonText: 'No, conservar',
			confirmButtonClass: 'btn btn-success',
			cancelButtonClass: 'btn btn-danger',
			buttonsStyling: false
		}).then(function() {
			self.veporel.delete_banner(row.id)
			.map(res => res.json())
			.subscribe(function (res) {
				swal({
					title: 'Eliminada!',
					text: 'El banner se ha eliminado de tu lista.',
					type: 'success',
					confirmButtonClass: 'btn btn-success',
					buttonsStyling: false
				});
				const index = self.dataTable.dataRows.indexOf(row);
				self.dataTable.dataRows.splice(index, 1);
			}, function (error) {
				const body = JSON.parse(error._body);
				swal({
					title: 'La operación no se pudo realizar',
					text: body.message,
					type: 'error',
					confirmButtonClass: 'btn btn-info',
					buttonsStyling: false
				});
			});


		});
	}
}
