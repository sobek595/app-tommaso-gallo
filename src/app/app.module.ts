import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { HomepageComponent } from './pages/homepage/homepage.component';
import { authInterceptor } from './utils/auth.interceptor';
import { urlInterceptor } from './utils/url.interceptor';
import { NavBarComponent } from './components/nav-bar/nav-bar.component';
import { PermessionCardComponent } from './components/permession-card/permession-card.component';
import { AssegnazioneCardComponent } from './components/assegnazione-card/assegnazione-card.component';
import { PermessionDetailComponent } from './pages/permession-detail/permession-detail.component';
import { DettaglioAssegnazioneComponent } from './pages/dettaglio-assegnazione/dettaglio-assegnazione.component';
import { StatisticheComponent } from './pages/statistiche/statistiche.component';
import { PendingOnlyDirective } from './utils/pending-only.directive';
import { ManagerOnlyDirective } from './utils/manager-only.directive';
import { EmployeeOnlyDirective } from './utils/employee-only.directive';
import { CreatePermessionModalComponent } from './components/create-permession-modal/create-permession-modal.component';
import { CreateCorsoModalComponent } from './components/create-corso-modal/create-corso-modal.component';
import { CreateAssegnazioneModalComponent } from './components/create-assegnazione-modal/create-assegnazione-modal.component';
import { CatalogoCorsiComponent } from './pages/catalogo-corsi/catalogo-corsi.component';
import { DettaglioCorsoComponent } from './pages/dettaglio-corso/dettaglio-corso.component';
import { AnaliticsComponent } from './pages/analitics/analitics.component';
import { BaseChartDirective, provideCharts, withDefaultRegisterables } from 'ng2-charts';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    HomepageComponent,
    NavBarComponent,
    PermessionCardComponent,
    AssegnazioneCardComponent,
    PermessionDetailComponent,
    DettaglioAssegnazioneComponent,
    StatisticheComponent,
    PendingOnlyDirective,
    ManagerOnlyDirective,
    EmployeeOnlyDirective,
    CreatePermessionModalComponent,
    CreateCorsoModalComponent,
    CreateAssegnazioneModalComponent,
    CatalogoCorsiComponent,
    DettaglioCorsoComponent,
    AnaliticsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    NgbModule,
    BaseChartDirective
  ],
  providers: [provideHttpClient(
    withInterceptors([urlInterceptor, authInterceptor])
  ), provideCharts(withDefaultRegisterables())],
  bootstrap: [AppComponent]
})
export class AppModule { }
