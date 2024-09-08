import { Component } from '@angular/core';
import { FieldType, FieldTypeConfig } from '@ngx-formly/core';

@Component({
    selector: 'tree-select-custom',
    template: ` <div class="flex w-full align-items-center py-2 gap-2" [class]="props['styleClass']">
                <label for="float-label" class="font-medium text-900">{{props.label}}</label>
                 <p-treeSelect  [formControl]="formControl" [formlyAttributes]="field" />
            </div>`,
})
export class TreeSelectCustom extends FieldType<FieldTypeConfig> { }