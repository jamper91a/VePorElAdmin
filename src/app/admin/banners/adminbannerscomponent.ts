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
    selector: 'adminbannerscomponent-cmp',
    templateUrl: 'adminbannerscomponent.component.html'
})

export class AdminBannersComponent {

    public dataTable: DataTable;
    public loading: boolean;
    public rowSelected: {
        name: string,
        description: string,
        url_destination: string,
        cities: string,
        end: string,
        photo:any,
        state:number,
        id:number
    };
    private 
    constructor(
        private veporel: VePorEl,
        private util: Util,
        private router: Router
        ) {
        this.dataTable = {
            headerRow: [ 'Foto', 'Nombre', 'Ciudad', 'Finalización','Destino Url','Estado', 'Fecha Creacion', 'Acciones' ],
            footerRow: [ 'Foto', 'Nombre', 'Ciudad', 'Finalización','Destino Url','Estado', 'Fecha Creacion', 'Acciones' ],
            dataRows: []
        };
        this.loading = true;
    }
    ngOnInit(): void {
        var self=this;
        this.veporel.get_all_banners()
        .map(res => res.json())
        .subscribe(function (banners) {
            self.rowSelected = banners[0];
            self.dataTable.dataRows = banners;
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
                searchPlaceholder: "Buscar Banners",
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
        this.veporel.saveBannerState(this.rowSelected.id,this.rowSelected.state);
    }
    archiveClick(row) {
        this.rowSelected = row;
    }

}