import { Box, Button } from '@mui/material';
import { CalendersView } from "./components/CalendersView";
import CalendersHeader from "./components/CalendersHeader";
import { useCallback, useEffect, useMemo, useReducer } from 'react';
import { getEventsEndpoint, getCalendarsEndpoint } from './backend';
import { useParams} from 'react-router-dom';
import { EventFormDialog } from './components/EventFormDialog';
import { Calendar, generateCalendar } from './components/Calendar';
import { getToday } from './dateFunctions';
import { reducer } from './calendarScreenReducer';

function useCalendarScreenState(month: string | undefined){
    
    const [state, dispatch] = useReducer(reducer, {
        calendars: [],
        calendersSelected: [],
        events: [],
        editingEvent: null,
    });

    const { events, calendars, calendersSelected, editingEvent } = state;

    const weeks = useMemo(() => {
        return generateCalendar(month! + "-01", events, calendars, calendersSelected);
    }, [month, events, calendars, calendersSelected]);

    const firstDate = weeks[0][0].date;
    const lastDate = weeks[weeks.length - 1][6].date;

    useEffect(() => {
        Promise.all([
            getCalendarsEndpoint(),
            getEventsEndpoint(firstDate, lastDate)
        ]).then(([calendars, events]) => {
            dispatch({type: "load", payload: { events, calendars }});
        })
    }, [firstDate, lastDate]);

    function refreshEvents(){
        getEventsEndpoint(firstDate, lastDate).then((events) => {
            dispatch({type: "load", payload: { events }})
        });
    }

    return {
        weeks,
        calendars,
        dispatch,
        refreshEvents,
        calendersSelected, 
        editingEvent
    }
}

export function CalendarScreen(){
    const { month } = useParams<{ month: string | undefined }>();
    const { weeks, calendars, dispatch, refreshEvents, calendersSelected, editingEvent } = useCalendarScreenState(month);

    const closeDialog = useCallback(() => {
        dispatch({ type: "closeDialog"}); 
    }, []);     

    return (
        <>
        <Box display="flex" height="100%" alignItems="stretch">
            <Box borderRight="1px solid rgba(244, 244, 244, 1)" width="16em" padding="8px 16px" display="flex" flexDirection="column" gap={3}>
                <h2>Agenda React</h2>
                <Button variant='contained' color='primary' onClick={() => dispatch({type: "new", payload: getToday()})}>Novo Evento</Button>
                <CalendersView 
                    calendars={calendars}
                    dispatch={dispatch}
                    calendersSelected={calendersSelected}
                />             

            </Box>
            <Box flex="1" display="flex" flexDirection="column">
                <CalendersHeader month={month}/>
                <Calendar weeks={weeks} dispatch={dispatch} />
                <EventFormDialog event={editingEvent} calendars={calendars} onSave={() => {closeDialog(); refreshEvents();}} onCancel={closeDialog}/>
            </Box>
        </Box>
        </>
    )
}
