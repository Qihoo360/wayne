import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UnauthorizedComponent } from 'wayne-component';
import { PageNotFoundComponent } from 'wayne-component';

const routes: Routes = [
  {path: '', redirectTo: 'portal/namespace/0/app', pathMatch: 'full'},
  {path: 'unauthorized', component: UnauthorizedComponent},
  {path: '**', component: PageNotFoundComponent},
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule]
})
export class RoutingModule {

}
