import React from 'react';
import { ICalendar } from '../backend';
import { Box, Checkbox, FormControlLabel, FormGroup } from '@mui/material';
import { ICalendarScreenAction } from '../calendarScreenReducer';


interface ICalendarViewsProps {
    calendars: ICalendar[],
    dispatch:  React.Dispatch<ICalendarScreenAction>,
    calendersSelected: boolean[]
}

export const CalendersView = React.memo(function(props: ICalendarViewsProps){
    const { calendars, calendersSelected } = props;
    return (
        <>
                <Box marginTop={4}>
                    <h3>Agendas</h3>      
                    <FormGroup>
                        {calendars.map((calendar, i) => (
                            <FormControlLabel key={calendar.id} control={
                                <Checkbox style={{ color: calendar.color }} checked={calendersSelected[i]} onChange={() => props.dispatch({type: "toggleCalendar", payload: i})} />
                            } label={calendar.name} />
                        ))}
                    </FormGroup>
                </Box>              
        </>
    )
})