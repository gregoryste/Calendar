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

export interface IUser {
    name: string,
    email: string
}

export function getCalendarsEndpoint(): Promise<ICalendar[]>{ 
    return fetch("http://localhost:8000/calendars", {
        credentials: "include",
    }).then(handleResponse)
}

export function getEventsEndpoint(from: string, to: string): Promise<IEvent[]>{ 
    return fetch(`http://localhost:8000/events?date_gte=${from}&date_lte=${to}&_sort=date,time`, {
        credentials: "include",
    }).then(handleResponse)
}

export function createEventEndpoint(event: IEditingEvent): Promise<IEvent[]>{ 
    return fetch(`http://localhost:8000/events`, {
        credentials: "include",
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(event)
    }).then(handleResponse)
}

export function updateEventEndpoint(event: IEditingEvent): Promise<IEvent[]>{ 
    return fetch(`http://localhost:8000/events/${event.id}`, {
        credentials: "include",
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(event)
    }).then(handleResponse)
}

export function deleteEventEndpoint(eventId: number): Promise<void>{ 
    return fetch(`http://localhost:8000/events/${eventId}`, {
        credentials: "include",
        method: "DELETE"
    }).then(handleResponse)
}

export function getUserEndpoint(): Promise<IUser>{ 
    return fetch(`http://localhost:8000/auth/user`, {
        credentials: "include",
    }).then(handleResponse)
}

export function signInEndpoint(email: string, password: string): Promise<IUser> {
    return fetch(`http://localhost:8000/auth/login`, {
        credentials: "include",
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({email, password})
    }).then(handleResponse)
}

export function signOutEndpoint(): Promise<IUser> {
    return fetch(`http://localhost:8000/auth/logout`, {
        credentials: "include",
        method: "POST",
    }).then(handleResponse)
}

function handleResponse(response: Response){
    if(response.ok){
        return response.json();
    }else {
        throw new Error(response.statusText);
    }
}
