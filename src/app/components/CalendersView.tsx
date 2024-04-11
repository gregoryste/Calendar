import { ICalendar } from '../backend';
import { Box, Checkbox, FormControlLabel, FormGroup } from '@mui/material';


interface ICalendarViewsProps {
    calendars: ICalendar[],
    toggleCalendar: (i: number) => void,
    calendersSelected: boolean[]
}

export default function CalendersView(props: ICalendarViewsProps){
    const { calendars, toggleCalendar, calendersSelected } = props;
    return (
        <>
                <Box marginTop={4}>
                    <h3>Agendas</h3>      
                    <FormGroup>
                        {calendars.map((calendar, i) => (
                            <FormControlLabel key={calendar.id} control={
                                <Checkbox style={{ color: calendar.color }} checked={calendersSelected[i]} onChange={() => toggleCalendar(i)} />
                            } label={calendar.name} />
                        ))}
                    </FormGroup>
                </Box>              
        </>
    )
}