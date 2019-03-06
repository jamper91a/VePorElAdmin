import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {CommonModule} from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import {AdminRoutes} from './admin.routing';
import {AdminOffersComponent} from './offers/adminofferscomponent';
import {AdminCompanysComponent} from './companys/admincompanyscomponent';
import {AdminBannersComponent} from './banners/adminbannerscomponent';

import { CurrencyMaskModule } from "ng2-currency-mask";

@NgModule({
    imports: [
    CommonModule,
    RouterModule.forChild(AdminRoutes),
    FormsModule,
    ReactiveFormsModule,
    CurrencyMaskModule,
    ],
    declarations: [
    AdminOffersComponent, 
    AdminCompanysComponent,
    AdminBannersComponent,
    ]
})

export class AdminModule {
}
