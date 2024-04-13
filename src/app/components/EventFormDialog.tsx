import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { Box, FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { ICalendar, IEditingEvent, createEventEndpoint, deleteEventEndpoint, getEventsEndpoint, updateEventEndpoint } from '../backend';
import { useEffect, useRef, useState } from 'react';

interface IEventFormDialogProps {
    event: IEditingEvent | null;
    calendars: ICalendar[];
    onSave: () => void;
    onCancel: () => void;
}

interface IValidationErrors {
  [field: string]: string;
}

export function EventFormDialog(props: IEventFormDialogProps) {

  const [event, setEvent] = useState<IEditingEvent | null>(props.event);
  const [errors, setErrors] = useState<IValidationErrors>({});

  const inputDate = useRef<HTMLInputElement | null>();
  const inputDesc = useRef<HTMLInputElement | null>();

  useEffect(() => {
    setEvent(props.event);
    setErrors({});
  }, [props.event]);

  const isNew = !event?.id;

  function validate(): boolean{ 
    const currentErrors: IValidationErrors = {};

    if(event){
      if(!event.date){
        currentErrors["date"] = "Date should be completed";
        inputDate.current?.focus();
      }

      if(!event.desc){
        currentErrors["desc"] = "Desc should be completed";
        inputDesc.current?.focus();
      }

      setErrors(currentErrors);
      return Object.keys(currentErrors).length === 0;
    }
        
    return false;
  }

  function save(e: React.FormEvent){
    e.preventDefault();

    if(event){
      if(validate()){
        if(!isNew){
          updateEventEndpoint(event).then(props.onSave);
        }else {
          createEventEndpoint(event).then(props.onSave);
        }
      }
    };
  }

  function deleteEvent(evt: React.FormEvent){
    evt.preventDefault();

    if(event){
      deleteEventEndpoint(event.id!).then(props.onSave);
    }
  }

  return (
    <div>
      <Dialog
        open={!!event}
        onClose={props.onCancel}
        aria-labelledby="form-dialog-title"
      >
        <form onSubmit={save}>
          <DialogTitle>{ isNew ? "Criar Evento" : "Editar Evento"}</DialogTitle>
          <DialogContent>
            { event && <>
              <TextField 
                inputRef={inputDate}
                type="date"
                margin="normal"
                label="Date"
                fullWidth
                value={event.date}
                onChange={(evt) => setEvent({...event, date: evt.target.value})}
                error={!!errors.date}
                helperText={errors.date}
              />
              <TextField 
                inputRef={inputDesc}
                autoFocus
                margin="normal"
                label="Description"
                fullWidth
                value={event.desc}
                onChange={(evt) => setEvent({...event, desc: evt.target.value})}
                error={!!errors.desc}
                helperText={errors.desc}
              />
              <TextField
                type="time"
                autoFocus
                margin="normal"
                label="Time"
                fullWidth
                value={event.time ?? ""}
                onChange={(evt) => setEvent({...event, time: evt.target.value})}
              />
              <FormControl margin="normal" fullWidth>
                <InputLabel id="select-calendar">Agenda</InputLabel>
                  <Select
                  labelId="demo-multiple-name-label"
                  onChange={(evt) => setEvent({...event, calendarId: evt.target.value as number})}>
                    {props.calendars.map(item => (
                      <MenuItem key={item.id} value={item.id}>{item.name}</MenuItem>
                    ))}
                  </Select>
              </FormControl>
            </> }
          </DialogContent>
          <DialogActions>
            { !isNew && (
              <Button type="button" onClick={deleteEvent}>Excluir</Button>
            )}
            <Box flex={1}></Box>
            <Button type="button" onClick={props.onCancel}>Cancel</Button>
            <Button type="submit">Save</Button>
          </DialogActions>
        </form>
      </Dialog>
    </div>
  );
}