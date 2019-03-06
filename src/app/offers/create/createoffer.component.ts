import {Component, OnInit} from '@angular/core';
import {Util} from '../../../providers/util';
import {VePorEl} from '../../../providers/veporel';
import * as moment from 'moment';
import 'moment/locale/es';
import {Router} from '@angular/router';

declare var $: any;
interface FileReaderEventTarget extends EventTarget {
    result: string;
}
interface FileReaderEvent extends Event {
    target: FileReaderEventTarget;
    getMessage(): string;
}

@Component({
    moduleId: module.id,
    selector: 'app-create-offer',
    templateUrl: 'createoffercomponent.component.html'
})

export class CreateofferComponent implements OnInit {

    public offer: {
        name: string,
        start: string,
        finish: string,
        price: number,
        amount: number,
        description: string,
        regular_price: number,
        product_name: string,
        branchs_offer: any[],
        photo: any
    } = {
        name: '',
        start: moment().format('YYYY-MM-DD'),
        finish: moment().format('YYYY-MM-DD'),
        price: 0,
        amount: 0,
        description: '',
        regular_price: 0,
        product_name: '',
        branchs_offer: [],
        photo: File
    };
    public branchs: any = [];

    constructor(
        private veporel: VePorEl,
        private util: Util,
        private router: Router
        ) {
    }

    ngOnInit(): void {

        $('#start, #finish').datetimepicker({
            format: 'YYYY-MM-DD HH:mm:SS',
            icons: {
                time: 'fa fa-clock-o',
                date: 'fa fa-calendar',
                up: 'fa fa-chevron-up',
                down: 'fa fa-chevron-down',
                previous: 'fa fa-chevron-left',
                next: 'fa fa-chevron-right',
                today: 'fa fa-screenshot',
                clear: 'fa fa-trash',
                close: 'fa fa-remove'
            }
        });
        $('#start').on('dp.change', function (e) {
            let max: any;
            max = e.date.format('YYYY-MM-DD');

            const aux = moment(max).add('7', 'days').format('YYYY-MM-DD');
            $('#finish').data('DateTimePicker').maxDate(aux);
            $('#finish').data('DateTimePicker').minDate(e.date);


        });
        $('#finish').on('dp.change', function (e) {
            $('#start').data('DateTimePicker').maxDate(e.date);
        });
        this.get_branchs();
        const self = this;
        // Prepare the preview for profile picture
        $('#photo').change(function() {
            self.offer.photo = self.readPhotoURL(this);
        });
    }
    public get_branchs() {
        const self = this;
        this.veporel.get_brachs()
        .map(res => res.json())
        .subscribe(function (branchs) {
            self.branchs = branchs;
            setTimeout(function () {
                $('#branchs').selectpicker({
                    size: 10,
                    style: 'btn-rose',
                    liveSearch: true,
                    liveSearchNormalize: true,
                });
                $('.bs-select-all').text('SELECCIONAR TODAS');
                $('.bs-deselect-all').text('DESELECCIONAR TODAS');
            }, 10);
        });


    }

    public create() {
        const self = this;
        // Recorrd las sucursales
        const aux = new Array();
        for (let i = 0; i < this.offer.branchs_offer.length; i++) {
            aux.push(
            {
                branch_id: this.offer.branchs_offer[i],
                amount: this.offer.amount
            }
            );
        }

        const formData = new FormData();
        self.offer.start = $('#start').val();
        self.offer.finish = $('#finish').val();
        formData.append('branchs_offer', JSON.stringify(aux));
        for (const propiedad in this.offer) {
            if (this.offer.hasOwnProperty(propiedad)) {
                if (propiedad !== 'amount' && propiedad !== 'branchs_offer') {
                    formData.append(propiedad, this.offer[propiedad]);
                }

            }
        }
        this.veporel.create_offer(formData)
        .subscribe(function (res) {
            self.util.show_toast('Oferta creada con éxito');
            self.router.navigate(['/offers']);
        }, function (error) {
            self.util.show_toast('Ofertas Agotadas', 'warning');
        });
    }

    public readPhotoURL(input) {
        if (input.files && input.files[0]) {
            const reader = new FileReader();
            reader.onload = (function (f) {
                return function (e) {
                    $('#photo-preview').attr('src', e.target.result).fadeIn('slow');
                };
            })(input.files[0]);
            reader.readAsDataURL(input.files[0]);
            return input.files[0];
        } else {
            return null;
        }
    }
}
