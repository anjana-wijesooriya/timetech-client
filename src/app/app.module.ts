import 'tslib';
import { NgModule } from '@angular/core';
import { HashLocationStrategy, LocationStrategy, PathLocationStrategy } from '@angular/common';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { AppLayoutModule } from './layout/app.layout.module';
import { NotfoundComponent } from './context/components/notfound/notfound.component';
import { ProductService } from './context/service/product.service';
import { CountryService } from './context/service/country.service';
import { CustomerService } from './context/service/customer.service';
import { EventService } from './context/service/event.service';
import { IconService } from './context/service/icon.service';
import { NodeService } from './context/service/node.service';
import { PhotoService } from './context/service/photo.service';
import { JwtModule } from '@auth0/angular-jwt';
import { LocalStorage } from './context/shared/enum/local-storage.enum';
import { StoreModule } from '@ngrx/store';

export function getToken() {
    return localStorage.getItem(LocalStorage.JWT);
}

@NgModule({
    declarations: [AppComponent, NotfoundComponent],
    imports: [
        AppRoutingModule,
        AppLayoutModule,
        JwtModule.forRoot({
            config: {
                tokenGetter: getToken,
                allowedDomains: ['localhost:44319'],
                disallowedRoutes: []
            }
        }),
        StoreModule.forRoot({}, {}),
    ],
    providers: [
        { provide: LocationStrategy, useClass: PathLocationStrategy },
        ProductService, CountryService, CustomerService, EventService, IconService, NodeService, PhotoService
        // CountryService, CustomerService, EventService, IconService, NodeService,
        // PhotoService, ProductService
    ],
    bootstrap: [AppComponent],
})
export class AppModule { }