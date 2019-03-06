import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {CommonModule} from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {CreateBannerComponent} from './create/create-banner.component';
import {ListBannersComponent} from './list/list-banners.component';
import {EditBannerComponent} from './edit/edit-banner.component';

import {BannersRoutes} from './banners.routing';
@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		ReactiveFormsModule,
		RouterModule.forChild(BannersRoutes),
	],
	declarations: [
		CreateBannerComponent,
		ListBannersComponent,
		EditBannerComponent
	]
})

export class BannersModule {
}
