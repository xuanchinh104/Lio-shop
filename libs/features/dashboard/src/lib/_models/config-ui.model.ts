import { FontEnum, ThemeColorEnum, ThemeUIEnum } from '../dashboard.enum';

export interface ConfigUI {
    theme: ThemeUIEnum;
    topicImg: string;
    font: FontEnum;
    color: ThemeColorEnum;
    banner: string;
    themeClass: ThemeUIEnum;
}
