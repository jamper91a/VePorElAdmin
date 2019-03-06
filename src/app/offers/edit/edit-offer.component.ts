import {Component, Input, OnInit} from '@angular/core';
import {Util} from '../../../providers/util';
import {VePorEl} from '../../../providers/veporel';
import * as moment from 'moment';
import 'moment/locale/es';
import {ActivatedRoute, Router} from '@angular/router';

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
    selector: 'app-edit-offer',
    templateUrl: 'editoffercomponent.component.html'
})

export class EditOfferComponent implements OnInit {

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
        photo: any,
        url_photo: string
    } = {
        name: 'Mi oferta',
        start: moment().format('YYYY-MM-DD'),
        finish: moment().format('YYYY-MM-DD'),
        price: 10000,
        amount: 0,
        description: 'Mi descripción',
        regular_price: 20000,
        product_name: 'Mi producto',
        branchs_offer: [],
        photo: File,
        url_photo: ''
    };
    public branchs: any = [];
    constructor(
        private veporel: VePorEl,
        private util: Util,
        private route: ActivatedRoute,
        private router: Router
    ) {
    }

    ngOnInit(): void {
        const self = this;

        this.route.params.subscribe((params: any) => {
            const aux = self.util.getPreference('offer_' + params.id);
            if (aux) {
                self.offer = JSON.parse(aux);
                $('#photo-preview').attr('src', self.util.url + self.offer.url_photo).fadeIn('slow');
                // Borro la información
                self.util.removePreference('offer_' + params.id);
                this.get_branchs();

            }

        });

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
            console.log(aux);
            $('#finish').data('DateTimePicker').maxDate(aux);
            $('#finish').data('DateTimePicker').minDate(e.date);


        });
        $('#finish').on('dp.change', function (e) {
            $('#start').data('DateTimePicker').maxDate(e.date);
        });
        // Prepare the preview for profile picture
        $('#photo').change(function() {
            self.offer.photo = self.readPhotoURL(this);
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
    public get_branchs() {
        const self = this;
        this.veporel.get_brachs()
            .map(res => res.json())
            .subscribe(function (branchs) {
                self.branchs = branchs;
                setTimeout(function () {
                    $('#branchs').selectpicker({
                        size: 4,
                        style: 'btn-rose'
                    });
                }, 10);
            });


    }
}
