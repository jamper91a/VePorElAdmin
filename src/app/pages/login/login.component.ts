import {Component, ElementRef, OnInit} from '@angular/core';
import { VePorEl } from '../../../providers/veporel';
import {Util} from '../../../providers/util';
import {Router} from '@angular/router';
import {element} from 'protractor';
declare var $: any;

@Component({
    moduleId: module.id,
    selector: 'app-login',
    templateUrl: './login.component.html'
})

export class LoginComponent implements OnInit {
    public body = {
        username: '',
        password: ''
    };
    test: Date = new Date();
    public toggleButton: any;
    public sidebarVisible: boolean;
    public nativeElement: Node;

    constructor(private veporel: VePorEl,
                private util: Util,
                private router: Router,
                private element: ElementRef) {
        this.nativeElement = element.nativeElement;
        this.sidebarVisible = false;
    }

    ngOnInit() {
        var navbar : HTMLElement = this.element.nativeElement;
        this.toggleButton = navbar.getElementsByClassName('navbar-toggle')[0];
        const body = document.getElementsByTagName('body')[0];
        body.classList.add('login-page');
        body.classList.add('off-canvas-sidebar');
        const card = document.getElementsByClassName('card')[0];
        setTimeout(function() {
            // after 1000 ms we add the class animated to the login/register card
            card.classList.remove('card-hidden');
        }, 700);
    }
    sidebarToggle() {
        var toggleButton = this.toggleButton;
        var body = document.getElementsByTagName('body')[0];
        var sidebar = document.getElementsByClassName('navbar-collapse')[0];
        if (this.sidebarVisible == false) {
            setTimeout(function() {
                toggleButton.classList.add('toggled');
            }, 500);
            body.classList.add('nav-open');
            this.sidebarVisible = true;
        } else {
            this.toggleButton.classList.remove('toggled');
            this.sidebarVisible = false;
            body.classList.remove('nav-open');
        }
    }
    ngOnDestroy(){
        const body = document.getElementsByTagName('body')[0];
        body.classList.remove('login-page');
        body.classList.remove('off-canvas-sidebar');
    }

    login() {
        const self = this;
        this.veporel.login(this.body)
            .map(res => res.json())
            .subscribe((result) => {
                // Alamaceno las variables
                delete result.user.id;
                delete result.user.temp_password;
                delete result.user.refer_code;
                delete result.user.refer_code;
                delete result.user.facebook;
                delete result.user.push_code;
                delete result.user.createdAt;
                delete result.user.updatedAt;
                delete result.user.company.id;
                delete result.user.company.camara_comercio;
                delete result.user.company.rut;
                delete result.user.company.createdAt;
                delete result.user.company.updatedAt;
                self.util.savePreference(self.util.constants.logged, 'true');
                self.util.savePreference(self.util.constants.user, JSON.stringify(result.user));
                self.util.savePreference(self.util.constants.token, result.token);
                self.util.savePreference(self.util.constants.group, result.group);
                if (result.group === 1) {
                self.router.navigate(['/admin/companies']);
                }
                if (result.group === 2) {
                self.router.navigate(['/']);
                }
            }, (err) => {
                const body = JSON.parse(err._body);
                if (body.code === -1) {
                    self.util.show_toast('Usuario y/o contraseña incorrectos', 'warning');
                } else if (body.code === -2) {
                    self.util.show_toast('Usuario no existe', 'warning');
                } else if (body.code === -3) {
                    self.util.show_toast('Correo no verificado', 'warning');
                }
            }
        );
    }
}
