import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { ICalendar } from '../backend';
import { useEffect, useState } from 'react';

export interface IEditingEvent {
  id?: number;
  date: string;
  time?: string;
  desc: string;
  calendarId: number;
}

interface IEventFormDialogProps {
    event: IEditingEvent | null;
    calendars: ICalendar[];
    onClose: () => void;
}

export function EventFormDialog(props: IEventFormDialogProps) {

  const [event, setEvent] = useState<IEditingEvent | null>(props.event);

  useEffect(() => {
    setEvent(props.event);
  }, [props.event]);

  return (
    <div>
      <Dialog
        open={!!event}
        onClose={props.onClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle>Novo Evento</DialogTitle>
        <DialogContent>
          { event && <>
            <TextField type="date" margin="normal" label="Date" fullWidth value={event.date} onChange={(evt) => setEvent({...event, date: evt.target.value})}/>
            <TextField autoFocus margin="normal" label="Description" fullWidth value={event.desc} onChange={(evt) => setEvent({...event, desc: evt.target.value})}/>
            <TextField type="time" autoFocus margin="normal" label="Time" fullWidth value={event.time ?? ""} onChange={(evt) => setEvent({...event, time: evt.target.value})}/>
            <FormControl margin="normal" fullWidth>
              <InputLabel id="select-calendar">Agenda</InputLabel>
                <Select labelId="demo-multiple-name-label" onChange={(evt) => setEvent({...event, calendarId: evt.target.value as number})}>
                  {props.calendars.map(item => (
                    <MenuItem key={item.id} value={item.id}>{item.name}</MenuItem>
                  ))}
                </Select>
            </FormControl>
          </> }
        </DialogContent>
        <DialogActions>
          <Button onClick={props.onClose}>Cancel</Button>
          <Button type="submit">Save</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}