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
    selector: 'app-list-offers',
    templateUrl: 'listofferscomponent.component.html'
})

export class ListOffersComponent implements OnInit {


    public dataTable: DataTable;
    public loading: boolean;
    constructor(
        private  veporel: VePorEl,
        private util: Util,
        private router: Router
        ) {
        this.dataTable = {
            headerRow: [ 'Id', 'Imagen', 'Nombre', 'Finaliza', 'Precio', 'Estado', 'Acciones' ],
            footerRow: [ 'Id', 'Imagen', 'Nombre', 'Finaliza', 'Precio', 'Estado', 'Acciones' ],
            dataRows: []
        };
        this.loading = true;
    }

    ngOnInit(): void {
        const self = this;
        this.veporel.get_offers()
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
        const self = this;
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

        const table = $('#datatables').DataTable();

        // Edit record
        table.on( 'click', '.edit', function () {
            const $tr = $(this).closest('tr');

            const data = table.row($tr).data();
            alert( 'You press on Row: ' + data[0] + ' ' + data[1] + ' ' + data[2] + '\'s row.' );
        } );

        // Delete a record
        table.on( 'click', '.remove', function (e) {
            const $tr = $(this).closest('tr');
            const data = table.row($tr).data();
            swal({
                title: 'Estas seguro de eliminar esta oferta?',
                text: 'Una vez elimina los usuario ya no podran reclamar las ofertas que se hayan generado!',
                type: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Si, eliminarla!',
                cancelButtonText: 'No, conservarla',
                confirmButtonClass: 'btn btn-success',
                cancelButtonClass: 'btn btn-danger',
                buttonsStyling: false
            }).then(function() {
                self.veporel.delete_offer(data[0])
                .map(res => res.json())
                .subscribe(function (res) {
                    swal({
                        title: 'Eliminada!',
                        text: 'La sucursal se ha eliminado de tu lista.',
                        type: 'success',
                        confirmButtonClass: 'btn btn-success',
                        buttonsStyling: false
                    });
                    table.row($tr).remove().draw();
                    e.preventDefault();
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
        } );

        // //Like record
        // table.on( 'click', '.like', function () {
            //     var $tr = $(this).closest('tr');
            //     var data = table.row($tr).data();
            //     var offer:any;
            //     for(var i=0; i<self.dataTable.dataRows.length;i++){
                //         var row:any= self.dataTable.dataRows[i];
                //         if(row.id==data[0]){
                    //             offer=row;
                    //             break;
                    //         }
                    //     }
                    //     self.util.savePreference("offer_"+offer.id,JSON.stringify(offer));
                    //     self.router.navigate(['/offers/edit', offer.id]);
                    // });

                    //  Activate the tooltips
                    $('[rel="tooltip"]').tooltip();
                }
            }
