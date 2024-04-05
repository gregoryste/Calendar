import Table from '@mui/material/Table';
import TableRow from '@mui/material/TableRow';
import { TableBody, TableCell, TableContainer, TableHead, makeStyles} from "@material-ui/core";
import { Avatar, Box, Button, Checkbox, FormControlLabel, FormGroup, Icon, IconButton, Typography } from '@mui/material';

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
    const weeks = generateCalendar(getToday());

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
                                    <TableCell align="center" key={cell.date}>{cell.date}</TableCell>
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
}

function generateCalendar(date: string): IGenerateCalendar[][] {
    const weeks: IGenerateCalendar[][] = [];
    const data = new Date(date + "T12:00:00");

    data.setDate(1);

    return weeks;
}

function getToday(){
    return "2024-04-04";
}