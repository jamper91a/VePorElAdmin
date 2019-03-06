import {Component, OnInit} from '@angular/core';
import {Util} from '../../../providers/util';
import {VePorEl} from '../../../providers/veporel';
import {Router} from '@angular/router';
import * as moment from 'moment';
import 'moment/locale/es';
declare var $: any;
interface FileReaderEventTarget extends EventTarget {
    result: string;
}
// interface FileReaderEvent extends Event {
//     target: FileReaderEventTarget;
//     getMessage(): string;
// }
@Component({
    selector: 'app-create-banner',
    templateUrl: 'create-banner.component.html'
})

export class CreateBannerComponent implements OnInit {

    public bannerSelected: {
        name: string,
        description: string,
        url_destination: string,
        cities: string,
        finish: string,
        createdAt: string,
        photo: any,
    } = {
        name: '',
        description: 'descripción',
        url_destination: '',
        cities: 'Bogotá',
        finish: moment().format('YYYY-MM-DD'),
        createdAt: moment().format('YYYY-MM-DD'),
        photo: File,
    };
    public cities: any;
    public countries: any;
    public departaments: any;
    constructor(
        private veporel: VePorEl,
        private util: Util,
        private router: Router
        ) {
        this.cities = [];
        this.countries = [];
        this.departaments = [];
    }

    ngOnInit() {
        const self = this;
        $('#country_id').selectpicker({
            size: 7,
            style: 'btn btn-rose btn-round'
        });
        $('#departament_id').selectpicker({
            size: 7,
            style: 'btn btn-rose btn-round'
        });
        $('#city_id').selectpicker({
            size: 7,
            style: 'btn btn-rose btn-round'
        });
        self.veporel.get_countries()
        .map(res => res.json())
        .subscribe((data) => {
            self.countries = data;
            setTimeout(function () {
                $('#country_id').selectpicker('refresh');
            }, 10);
        });
        $.ajax({
            url: 'https://freegeoip.net/json/',
            type: 'GET',
            success: function(dataLocation) {
                const countryCode = dataLocation.country_code;
                const region_name = dataLocation.region_name;
                const city = dataLocation.city;
                const country = self.countries.find((countryF) => {if (countryF.code === countryCode) { return countryF; }});
                $('#country_id').val(country.id);
                $('#country_id').selectpicker('refresh');
                self.veporel.get_departaments_by_country(country.id)
                .map(res => res.json())
                .subscribe((data) => {
                    self.departaments = data;
                    const departament =
                        self.departaments.find(
                            (departamentF) => {
                                if (departamentF.name.replace('á', 'a') === region_name) {
                                    return departamentF;
                                }
                            }
                            );

                    setTimeout(function () {
                        $('#departament_id').val(departament.id);
                        $('#departament_id').selectpicker('refresh');

                        self.veporel.get_cities_by_departament(departament.id)
                        .map(res => res.json())
                        .subscribe((dataF) => {
                            self.cities = dataF;
                            const citydata = self.cities.find((cityFocus) => {if (cityFocus.name.match(city) ) { return cityFocus; }});
                            setTimeout(function () {
                                self.bannerSelected.cities = citydata.name;
                                $('#city_id').selectpicker('refresh');
                                $('#city_id').val(citydata.name);
                                console.log($('#city_id').val());
                                $('#city_id').selectpicker('refresh');
                            }, 10);
                        });
                    }, 10);
                });
            },
            error: function(data) {
                console.error(data);
            }
        });
        $('#photo').change(function() {
            self.bannerSelected.photo = self.readPhotoURL(this);
        });
        $('#finishDate').datetimepicker({
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
    }
    private readPhotoURL(input) {
        if (input.files && input.files[0]) {
            const reader = new FileReader();
            reader.onload = (function (f) {
                return function (e) {
                    $('#photo-preview').attr('src', e.target.result).fadeIn('slow');
                };
            })(input.files[0]);
            // reader.onload = function (e) {
            //     $('#photo-preview').attr('src', e.target.result).fadeIn('slow');
            // };
            reader.readAsDataURL(input.files[0]);
            return input.files[0];
        } else {
            return null;
        }
    }

    public create() {
        const self = this;
        const formData = new FormData();
        self.bannerSelected.finish = $('#finishDate').val();
        for (const propiedad in this.bannerSelected) {
            if (this.bannerSelected.hasOwnProperty(propiedad)) {
                formData.append(propiedad, this.bannerSelected[propiedad]);
            }
        }
        console.log(self.bannerSelected);
        this.veporel.create_banner(formData)
        .subscribe(function (res) {
            self.util.show_toast('Banner creado con éxito, esperando su aprobación');
            self.router.navigate(['/banners/list']);
        }, function (error) {
            self.util.show_toast('Banners Agotados', 'warning');
        });
    }
    changeContry(element) {
        const idSelected = element.currentTarget.value;
        const self = this;
        self.veporel.get_departaments_by_country(idSelected)
        .map(res => res.json())
        .subscribe((data) => {

            self.departaments = data;
            self.cities = [];
            setTimeout(function () {

                $('#departament_id').selectpicker('refresh');
                $('#city_id').selectpicker('refresh');
            }, 10);
        });
    }
    changeDepartament(element) {
        const idSelected = element.currentTarget.value;
        const self = this;
        self.veporel.get_cities_by_departament(idSelected)
        .map(res => res.json())
        .subscribe((data) => {
            self.cities = data;
            self.bannerSelected.cities = data[0].name;
            setTimeout(function () {
                $('#city_id').selectpicker('refresh');
            }, 10);
        });
    }
}
