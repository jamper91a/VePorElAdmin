import {Component, OnInit} from '@angular/core';
import {VePorEl} from '../../../providers/veporel';
import {Util} from '../../../providers/util';
import {Router} from '@angular/router';

declare var $: any;
declare var google: any;

@Component({
    selector: 'app-createbranch',
    templateUrl: 'create-branch.component.html'
})
export class CreateBranchComponent implements OnInit {

    public current_position;
    public branch: {
        city_id: number
        name: string,
        address: string,
        latitude: number,
        longitude: number,
        telephone: string
    } = {
        city_id: 1,
        name: '',
        address: '',
        latitude: 0,
        longitude: 0,
        telephone: ''
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

    ngOnInit(): void {
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
        const self = this;
        self.veporel.get_countries()
            .map(res => res.json())
            .subscribe((data) => {
                self.countries = data;
                setTimeout(function () {
                    $('#country_id').selectpicker('refresh');
                    $.ajax({
                        url: 'https://freegeoip.net/json/',
                        type: 'GET',
                        success: function (dataPosition) {

                            self.branch.latitude = dataPosition.latitude;
                            self.branch.longitude = dataPosition.longitude;
                            const myLatlng = new google.maps.LatLng(self.branch.latitude, self.branch.longitude);
                            const mapOptions = {
                                zoom: 8,
                                center: myLatlng,
                                scrollwheel: true, // we disable de scroll over the map, it is a really annoing when you scroll through page
                            };

                            const map = new google.maps.Map(document.getElementById('regularMap'), mapOptions);
                            self.current_position = new google.maps.Marker({
                                position: myLatlng,
                                title: 'Regular Map!'
                            });

                            self.current_position.setMap(map);

                            map.addListener('click', function (e) {
                                self.branch.latitude = e.latLng.lat();
                                self.branch.longitude = e.latLng.lng();
                                self.current_position.setPosition(e.latLng);
                            });
                            self.getPostionGoogle();
                            const countryCode = dataPosition.country_code;
                            const region_name = dataPosition.region_name;
                            const city = dataPosition.city;
                            const country = self.countries.find((countryF) => {
                                if (countryF.code === countryCode) {
                                    return countryF;
                                }
                            });
                            if (country !== undefined) {
                                $('#country_id').val(country.id);
                                $('#country_id').selectpicker('refresh');
                                self.veporel.get_departaments_by_country(country.id)
                                    .map(res => res.json())
                                    .subscribe((dataF) => {
                                        self.departaments = dataF;
                                        const departament = self.departaments.find(
                                            (departamentF) => {
                                                if (departamentF.name.replace('á', 'a') === region_name) {
                                                    return departamentF;
                                                }
                                            });

                                        setTimeout(function () {
                                            $('#departament_id').selectpicker('refresh');
                                            if (departament !== undefined) {
                                                $('#departament_id').val(departament.id);
                                                $('#departament_id').selectpicker('refresh');

                                                self.veporel.get_cities_by_departament(departament.id)
                                                    .map(res => res.json())
                                                    .subscribe((dataCitiesByDepartment) => {
                                                        self.cities = dataCitiesByDepartment;
                                                        const cityFocus = self.cities.find((cityFocusF) => {
                                                            if (cityFocusF.name.match(city)) {
                                                                return cityFocusF;
                                                            }
                                                        });
                                                        self.branch.city_id = cityFocus.id;
                                                        $('#city_id').selectpicker('refresh');
                                                        setTimeout(function () {
                                                            if (cityFocus !== undefined) {
                                                                $('#city_id').val(cityFocus.id);
                                                                $('#city_id').selectpicker('refresh');
                                                            }
                                                        }, 10);
                                                    });
                                            }

                                        }, 10);
                                    });
                            }

                        },
                        error: function (dataE) {
                            console.error(dataE);
                        }
                    });
                }, 10);
            });
    }

    getPostionGoogle() {
        const self = this;
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function (position) {
                self.branch.latitude = position.coords.latitude;
                self.branch.longitude = position.coords.longitude;
                const myLatlng = new google.maps.LatLng(self.branch.latitude, self.branch.longitude);
                const mapOptions = {
                    zoom: 8,
                    center: myLatlng,
                    scrollwheel: true, // we disable de scroll over the map, it is a really annoing when you scroll through page
                };

                const map = new google.maps.Map(document.getElementById('regularMap'), mapOptions);
                self.current_position = new google.maps.Marker({
                    position: myLatlng,
                    title: 'Regular Map!'
                });

                self.current_position.setMap(map);

                map.addListener('click', function (e) {
                    self.branch.latitude = e.latLng.lat();
                    self.branch.longitude = e.latLng.lng();
                    self.current_position.setPosition(e.latLng);
                });

            }, function () {

            });
        }
    }

    create() {
        const self = this;
        this.veporel.create_branch(this.branch)
            .subscribe((res) => {
                self.util.show_toast('Sucursal creada con éxito', 'success');
                self.router.navigate(['/branchs']);
            }, error => {
                self.util.show_toast('La sucursal no se pudo crear, por favor intentalo mas tarde', 'warning');
            });
    }

    changeContry(element) {
        const idSelected = element.currentTarget.value;
        const self = this;
        self.veporel.get_departaments_by_country(idSelected)
            .map(res => res.json())
            .subscribe((data) => {

                self.departaments = data;
                setTimeout(function () {

                    $('#departament_id').selectpicker('refresh');
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
                self.branch.city_id = data[0].id;
                setTimeout(function () {
                    $('#city_id').selectpicker('refresh');
                }, 10);
            });
    }

}
