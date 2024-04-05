export interface ICalendar {
    id: number;
    name: string;
    color: string;
}

export interface IEvent {
    id: number;
    date: string;
    time?: string;
    desc: string;
    calendarId: number;
}

export function getCalendarsEndpoint(): Promise<ICalendar[]>{ 
    return fetch("http://localhost:7000/calendars").then(response => {
        return response.json();
    })
}

export function getEventsEndpoint(from: string, to: string): Promise<IEvent[]>{ 
    return fetch(`http://localhost:7000/events?date_gte=${from}&date_lte=${to}&_sort=date,time`).then(response => {
        return response.json();
    })
}

