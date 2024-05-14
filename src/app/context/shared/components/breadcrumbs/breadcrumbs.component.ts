import { ChangeDetectionStrategy, ChangeDetectorRef, Component, DoCheck, NgZone, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, NavigationEnd, NavigationError, NavigationStart, Router } from '@angular/router';
import { distinctUntilChanged, filter, map } from 'rxjs';
import { Breadcrumb, BreadcrumbStateService } from 'src/app/context/service/sharedstate/breadcrumb.state.service';

@Component({
  selector: 'app-breadcrumbs',
  templateUrl: './breadcrumbs.component.html',
  styleUrl: './breadcrumbs.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BreadcrumbsComponent implements OnInit, DoCheck {
  breadcrumbs: any[];
  pageTitle: string;
  isShowDatePicker: boolean;
  isShowDropDown: boolean;

  constructor(private route: ActivatedRoute, private router: Router, private breadcrumbState: BreadcrumbStateService,
    public titleService: Title, public zone: NgZone, private ref: ChangeDetectorRef
  ) {
    // this.router;
    // debugger


    // this.router.events.pipe(
    //   filter(event => event instanceof NavigationEnd)
    // ).subscribe(() => {
    //   let bread = this.createBreadcrumbs(this.route.root);
    //   console.log(bread)
    // });

  }
  // ngOnChanges(changes: SimpleChanges): void {
  //   this.pageTitle = this.titleService.getTitle();
  // }

  // this.zone.run(() => this.donations = donations)

  ngDoCheck(): void {
    this.showWidgets();
  }

  ngOnInit() {
    // this.route.data.subscribe((data) => {
    //   console.log(data); // This will log the static data object
    // });
    this.breadcrumbState.getBreadCrumbState().subscribe(res => {
      this.breadcrumbs = res.breadcrumbs as Breadcrumb[];

      // setTimeout(() => {
      //   this.showWidgets();
      // }, 1000);
    })

    this.router.events.subscribe((event: any): void => {
      // this.pageTitle = '';
      if (event instanceof NavigationStart) {
        // Show loading indicator
      }

      if (event instanceof NavigationEnd) {
        // Hide loading indicator
        // this.pageTitle = this.titleService.getTitle();
        setTimeout(() => {
          this.showWidgets()
        }, 1000);
      }

      if (event instanceof NavigationError) {
        // Hide loading indicator
        let errorEvent = event as NavigationError;

        // Present error to user
        console.log(errorEvent.error);
      }
    });
  }

  showWidgets() {
    this.isShowDatePicker = false;
    this.isShowDatePicker = false;
    switch (this.titleService.getTitle()) {
      case 'Employee Dashboard':
        this.isShowDatePicker = true;
        break;
      case 'Employee Details':
        this.isShowDropDown = true;
        break;
      default:
        break;

    }
    this.ref.detectChanges();
  }

  private createBreadcrumbs(route: ActivatedRoute, url: string = '', breadcrumbs: Array<{ label: any, url: string }> = []): Array<{ label: string, url: string }> {
    const children: ActivatedRoute[] = route.children;

    if (children.length === 0) {
      return breadcrumbs;
    }

    for (const child of children) {
      const routeURL: string = child.snapshot.url.map(segment => segment.path).join('/');
      if (routeURL !== '') {
        url += `/${routeURL}`;
      }

      breadcrumbs.push({ label: child.snapshot.data, url: url });
      return this.createBreadcrumbs(child, url, breadcrumbs);
    }

    return breadcrumbs;
  }

  buildBreadCrumb(route: ActivatedRoute, url: string = '', breadcrumbs: any[] = []): any[] {
    //If no routeConfig is avalailable we are on the root path
    let label = route.routeConfig && route.routeConfig.data ? route.routeConfig.data['breadcrumb'] : '';
    let path = route.routeConfig && route.routeConfig.data ? route.routeConfig.path : '';

    // If the route is dynamic route such as ':id', remove it
    const lastRoutePart = path.split('/').pop();
    const isDynamicRoute = lastRoutePart.startsWith(':');
    if (isDynamicRoute && !!route.snapshot) {
      const paramName = lastRoutePart.split(':')[1];
      path = path.replace(lastRoutePart, route.snapshot.params[paramName]);
      label = route.snapshot.params[paramName];
    }

    //In the routeConfig the complete path is not available,
    //so we rebuild it each time
    const nextUrl = path ? `${url}/${path}` : url;

    const breadcrumb: any = {
      label: label,
      url: nextUrl,
    };
    // Only adding route with non-empty label
    const newBreadcrumbs = breadcrumb.label ? [...breadcrumbs, breadcrumb] : [...breadcrumbs];
    if (route.firstChild) {
      //If we are not on our current path yet,
      //there will be more children to look after, to build our breadcumb
      return this.buildBreadCrumb(route.firstChild, nextUrl, newBreadcrumbs);
    }
    return newBreadcrumbs;
  }

}
