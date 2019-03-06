import {Routes} from '@angular/router';
import {CreateofferComponent} from './create/createoffer.component';
import {ReportsComponent} from './reports/reports.component';
import {ListOffersComponent} from './list/list-offers.component';

export const OffersRoutes: Routes = [

    {
        path: '',
        children: [
            {
                path: 'create',
                component: CreateofferComponent
            },{
                path: '',
                component: ListOffersComponent
            },
            {
                path: 'reports',
                component: ReportsComponent
            }
        ]
    }
];
