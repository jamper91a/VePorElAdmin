import { Component, OnInit } from '@angular/core';

declare var $: any;

@Component({
    moduleId: module.id,
    selector: 'pricing-cmp',
    templateUrl: './pricing.component.html'
})

export class PricingComponent implements OnInit {
    test: Date = new Date();

    checkFullPageBackgroundImage() {
        const $page = $('.full-page');
        const image_src = $page.data('image');

        if (image_src !== undefined) {
            const image_container = '<div class="full-page-background" style="background-image: url(' + image_src + ') "/>';
            $page.append(image_container);
        }
    }
    ngOnInit() {
        this.checkFullPageBackgroundImage();
    }
}
