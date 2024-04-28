export class TreeModel {
    label: string;
    value: number;
    html: string;
    key: string;
    disabled: boolean;
    checked: boolean;
    expanded: boolean;
    selected: boolean;
    items: TreeModel[];
    icon: string;
    iconSize: string;
    children: TreeModel[];
}