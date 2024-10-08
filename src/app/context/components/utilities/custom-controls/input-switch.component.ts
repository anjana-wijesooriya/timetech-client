import { Component } from '@angular/core';
import { FieldType, FieldTypeConfig } from '@ngx-formly/core';

@Component({
    selector: 'input-switch-custom',
    template: ` <div class="w-full py-2" [class]="props['styleClass']">
                <label for="float-label" class="font-medium text-surface-900 dark:text-surface-0">{{props.label}}</label>
                <div class="flex items-center w-auto">
                    <p-inputSwitch class="" id="visa-cost" triggers="focus"
                    [formControl]="formControl" [formlyAttributes]="field"></p-inputSwitch>
                </div>
            </div>`,
})
export class InputSwitchCustom extends FieldType<FieldTypeConfig> { }