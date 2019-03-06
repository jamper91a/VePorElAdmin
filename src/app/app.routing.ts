import {Routes} from '@angular/router';
import {LoggedInGuard} from '../providers/providers';
import {AdminLayoutComponent} from './layouts/admin/admin-layout.component';
import {AuthLayoutComponent} from './layouts/auth/auth-layout.component';

export const AppRoutes: Routes = [
    {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
        canActivate: [LoggedInGuard],
    },
    {
        path: '',
        component: AdminLayoutComponent,
        canActivate: [LoggedInGuard],
        children: [
            {
                path: '',
                loadChildren: './branchs/branchs.module#BranchsModule'
            },
            {
                path: 'branchs',
                loadChildren: './branchs/branchs.module#BranchsModule'
            },
            {
                path: 'admin',
                loadChildren: './admin/admin.module#AdminModule'
            },
            {
                path: 'offers',
                loadChildren: './offers/offers.module#OffersModule'
            },
            {
                path: 'banners',
                loadChildren: './banners/banners.module#BannersModule'
            },
            // {
            //     path: '',
            //     loadChildren: './userpage/user.module#UserModule'
            // },
        ]
    },
    {
        path: '',
        component: AuthLayoutComponent,
        children: [{
            path: 'pages',
            loadChildren: './pages/pages.module#PagesModule'
        }]
    }
];
