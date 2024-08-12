import { Component, OnInit } from '@angular/core';
import { PrimeNGConfig } from 'primeng/api';
import { AppConfig, LayoutService } from './layout/service/app.layout.service';
import { Router, Event, NavigationEnd } from '@angular/router';
import Alpine from 'alpinejs';
import { initTWE, Ripple } from 'tw-elements';

import { IStaticMethods } from 'preline/preline';
declare global {
  interface Window {
    HSStaticMethods: IStaticMethods;
    Alpine: IStaticMethods;
  }
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {

  constructor(private primengConfig: PrimeNGConfig, private layoutService: LayoutService, private router: Router) { }

  ngOnInit() {
    this.primengConfig.ripple = true;

    this.primengConfig.ripple = true;       //enables core ripple functionality

    //optional configuration with the default configuration
    const config: AppConfig = {
      menuColor: 'white',
      ripple: true,                      //toggles ripple on and off
      inputStyle: 'outlined',             //default style for input elements
      menuMode: 'static',                 //layout mode of the menu, valid values are "static" and "overlay"
      colorScheme: 'light',               //color scheme of the template, valid values are "light" and "dark"
      theme: 'saga-light-orange',         //default component theme for PrimeNG
      scale: 13                           //size of the body font size to scale the whole application
    };
    this.layoutService.config.set(config);

    this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationEnd) {
        setTimeout(() => {
          window.HSStaticMethods.autoInit();
        }, 200);
      }
    });

    window.Alpine = Alpine;

    window.HSStaticMethods.autoInit();

    initTWE({ Ripple });

    Alpine.start();
  }
}

