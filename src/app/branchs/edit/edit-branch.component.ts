import {Component, OnInit} from '@angular/core';
import {Util} from '../../../providers/util';
import {VePorEl} from '../../../providers/veporel';
import { Router, ActivatedRoute } from '@angular/router';
declare var $: any;
declare var google: any;
@Component({
    selector: 'app-editbranch',
    templateUrl: 'edit-branch.component.html'
})

export class EditBranchComponent implements OnInit {

    public  current_position;
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
        private route: ActivatedRoute,
        private router: Router
        ) {
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
            }, 10);
        });
        this.route.params.subscribe((params: any) => {
            // Obtengo la información de la sucursal
            self.veporel.get_branch(params.id)
            .map(res => res.json())
            .subscribe((branch) => {
                self.branch = branch;
                self.branch.city_id = branch.location.id;
                // Obtengo la ciudades
                // Ahora obtengo los paises y ciudades
                self.veporel.get_cities_by_country(branch.location.country_code)
                .map(res => res.json())
                .subscribe((data) => {
                    self.cities = data;
                    setTimeout(function () {
                        $('#city_id').selectpicker('refresh');
                    }, 10);
                });

                // Organizo el mapa
                const myLatlng = new google.maps.LatLng(self.branch.latitude, self.branch.longitude);
                const mapOptions = {
                    zoom: 16,
                    center: myLatlng,
                    scrollwheel: true, // we disable de scroll over the map, it is a really annoing when you scroll through page
                };

                const map = new google.maps.Map(document.getElementById('regularMap'), mapOptions);
                self.current_position = new google.maps.Marker({
                    position: myLatlng,
                    title: 'Regular Map!'
                });

                self.current_position.setMap(map);

                map.addListener('click', function(e) {
                    self.branch.latitude = e.latLng.lat();
                    self.branch.longitude = e.latLng.lng();
                    self.current_position.setPosition(e.latLng);
                });
            });


        });

    }

    edit() {
        const self = this;
        this.veporel.edit_branch(this.branch)
        .map(res => res.json())
        .subscribe((result) => {
            self.util.show_toast('Sucursal editada con éxito');
            self.router.navigate(['/branchs/']);
        }, (error) => {
            console.log();
            self.util.show_toast(error.message);
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
