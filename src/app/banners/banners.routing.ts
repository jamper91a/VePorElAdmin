import {Routes} from '@angular/router';
import {CreateBannerComponent} from './create/create-banner.component';
import {ListBannersComponent} from './list/list-banners.component';
import {EditBannerComponent} from './edit/edit-banner.component';

export const BannersRoutes: Routes = [

{
	path: '',
	children: [
	{
		path: 'create',
		component: CreateBannerComponent
	},
	{
		path: 'list',
		component: ListBannersComponent
	},{
		path: 'edit',
		component: EditBannerComponent
	}
	]
}
];
