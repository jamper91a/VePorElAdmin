import {Routes} from '@angular/router';
import {AdminOffersComponent} from './offers/adminofferscomponent';
import {AdminCompanysComponent} from './companys/admincompanyscomponent';
import {AdminBannersComponent} from './banners/adminbannerscomponent';
 
export const AdminRoutes: Routes = [

    {
        path: '',
        children: [
            {
                path: '',
                component: AdminCompanysComponent
            },{
                path: 'offers',
                component: AdminOffersComponent
            },{
                path: 'companies',
                component: AdminCompanysComponent
            },{
                path: 'banners',
                component: AdminBannersComponent
            }
        ]
    }
];
