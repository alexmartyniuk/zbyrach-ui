export class Mailing {
    scheduleType: ScheduleType;
    numberOfArticles: number;
}

export class SettingsSummary {
    scheduleType: ScheduleType;
    numberOfTags: number;
}

export enum ScheduleType
{
    Undefined = 0,
    Never = 1,
    EveryDay = 2,
    EveryWeek = 3,
    EveryMonth = 4
}