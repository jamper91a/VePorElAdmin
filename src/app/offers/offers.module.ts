import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {CommonModule} from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import {OffersRoutes} from './offers.routing';
import {CreateofferComponent} from './create/createoffer.component';
import {EditOfferComponent} from './edit/edit-offer.component';
import {ListOffersComponent} from './list/list-offers.component';
import {ReportsComponent} from './reports/reports.component';

import { CurrencyMaskModule } from 'ng2-currency-mask';

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(OffersRoutes),
        FormsModule,
        ReactiveFormsModule,
        CurrencyMaskModule,
    ],
    declarations: [
        CreateofferComponent,
        EditOfferComponent,
        ListOffersComponent,
        ReportsComponent
    ]
})

export class OffersModule {
}
