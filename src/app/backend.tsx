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
    return fetch("https://localhost:8080/calendars").then(response => {
        return response.json();
    })
}

export function getEventsEndpoint(): Promise<IEvent[]>{ 
    return fetch("https://localhost:8080/events").then(response => {
        return response.json();
    })
}

