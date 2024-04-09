import Table from '@mui/material/Table';
import TableRow from '@mui/material/TableRow';
import { TableBody, TableCell, TableContainer, TableHead, makeStyles} from "@material-ui/core";
import { Avatar, Box, Button, Checkbox, FormControlLabel, FormGroup, Icon, IconButton, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { IEvent, ICalendar, getEventsEndpoint, getCalendarsEndpoint } from './backend';

const daysWeek = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sab"];

const useStyles = makeStyles({
    table: {
        borderTop: "1px solid rgba(244, 244, 244, 1)",
        minHeight: "100%",
        tableLayout: "fixed",
        "& td": {
            verticalAlign: "top",
            overflow: "hidden",
            padding: "8px 4px",
        },
        "& td ~ td, & th ~ th": {
            borderLeft: "1px solid rgba(244, 244, 244, 1)"
        },
        "& th": {
            borderTop: "1px solid rgba(244, 244, 244, 1)"
        },
        "& th:first-child, & td:first-child": {
            borderLeft: "1px solid rgba(244, 244, 244, 1)"
        },
        "& th:last-child, & td:last-child": {
            borderRight: "1px solid rgba(244, 244, 244, 1)"
        }
    },
    dayOfMonth: {
        fontWeight: 500,
        marginBottom: "4px",
    },
    event: {
        display: "flex",
        alignItems: "center",
        background: "none",
        border: "none",
        cursor: "pointer",
        textAlign: "left",
        whiteSpace: "nowrap"
    },
    eventBackground: {
        marginTop: "8px",
        display: "inline-block",
        color: "white",
        padding: "4px",
        borderRadius: "4px"
    }
})


export function CalendarScreen(){
    const classes = useStyles();
    const [events, setEvents] = useState<IEvent[]>([]);
    const [calendersSelected, setCalendersSelected] = useState<boolean[]>([]);
    const [calendars, setCalendars] = useState<ICalendar[]>([]);
    const weeks = generateCalendar(getToday(), events, calendars, calendersSelected)
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

            </Box>
            <Box flex="1" display="flex" flexDirection="column">
                <Box display="flex" alignItems="center" padding="8px 10px">
                    <Box>
                        <IconButton aria-label='Previous Month'>
                            <Icon>chevron_left</Icon>
                        </IconButton>
                        <IconButton aria-label='Next Month'>
                            <Icon>chevron_right</Icon>
                        </IconButton>
                    </Box>
                    <Box component="h3"  marginLeft="16px" flex="1">Jule, 2021</Box>
                    <IconButton>
                        <Avatar>
                            <Icon>person</Icon>
                        </Avatar>
                    </IconButton>
                </Box>

                <TableContainer component={"div"} style={{ flex: "1" }}>
                    <Table className={classes.table} aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                {daysWeek.map(day => (
                                    <TableCell align="center" key={day}>{day}</TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {weeks.map((week, i) => (
                                <TableRow>      
                                    {week.map(cell => (
                                        <TableCell align="center" key={cell.date}>
                                            <div className={classes.dayOfMonth}>{cell.dayOfMonth}</div>

                                            {cell.events.map(event => {
                                                const color = event.calendar.color

                                                return(
                                                    <button key={event.id} className={classes.event}>
                                                        { event.time && (
                                                            <>
                                                                <Icon style={{ color }} fontSize='inherit'>watch_later</Icon>
                                                                <Box component="span" margin="0 4px">{event.time}</Box>
                                                            </>
                                                        )}
                                                        {event.time ? <span>{event.desc}</span> : <div className={classes.eventBackground} style={{background: color}}>
                                                            {event.desc}
                                                        </div>}
                                                    </button>
                                                )
                                            })}
                                        </TableCell>

                                    ))}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
        </Box>
        </>
    )
}

type IEventWithCalendar = IEvent & { calendar: ICalendar };

interface IGenerateCalendar {
    date: string;
    dayOfMonth: number;
    events: IEventWithCalendar[];
}

function generateCalendar(date: string, allEvents: IEvent[], calendars: ICalendar[], calendersSelected: boolean[]): IGenerateCalendar[][] {
    const weeks: IGenerateCalendar[][] = [];
    const data = new Date(date + "T12:00:00");
    const currentMonth = data.getMonth();

    const currentDay = new Date(data.valueOf());
    currentDay.setDate(1);
    // Return day of Week
    const dayWeek = currentDay.getDay();
    currentDay.setDate(1 - dayWeek);

    do {
        const week: IGenerateCalendar[] = [];

        for(let i = 0; i < daysWeek.length; i++){
            let month = (currentDay.getMonth() + 1).toString().padStart(2, "0");
            let day = currentDay.getDate().toString().padStart(2, "0");
            let isoDate = `${currentDay.getFullYear()}-${month}-${day}`;
            const events: IEventWithCalendar[] = [];
            for (const event of allEvents){
                if(event.date === isoDate){
                    const calIndex = calendars.findIndex(cal => cal.id === event.calendarId);
                    if(calendersSelected[calIndex]){
                        events.push({ ...event, calendar: calendars[calIndex]});
                    }
                }
            }

            week.push({
                date: isoDate,
                dayOfMonth: currentDay.getDate(),
                events,
            });
            currentDay.setDate(currentDay.getDate() + 1);
        }
        weeks.push(week);
    }while(currentDay.getMonth() === currentMonth);
    
    return weeks;
}

function getToday(){
    return "2021-06-07";
}