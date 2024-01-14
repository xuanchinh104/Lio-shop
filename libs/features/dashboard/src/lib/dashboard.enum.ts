export enum WeekEnum {
    CN,
    T2,
    T3,
    T4,
    T5,
    T6,
    T7,
}

export const DayOfWeekDescription: { [key: number]: string } = {
    [WeekEnum.CN]: 'WEEK.SUNDAY',
    [WeekEnum.T2]: 'WEEK.MONDAY',
    [WeekEnum.T3]: 'WEEK.TUESDAY',
    [WeekEnum.T4]: 'WEEK.WEDNESDAY',
    [WeekEnum.T5]: 'WEEK.THURSDAY',
    [WeekEnum.T6]: 'WEEK.FRIDAY',
    [WeekEnum.T7]: 'WEEK.SATURDAY',
};

export enum ThemeUIEnum {
    THEME_1,
    THEME_2,
}

export const ThemeUI = {
    [ThemeUIEnum.THEME_1]: './assets/images/change-theme/theme2.png',
    [ThemeUIEnum.THEME_2]: './assets/images/change-theme/theme1.png',
};

export enum ThemeColorEnum {
    BLUE,
    VIOLET,
    GREEN,
}

export enum FontEnum {
    INTER,
    ROBOTO,
    TIMESNEW,
}

export const ThemeColorName = {
    [ThemeColorEnum.BLUE]: 'COLOR.BLUE',
    [ThemeColorEnum.VIOLET]: 'COLOR.VIOLET',
    [ThemeColorEnum.GREEN]: 'COLOR.GREEN',
};

export const FontName = {
    [FontEnum.INTER]: 'Inter',
    [FontEnum.ROBOTO]: 'Roboto',
    [FontEnum.TIMESNEW]: 'Times New Roman',
};

export const ThemeColorCode = {
    [ThemeColorEnum.BLUE]: '#0075E1',
    [ThemeColorEnum.VIOLET]: '#6C0FC9',
    [ThemeColorEnum.GREEN]: '#358E54',
};

export const ThemeColorAlias = {
    [ThemeColorEnum.BLUE]: 'blue',
    [ThemeColorEnum.VIOLET]: 'violet',
    [ThemeColorEnum.GREEN]: 'green',
};

export const ThemeColorBanner = {
    [ThemeColorEnum.BLUE]: './assets/images/change-theme/Banner1.svg',
    [ThemeColorEnum.VIOLET]: './assets/images/change-theme/Banner2.svg',
    [ThemeColorEnum.GREEN]: './assets/images/change-theme/Banner3.svg',
};

export const ThemeTopics = [
    './assets/images/background/default.jpg',
    './assets/images/background/default_0.jpg',
    './assets/images/background/default_1.jpg',
    './assets/images/background/default_2.jpg',
    './assets/images/background/default_3.jpg',
    './assets/images/background/default_4.jpeg',
];

export const ConfigUIDefault = {
    theme: ThemeUIEnum.THEME_2,
    font: FontEnum.INTER,
    topicImg: './assets/images/background/default_4.jpeg',
    color: ThemeColorEnum.BLUE,
    banner: './assets/images/change-theme/Banner1.svg',
    themeClass: ThemeUIEnum.THEME_2,
};

export const FontAlias = {
    [FontEnum.INTER]: 'font1',
    [FontEnum.ROBOTO]: 'font2',
    [FontEnum.TIMESNEW]: 'font3',
};

export const ThemeClassName = {
    [ThemeUIEnum.THEME_1]: 'theme-one',
    [ThemeUIEnum.THEME_2]: 'theme-two',
};
