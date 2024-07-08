import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { NotfoundComponent } from './context/components/notfound/notfound.component';
import { AppLayoutComponent } from "./layout/app.layout.component";
import { IconTypes, Breadcrumb } from './context/service/sharedstate/breadcrumb.state.service';

@NgModule({
    imports: [
        RouterModule.forRoot([
            {
                path: '', component: AppLayoutComponent, data: { breadcrumb: { path: '', label: 'App', key: '1', icon: 'pi pi-share-alt' } },
                children: [
                    {
                        path: 'dashboard', loadChildren: () => import('./context/components/dashboard/dashboard.module').then(m => m.DashboardModule),
                        data: { breadcrumb: { path: '', label: 'Self-Service', key: '1', icon: 'pi pi-share-alt' } }
                    },
                    { path: 'self-service', loadChildren: () => import('./context/components/selfservice/selfservice.module').then(m => m.SelfServiceModule) },
                    { path: 'masters', loadChildren: () => import('./context/components/masters/masters.module').then(m => m.MastersModule) },
                    // { path: 'uikit', loadChildren: () => import('./context/components/uikit/uikit.module').then(m => m.UIkitModule) },
                    { path: 'utilities', loadChildren: () => import('./context/components/utilities/utilities.module').then(m => m.UtilitiesModule) },
                    { path: 'documentation', loadChildren: () => import('./context/components/documentation/documentation.module').then(m => m.DocumentationModule) },
                    { path: 'blocks', loadChildren: () => import('./context/components/primeblocks/primeblocks.module').then(m => m.PrimeBlocksModule) },
                    { path: 'pages', loadChildren: () => import('./context/components/pages/pages.module').then(m => m.PagesModule) },
                    { path: '', redirectTo: '/self-service/dashboard', pathMatch: 'full' },
                    { path: 'TimeTechCore/pages/Personal/EmployeeMaster.aspx', redirectTo: 'masters/employees', pathMatch: 'full' },
                    { path: 'TimeTechCore/pages/Masters/supportMaster.aspx', redirectTo: 'masters/support', pathMatch: 'full' },
                    { path: 'TimeTechCore/pages/TA/Holiday.aspx', redirectTo: 'masters/holidays', pathMatch: 'full' },
                ]
            },
            { path: 'auth', loadChildren: () => import('./context/components/auth/auth.module').then(m => m.AuthModule) },
            { path: 'landing', loadChildren: () => import('./context/components/landing/landing.module').then(m => m.LandingModule) },
            // { path: 'notfound', component: NotfoundComponent },
            { path: '**', redirectTo: '/notfound' },
        ], { scrollPositionRestoration: 'enabled', anchorScrolling: 'enabled', onSameUrlNavigation: 'reload' })
    ],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
