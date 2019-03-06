import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  AgmCoreModule
} from '@agm/core';

import { BrachsRoutes } from './branchs.routing';

import { CreateBranchComponent } from './create/create-branch.component';
import { ListBranchsComponent } from './list/listbranchs.component';
import { EditBranchComponent } from './edit/edit-branch.component';
@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(BrachsRoutes),
    FormsModule,
    ReactiveFormsModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyDvZFVr2cdCCVyLmMBg0-8MaJTJDaHD8pE'
    })
  ],
  declarations: [
    CreateBranchComponent,
    ListBranchsComponent,
    EditBranchComponent
  ]
})

export class BranchsModule {}
