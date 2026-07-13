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
import { NavBarComponent } from './components/nav-bar/nav-bar.component';
import { PermessionCardComponent } from './components/permession-card/permession-card.component';
import { PermessionDetailComponent } from './pages/permession-detail/permession-detail.component';
import { PendingOnlyDirective } from './utils/pending-only.directive';
import { ManagerOnlyDirective } from './utils/manager-only.directive';
import { EmployeeOnlyDirective } from './utils/employee-only.directive';
import { CreatePermessionModalComponent } from './components/create-permession-modal/create-permession-modal.component';
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
    PermessionDetailComponent,
    PendingOnlyDirective,
    ManagerOnlyDirective,
    EmployeeOnlyDirective,
    CreatePermessionModalComponent,
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
    withInterceptors([authInterceptor])
  ), provideCharts(withDefaultRegisterables())],
  bootstrap: [AppComponent]
})
export class AppModule { }
