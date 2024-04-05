import Table from '@mui/material/Table';
import TableRow from '@mui/material/TableRow';
import { TableBody, TableCell, TableContainer, TableHead, makeStyles} from "@material-ui/core";
import { Avatar, Box, Button, Checkbox, FormControlLabel, FormGroup, Icon, IconButton, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { IEvent, getEventsEndpoint } from './backend';

const daysWeek = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sab"];

const useStyles = makeStyles({
    table: {
        borderTop: "1px solid rgba(244, 244, 244, 1)",
        minHeight: "100%",
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
})


export function CalendarScreen(){
    const classes = useStyles();
    const [events, setEvents] = useState<IEvent[]>([]);
    const weeks = generateCalendar(getToday(), events)
    const firstDate = weeks[0][0].date;
    const lastDate = weeks[weeks.length - 1][6].date;


    useEffect(() => {
        getEventsEndpoint(firstDate, lastDate).then(setEvents)
    }, [firstDate, lastDate]);

    return (
        <>
        <Box display="flex" height="100%" alignItems="stretch">
            <Box borderRight="1px solid rgba(244, 244, 244, 1)" width="16em" padding="8px 16px" display="flex" flexDirection="column" gap={3}>
                <h2>Agenda React</h2>
                <Button variant='contained' color='primary'>Novo Evento</Button>
                <Box marginTop={4}>
                    <h3>Agendas</h3>      
                    <FormGroup>
                        <FormControlLabel control={<Checkbox />} label="Pessoal" />
                        <FormControlLabel control={<Checkbox />} label="Trabalho" />
                    </FormGroup>
                </Box>              

            </Box>
            <TableContainer component={"div"}>
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
                                        {cell.date}


                                        {cell.events.map(event => (
                                            <div>
                                                {event.time || ""} {event.desc}
                                            </div>
                                        ))}
                                    </TableCell>

                                ))}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
        </>
    )
}

interface IGenerateCalendar {
    date: string;
    events: IEvent[];
}

function generateCalendar(date: string, allEvents: IEvent[]): IGenerateCalendar[][] {
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
            week.push({date: isoDate, events: allEvents.filter(e => e.date === isoDate)});
            currentDay.setDate(currentDay.getDate() + 1);
        }

        weeks.push(week);
    }while(currentDay.getMonth() === currentMonth);
    
    return weeks;
}

function getToday(){
    return "2021-06-07";
}