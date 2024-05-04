import { ICalendar, IEditingEvent, IEvent } from "./backend";

export interface ICalendarScreenState {
    calendars: ICalendar[],
    calendersSelected: boolean[],
    events: IEvent[],
    editingEvent: IEditingEvent | null;
}

export type ICalendarScreenAction = {
    type: "load";
    payload: { events: IEvent[], calendars?: ICalendar[] };
} | {
    type: "edit",
    payload: IEvent;
} | {
    type: "new",
    payload: string;
} | {
    type: "closeDialog",
} | {
    type: "toggleCalendar",
    payload: number;
}

export function reducer(state: ICalendarScreenState, action: ICalendarScreenAction): ICalendarScreenState{
    switch(action.type){
        case "load":
            const calendars = action.payload.calendars ?? state.calendars;
            const selected = action.payload.calendars ? action.payload.calendars.map(() => true) : state.calendersSelected;
            return { 
                ...state,
                events: action.payload.events,
                calendars,
                calendersSelected: selected,
            };
        case "edit":
            return { 
                ...state,
                editingEvent: action.payload
            }
        case "new":
            return {
                ...state,
                editingEvent: {
                    date: action.payload,
                    desc: "",
                    calendarId: state.calendars[0].id
                }
            }
        case "closeDialog":
            return {
                ...state,
                editingEvent: null
            }
        case "toggleCalendar":
            const calendersSelected = [...state.calendersSelected];
            calendersSelected[action.payload] = !calendersSelected[action.payload];
            return {
                ...state,
                calendersSelected: calendersSelected
            }
        default: 
            return state;
    }
}