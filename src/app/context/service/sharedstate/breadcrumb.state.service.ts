import { Injectable } from '@angular/core';
import { BehaviorSubject, take } from 'rxjs';
import { StateService } from './state.service';

const initialState: BreadcrumbState = {
    breadcrumbs: [],
    activeBreadcrumb: undefined
};

@Injectable({
    providedIn: 'root',
})
export class BreadcrumbStateService extends StateService<BreadcrumbState> {

    breadcrumbList;

    // activeBreadcrumb:

    constructor() {
        super(initialState)
    }

    public setBreadcrumbState(paths: Breadcrumb[]) {
        this.setState({ breadcrumbs: paths })
    }

    public getBreadCrumbState() {
        return this.state$.asObservable();
    }

    get breadcrumbState() {
        return this.state.breadcrumbs;
    }
}



export interface BreadcrumbState {
    breadcrumbs: Breadcrumb[],
    activeBreadcrumb: Breadcrumb
}

export class Breadcrumb {
    key: string;
    label: string;
    icon: string;
    iconType?: IconTypes
    path: string;
}

export enum IconTypes {
    SVG,
    Image,
    Link
}