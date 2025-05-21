
import { Actions } from './actions';

export interface Screens{
    ScreenId: string;
    ScreenName: string;
    ModuleId: string;
    IsActive:boolean;
    IsDisabled:boolean;
    Actions:Actions[];
    ScreenCode: string;
    ScreenOrder?: number;
}

export interface NewScreens{
    ScreenId: string;
    ScreenName: string;
    ModuleId: string;
    IsActive:boolean;
    IsDisabled:boolean;
    children:Actions[];
    ScreenCode: string;
    ScreenOrder?: number;
}

