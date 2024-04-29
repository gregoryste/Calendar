import { makeStyles } from "@material-ui/core";
import { Box, Icon, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material"
import { ICalendar, IEvent } from "../backend";
import { getToday } from "../dateFunctions";

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
        display: "inline-block",
        height: "24px",
        width: "24px",
        lineHeight: "24px",
        fontWeight: 500,
        marginBottom: "4px",
        borderRadius: "50%",
        "&.today": {
            backgroundColor: "#3f51b5",
            color: "white",
        }
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

const daysWeek = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sab"];

interface ICalendarProps {
    weeks: IGenerateCalendar[][];
    onClickDay: (date: string) => void;
    onClickEvent: (event: IEvent) => void;
}

export function Calendar(props: ICalendarProps){
    const classes = useStyles();
    const { weeks } = props;

    function handleClick(e: React.MouseEvent, date: string){
        if(e.target === e.currentTarget){
            props.onClickDay(date);
        }
    }

    return (
        <>
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
                            <TableRow key={i}>
                                {week.map(cell => (
                                <TableCell align="center" key={cell.date} onClick={(me) => handleClick(me, cell.date)}>
                                    <div className={classes.dayOfMonth + (cell.date === getToday() ? " today" : "")}>{cell.dayOfMonth}</div>

                                    {cell.events.map(event => {
                                    const color = event.calendar.color

                                    return(
                                    <button key={event.id} className={classes.event} onClick={() => props.onClickEvent(event)}>
                                        { event.time && (
                                        <>
                                            <Icon style={{ color }} fontSize='inherit'>watch_later</Icon>
                                            <Box component="span" margin="0 4px">{event.time}</Box>
                                        </>
                                        )}
                                        {event.time ? <span>{event.desc}</span> : <div className={classes.eventBackground}
                                            style={{background: color}}>
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
        </>
    )
}


export type IEventWithCalendar = IEvent & { calendar: ICalendar };

export interface IGenerateCalendar {
    date: string;
    dayOfMonth: number;
    events: IEventWithCalendar[];
}

export function generateCalendar(date: string, allEvents: IEvent[], calendars: ICalendar[], calendersSelected: boolean[]): IGenerateCalendar[][] {
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

        for(let i = 0; i < 7; i++){
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