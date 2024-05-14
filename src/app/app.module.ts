import { HashLocationStrategy, LocationStrategy, PathLocationStrategy } from '@angular/common';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule, provideAnimations } from '@angular/platform-browser/animations';
import { JwtModule } from '@auth0/angular-jwt';
import { StoreModule } from '@ngrx/store';
import 'tslib';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NotfoundComponent } from './context/components/notfound/notfound.component';
import { CountryService } from './context/service/country.service';
import { CustomerService } from './context/service/customer.service';
import { EventService } from './context/service/event.service';
import { IconService } from './context/service/icon.service';
import { NodeService } from './context/service/node.service';
import { PhotoService } from './context/service/photo.service';
import { ProductService } from './context/service/product.service';
import { LocalStorage } from './context/shared/enum/local-storage.enum';
import { AppLayoutModule } from './layout/app.layout.module';

export function getToken() {
    return localStorage.getItem(LocalStorage.JWT);
}

@NgModule({
    declarations: [AppComponent, NotfoundComponent],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
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
        provideAnimations(),
        { provide: LocationStrategy, useClass: PathLocationStrategy },
        ProductService, CountryService, CustomerService, EventService, IconService, NodeService, PhotoService
        // CountryService, CustomerService, EventService, IconService, NodeService,
        // PhotoService, ProductService
    ],
    bootstrap: [AppComponent],
})
export class AppModule { }