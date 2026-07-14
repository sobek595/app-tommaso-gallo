import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { authGuard } from './utils/auth.guard';
import { managerGuard } from './utils/manager.guard';
import { HomepageComponent } from './pages/homepage/homepage.component';
import { CatalogoCorsiComponent } from './pages/catalogo-corsi/catalogo-corsi.component';
import { DettaglioCorsoComponent } from './pages/dettaglio-corso/dettaglio-corso.component';
import { DettaglioAssegnazioneComponent } from './pages/dettaglio-assegnazione/dettaglio-assegnazione.component';
import { PermessionDetailComponent } from './pages/permession-detail/permession-detail.component';
import { AnaliticsComponent } from './pages/analitics/analitics.component';

const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'register',
    component: RegisterComponent
  },
  {
    path: 'homepage',
    component: HomepageComponent,
    canActivate: [authGuard],
    children: []
  },
  {
    path: 'analitics',
    component: AnaliticsComponent,
    canActivate: [authGuard, managerGuard]
  },
  {
    path: 'corsi',
    component: CatalogoCorsiComponent,
    canActivate: [authGuard, managerGuard]
  },
  {
    path: 'corsi/:id',
    component: DettaglioCorsoComponent,
    canActivate: [authGuard, managerGuard]
  },
  {
    path: 'assegnazioni/:id',
    component: DettaglioAssegnazioneComponent,
    canActivate: [authGuard]
  },
  {
    path: 'permessi/:id',
    component: PermessionDetailComponent,
    canActivate: [authGuard]
  },
  {
    path: '',
    redirectTo: '/homepage',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
