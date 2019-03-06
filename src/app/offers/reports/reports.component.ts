import {Component, OnInit} from '@angular/core';
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
    selector: 'app-reports',
    templateUrl: 'reports.component.html'
})

export class ReportsComponent implements OnInit {

    public dataTable: DataTable;
    public loading: boolean;

    constructor(
        public util: Util,
        public veporel: VePorEl
    ) {
        this.dataTable = {
            headerRow: [ 'Id', 'Oferta', 'Usuario', 'Estado'],
            footerRow: [ 'Id', 'Oferta', 'Usuario', 'Estado' ],
            dataRows: []
        };
        this.loading = true;
    }

    ngOnInit() {
        const self = this;
        this.veporel.get_offers_user()
            .map(res => res.json())
            .subscribe(function (offers) {
                self.dataTable.dataRows = offers;
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
                searchPlaceholder: 'Buscar Ofertas',
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

        $('[rel="tooltip"]').tooltip();
    }

    private get_state(state: number): string {
        switch (state) {
            case 0:
                return 'Pendiente';
            case 1:
                return 'Entregado';
            case 2:
                return 'Cancelado';

        }
    }
}
