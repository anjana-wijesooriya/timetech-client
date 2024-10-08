import { Component } from '@angular/core';
import { FieldType, FieldTypeConfig } from '@ngx-formly/core';

@Component({
    selector: 'input-color-custom',
    template: ` <div class="flex w-full items-center py-2 gap-2" [class]="props['styleClass']">
                <label for="float-label" class="font-medium text-surface-900 dark:text-surface-0">{{props.label}}</label>
                 <p-colorPicker [formControl]="formControl" [formlyAttributes]="field" styleClass="{{props['class']}}"/>
            </div>`,
})
export class InputColorCustom extends FieldType<FieldTypeConfig> { }