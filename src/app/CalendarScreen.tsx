import { Box, Button } from '@mui/material';
import CalendersView from "./components/CalendersView";
import CalendersHeader from "./components/CalendersHeader";
import { useEffect, useState } from 'react';
import { IEvent, ICalendar, getEventsEndpoint, getCalendarsEndpoint } from './backend';
import { useParams} from 'react-router-dom';
import { Calendar, generateCalendar } from './components/Calendar';


export function CalendarScreen(){
    const { month } = useParams<{ month: string | undefined }>();
    const [events, setEvents] = useState<IEvent[]>([]);
    const [calendersSelected, setCalendersSelected] = useState<boolean[]>([]);
    const [calendars, setCalendars] = useState<ICalendar[]>([]);
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

    return (
        <>
        <Box display="flex" height="100%" alignItems="stretch">
            <Box borderRight="1px solid rgba(244, 244, 244, 1)" width="16em" padding="8px 16px" display="flex" flexDirection="column" gap={3}>
                <h2>Agenda React</h2>
                <Button variant='contained' color='primary'>Novo Evento</Button>
                <CalendersView 
                    calendars={calendars}
                    toggleCalendar={toggleCalendar}
                    calendersSelected={calendersSelected}
                />             

            </Box>
            <Box flex="1" display="flex" flexDirection="column">
                <CalendersHeader month={month} />
                <Calendar weeks={weeks} />
            </Box>
        </Box>
        </>
    )
}
