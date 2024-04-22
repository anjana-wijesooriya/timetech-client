import { NgModule } from '@angular/core';
import { HashLocationStrategy, LocationStrategy, PathLocationStrategy } from '@angular/common';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { AppLayoutModule } from './layout/app.layout.module';
import { NotfoundComponent } from './demo/components/notfound/notfound.component';
import { ProductService } from './demo/service/product.service';
import { CountryService } from './demo/service/country.service';
import { CustomerService } from './demo/service/customer.service';
import { EventService } from './demo/service/event.service';
import { IconService } from './demo/service/icon.service';
import { NodeService } from './demo/service/node.service';
import { PhotoService } from './demo/service/photo.service';
import { JwtModule } from '@auth0/angular-jwt';
import { LocalStorage } from './demo/shared/enum/local-storage.enum';
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