import {Component, OnInit} from '@angular/core';
import {Util} from '../../../providers/util';
import {VePorEl} from '../../../providers/veporel';
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
    selector: 'app-edit-banner',
    templateUrl: 'editbannercomponent.component.html'
})

export class EditBannerComponent implements OnInit {

    public banner: {
        id: number,
        name: string,
        cities: string,
        description: string,
        finish: string,
        url_destination: string,
        state: any,
        createdAt: string,
        url_photo: string,
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
        self.banner = JSON.parse(this.util.getPreference('bannerEditing'));
        $.ajax({
            url: 'https://freegeoip.net/json/',
            type: 'GET',
            success: function (dataLocation) {
                const countryCode = dataLocation.country_code;
                const region_name = dataLocation.region_name;
                const city = dataLocation.city;
                const country = self.countries.find((countryF) => {
                    if (countryF.code === countryCode) {
                        return countryF;
                    }
                });
                $('#country_id').val(country.id);
                $('#country_id').selectpicker('refresh');
                self.veporel.get_departaments_by_country(country.id)
                    .map(res => res.json())
                    .subscribe((data) => {
                        self.departaments = data;
                        const departament = self.departaments.find(
                            (departamentF) => {
                                if (departamentF.name === region_name) {
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
                                    self.banner.cities = dataF[0].name;
                                    const citydata = self.cities.find(
                                        (cityFocus) => {
                                            console.log(cityFocus.name);
                                            console.log(city);
                                            if (cityFocus.name.match(city)) {
                                                return cityFocus;
                                            }
                                        });
                                    setTimeout(function () {
                                        $('#city_id').selectpicker('refresh');
                                        $('#city_id').val(citydata.name);
                                        console.log($('#city_id').val());
                                        $('#city_id').selectpicker('refresh');
                                    }, 10);
                                });
                        }, 10);
                    });
            },
            error: function (data) {
                console.error(data);
            }
        });
        $('#finish').datetimepicker({
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


        const fecha: Date = (new Date(self.banner.finish));
        const day = fecha.getDate();
        const month = fecha.getMonth() + 1;
        const year = fecha.getFullYear();
        const hour = fecha.getHours();
        const minutes = fecha.getHours();
        self.banner.finish = (year + '-' + month + '-' + day + ' ' + hour + ':' + minutes);
        self.banner.state = false;
        $('#photo-preview').attr('src', self.util.url + self.banner.url_photo).fadeIn('slow');
    }

    public setFinish(inputDate) {
        console.log(inputDate);
        this.banner.finish = $(inputDate).val();
    }

    public readPhotoURL(fileInput) {
        const self = this;
        const input = fileInput.target;
        $(input).parent().css('border-color', '#0dbf1b');
        if (input.files && input.files[0]) {
            const reader = new FileReader();

            reader.onload = (function (f) {
                return function (e) {
                    $('#photo-preview').attr('src', e.target.result).fadeIn('slow');
                };
            })(input.files[0]);
            reader.readAsDataURL(input.files[0]);
            self.banner.url_photo = input.files[0];
        } else {
            self.banner.url_photo = null;
        }
    }

    public save() {
        const self = this;
        // Recorrd las sucursales
        const formData = new FormData();
        self.banner.finish = $('#finish').val();
        console.log(self.banner);
        for (const propiedad in this.banner) {
            if (this.banner.hasOwnProperty(propiedad)) {
                formData.append(propiedad, this.banner[propiedad]);

            }
        }

        this.veporel.save_banner(formData)
            .subscribe(function (res) {
                self.util.show_toast('Banner editado con éxito, esperando su aprovación');
                self.router.navigate(['/banners/list']);
            }, function (error) {
                const obj = JSON.parse(error._body);
                self.util.show_toast(obj.message, 'warning');
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
                self.banner.cities = data[0].name;
                setTimeout(function () {
                    $('#city_id').selectpicker('refresh');
                }, 10);
            });
    }
}
