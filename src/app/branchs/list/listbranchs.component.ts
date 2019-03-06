import { Component, OnInit } from '@angular/core';
import {VePorEl} from '../../../providers/veporel';
import {Util} from '../../../providers/util';
import {Router} from '@angular/router';

declare interface DataTable {
    headerRow: string[];
    footerRow: string[];
    dataRows: string[][];
}
declare var swal:any;
declare var $:any;
@Component({
    selector: 'listbranchs-cmp',
    templateUrl: 'listbranchs.component.html',
    styleUrls: ['listbranchs.scss']
})

export class ListBranchsComponent implements OnInit{

    public dataTable: DataTable;
    public loading: boolean;
    constructor(
        private  veporel: VePorEl,
        private util: Util,
        private router: Router
        ) {
        this.dataTable = {
            headerRow: [ 'Id', 'Nombre', 'Dirección', 'Telefono', 'Ciudad', 'Acciones' ],
            footerRow: [ 'Id', 'Nombre', 'Dirección', 'Telefono', 'Ciudad', 'Acciones' ],
            dataRows: []
        };
        this.loading = true;
    }

    ngOnInit(): void {
        var self=this;
        this.veporel.get_brachs()
        .map(res => res.json())
        .subscribe(function (branchs) {
            self.dataTable.dataRows = branchs;
            // $('#datatables').dataTable().fnAddData(branchs);
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
                searchPlaceholder: "Buscar sucursales",
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

        // Edit record
        table.on( 'click', '.edit', function () {
            var $tr = $(this).closest('tr');

            var data = table.row($tr).data();
            alert( 'You press on Row: ' + data[0] + ' ' + data[1] + ' ' + data[2] + '\'s row.' );
        } );

        // Delete a record
        table.on( 'click', '.remove', function (e) {
            var $tr = $(this).closest('tr');
            var data = table.row($tr).data();
            swal({
                title: 'Estas seguro de eliminar esta sucursal?',
                text: 'Una vez elimina los usuario ya no podran reclamar las ofertas que se hayan generado en esa sucursal!',
                type: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Si, eliminarla!',
                cancelButtonText: 'No, conservarla',
                confirmButtonClass: "btn btn-success",
                cancelButtonClass: "btn btn-danger",
                buttonsStyling: false
            }).then(function() {
                self.veporel.delete_branch(data[0])
                .map(res=>res.json())
                .subscribe(function (res) {
                    swal({
                        title: 'Eliminada!',
                        text: 'La sucursal se ha eliminado de tu lista.',
                        type: 'success',
                        confirmButtonClass: "btn btn-success",
                        buttonsStyling: false
                    });
                    table.row($tr).remove().draw();
                    e.preventDefault();
                }, function (error) {
                    swal({
                        title: 'La operación no se pudo realizar',
                        text: error.message,
                        type: 'error',
                        confirmButtonClass: "btn btn-info",
                        buttonsStyling: false
                    })
                });

                
            })
        } );

        //Like record
        table.on( 'click', '.like', function () {
            var $tr = $(this).closest('tr');
            var data = table.row($tr).data();
            self.router.navigate(['/branchs/edit', data[0]]);
        });

        //  Activate the tooltips
        $('[rel="tooltip"]').tooltip();
    }

    ngAfterViewInit(){
        // this.init_datatable();
    }

}