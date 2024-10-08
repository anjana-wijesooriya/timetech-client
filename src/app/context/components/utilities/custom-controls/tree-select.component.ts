import { Component } from '@angular/core';
import { FieldType, FieldTypeConfig } from '@ngx-formly/core';

@Component({
    selector: 'tree-select-custom',
    template: ` <div class="flex w-full items-center py-2 gap-2" [class]="props['styleClass']">
                <label for="float-label" class="font-medium text-surface-900 dark:text-surface-0">{{props.label}}</label>
                 <p-treeSelect  [formControl]="formControl" [formlyAttributes]="field" />
            </div>`,
})
export class TreeSelectCustom extends FieldType<FieldTypeConfig> { }