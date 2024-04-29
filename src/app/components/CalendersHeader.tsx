import { UserMenu } from "../components/UserMenu";
import { Box, Icon, IconButton } from "@mui/material";
import { addMonths, formatMonth } from "../dateFunctions";
import { Link } from "react-router-dom";

interface ICalendarHeaderProps {
    month?: string,
}

export default function CalendersHeader(props: ICalendarHeaderProps){
    const { month } = props;

    return (
        <>
            <Box display="flex" alignItems="center" padding="8px 10px">
                <Box>
                    <IconButton aria-label='Previous Month' component={Link} to={"/calendar/" + addMonths(month!, -1)}>
                        <Icon>chevron_left</Icon>
                    </IconButton>

                    <IconButton aria-label='Next Month' component={Link} to={"/calendar/" + addMonths(month!, 1)}>
                        <Icon>chevron_right</Icon>
                    </IconButton>

                </Box>
                <Box component="h3"  marginLeft="16px" flex="1">
                    {formatMonth(month!)}
                </Box>
                <UserMenu />
            </Box>
        </>
    )
}