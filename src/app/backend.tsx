export interface ICalendar {
    id: number;
    name: string;
    color: string;
}

export interface IEditingEvent {
    id?: number;
    date: string;
    time?: string;
    desc: string;
    calendarId: number;
}

export interface IEvent extends IEditingEvent {
    id: number;
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

export function createEventEndpoint(event: IEditingEvent): Promise<IEvent[]>{ 
    return fetch(`http://localhost:7000/events`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(event)
    }).then(response => {
        return response.json();
    })
}

export function updateEventEndpoint(event: IEditingEvent): Promise<IEvent[]>{ 
    return fetch(`http://localhost:7000/events/${event.id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(event)
    }).then(response => {
        return response.json();
    })
}

export function deleteEventEndpoint(eventId: number): Promise<void>{ 
    return fetch(`http://localhost:7000/events/${eventId}`, {
        method: "DELETE"
    }).then(response => {
        return response.json();
    })
}
