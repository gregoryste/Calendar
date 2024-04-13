import { Box, Button } from '@mui/material';
import CalendersView from "./components/CalendersView";
import CalendersHeader from "./components/CalendersHeader";
import { useEffect, useState } from 'react';
import { IEvent, ICalendar, IEditingEvent, getEventsEndpoint, getCalendarsEndpoint } from './backend';
import { useParams} from 'react-router-dom';
import { EventFormDialog } from './components/EventFormDialog';
import { Calendar, generateCalendar } from './components/Calendar';
import { getToday } from './dateFunctions';


export function CalendarScreen(){
    const { month } = useParams<{ month: string | undefined }>();
    const [events, setEvents] = useState<IEvent[]>([]);
    const [calendersSelected, setCalendersSelected] = useState<boolean[]>([]);
    const [calendars, setCalendars] = useState<ICalendar[]>([]);

    const [editingEvent, setEditingEvent] = useState<IEditingEvent | null>(null);

    const weeks = generateCalendar(month! + "-01", events, calendars, calendersSelected)
    const firstDate = weeks[0][0].date;
    const lastDate = weeks[weeks.length - 1][6].date;

    useEffect(() => {
        Promise.all([
            getCalendarsEndpoint(),
            getEventsEndpoint(firstDate, lastDate)
        ]).then(([calenders, events]) => {
            setCalendersSelected(calenders.map(() => true));
            setCalendars(calenders)
            setEvents(events)
        })
    }, [firstDate, lastDate]);

    function toggleCalendar(i: number){
        const newValue = [...calendersSelected];
        newValue[i] = !newValue[i];
        setCalendersSelected(newValue);
    }

    function openNewEvent(date: string){
        setEditingEvent({
            date: date,
            desc: "",
            calendarId: calendars[0].id,
        })
    }

    function refreshEvents(){
        getEventsEndpoint(firstDate, lastDate).then(setEvents)
    }

    return (
        <>
        <Box display="flex" height="100%" alignItems="stretch">
            <Box borderRight="1px solid rgba(244, 244, 244, 1)" width="16em" padding="8px 16px" display="flex" flexDirection="column" gap={3}>
                <h2>Agenda React</h2>
                <Button variant='contained' color='primary' onClick={() => openNewEvent(getToday())}>Novo Evento</Button>
                <CalendersView 
                    calendars={calendars}
                    toggleCalendar={toggleCalendar}
                    calendersSelected={calendersSelected}
                />             

            </Box>
            <Box flex="1" display="flex" flexDirection="column">
                <CalendersHeader month={month} />
                <Calendar weeks={weeks} onClickDay={openNewEvent} onClickEvent={setEditingEvent} />
                <EventFormDialog event={editingEvent} calendars={calendars} onSave={() => {setEditingEvent(null); refreshEvents();}} onCancel={() => setEditingEvent(null)}/>
            </Box>
        </Box>
        </>
    )
}
