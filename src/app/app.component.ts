import { Component, OnInit, ElementRef } from '@angular/core';
import {Router, ActivatedRoute, NavigationEnd} from '@angular/router';
import { Subscription } from 'rxjs/Subscription';

@Component({
    selector: 'app-my-app',
    templateUrl: './app.component.html'
})

export class AppComponent implements OnInit {
    private _router: Subscription;

    constructor(
        private elRef: ElementRef,
        private router: Router

    ) {}
    ngOnInit() {
        this._router = this.router.events.filter(event => event instanceof NavigationEnd).subscribe((event: NavigationEnd) => {
            const body = document.getElementsByTagName('body')[0];
            const modalBackdrop = document.getElementsByClassName('modal-backdrop')[0];
            if (body.classList.contains('modal-open')) {
                body.classList.remove('modal-open');
                modalBackdrop.remove();
            }
        });
    }
}
