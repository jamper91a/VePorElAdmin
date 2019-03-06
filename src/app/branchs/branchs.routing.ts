import { Routes } from '@angular/router';

import { CreateBranchComponent } from './create/create-branch.component';
import { ListBranchsComponent } from './list/listbranchs.component';
import { EditBranchComponent } from './edit/edit-branch.component';

export const BrachsRoutes: Routes = [

    {
        path: '',
        children: [ {
            path: 'create',
            component: CreateBranchComponent
        },{
            path: '',
            component: ListBranchsComponent
        },{
            path: 'edit/:id',
            component: EditBranchComponent
        }

        ]
    }
];
