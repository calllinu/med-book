import { CalendarChangeParams } from 'primereact/calendar';
import { ColumnBodyType, ColumnEditorOptions, ColumnEditorType, ColumnHeaderType } from 'primereact/column';
import { DataTablePFSEvent } from 'primereact/datatable';
import { DropdownChangeParams } from 'primereact/dropdown';
import { MenuItem, MenuItemOptions } from 'primereact/menuitem';
import { MultiSelectChangeParams } from 'primereact/multiselect';

export interface ILazyParams extends DataTablePFSEvent {
  search: string;
  page: number;
  filterBy: string | number;
}

export interface ITableColumn {
  style?: object;
  sortable?: boolean;
  header?: ColumnHeaderType;
  body?: ColumnBodyType;
  editor?: ColumnEditorType;
  field?: string;
}

export interface ITableColumnOptions extends ColumnEditorOptions {}

export interface ISidebarItem extends MenuItem {
  active?: boolean;
  iconName?: string;
  onClick?: () => void;
}

export interface IDatepickerParams extends CalendarChangeParams {
  value: Date;
}

export interface IDropdownParams extends DropdownChangeParams {}

export interface IMultiselectParams extends MultiSelectChangeParams {}

export interface ITabMenu extends MenuItem {
  link?: string;
  index?: number;
}

export interface ITabMenuOptions extends MenuItemOptions {}

export interface IDropdownType {
  value?: string | number;
  label?: string;
  index?: number;
}

export interface IPagination {
  currentPage: number;
  limitValue: number;
  totalCount: number;
  totalPages: number;
}

export interface ICompany {
  details: string;
  id: string;
  isDeleted: boolean;
  name: string;
  uid: string;
}

export interface ILabel {
  name: string;
  uid: string;
}

export interface ITableFilter {
  label: string;
  roleEq: string | number;
}

export interface ILabel {
  color: string;
  details: string;
  id: string;
  isDeleted: boolean;
  labelType: string;
  name: string;
  options: ILabelsOptions[];
  position: number;
  uid: string;
  updatedAt: string;
  value: string;
}

export interface ILabelsOptions {
  name: string;
}
export interface IUidResponse {
  uid: string;
}
