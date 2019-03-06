import {Component, Input} from '@angular/core';
import {Util} from '../../../providers/util';
import {VePorEl} from '../../../providers/veporel';
import * as moment from 'moment';
import 'moment/locale/es';
import {ActivatedRoute, Router} from '@angular/router';



declare interface DataTable {
    headerRow: string[];
    footerRow: string[];
    dataRows: string[][];
}
declare var swal:any;
declare var $:any;

@Component({
    moduleId: module.id,
    selector: 'adminpofferscomponent-cmp',
    templateUrl: 'adminofferscomponent.component.html'
})

export class AdminOffersComponent {

    public dataTable: DataTable;
    public loading: boolean;
    public rowSelected: {
        id: number,
        name: string,
        start: string,
        finish: string,
        price: number,
        amount: number,
        description: string,
        regular_price: number,
        product_name: string,
        branchs_offer: any[],
        photo:any,
        url_photo:string,
        state:number
    };
    private branchs: any = [];
    
    constructor(
        private veporel: VePorEl,
        private util: Util,
        private router: Router
        ) {
        this.dataTable = {
            headerRow: [ 'Foto', 'Nombre', 'Nombre Producto', 'Inicio', 'Finalización', 'Precio', 'Precio Normal', 'Estado', 'Acciones' ],
            footerRow: [ 'Foto', 'Nombre', 'Nombre Producto', 'Inicio', 'Finalización', 'Precio', 'Precio Normal', 'Estado', 'Acciones' ],
            dataRows: []
        };
        this.loading = true;
    }

    ngOnInit(): void {
        var self=this;
        this.veporel.get_all_offers()
        .map(res => res.json())
        .subscribe(function (offers) {
            self.rowSelected = offers[0];
            self.dataTable.dataRows = offers;
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
                searchPlaceholder: "Buscar Ofertas",
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
        this.veporel.saveOffersState(this.rowSelected.id,this.rowSelected.state);
    }
    archiveClick(row) {
        this.rowSelected = row;
    }
}