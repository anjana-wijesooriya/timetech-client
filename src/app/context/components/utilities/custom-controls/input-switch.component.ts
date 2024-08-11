import { Component } from '@angular/core';
import { FieldType, FieldTypeConfig } from '@ngx-formly/core';

@Component({
    selector: 'input-switch-custom',
    template: ` <div class="w-full py-2" [class]="props['styleClass']">
                <label for="float-label" class="font-medium text-900">{{props.label}}</label>
                <div class="flex align-items-center w-auto">
                    <p-inputSwitch class="" id="visa-cost" triggers="focus"
                    [formControl]="formControl" [formlyAttributes]="field"></p-inputSwitch>
                </div>
            </div>`,
})
export class InputSwitchCustom extends FieldType<FieldTypeConfig> { }