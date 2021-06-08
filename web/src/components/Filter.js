import { TextField } from "@material-ui/core";
import labels from "../labels";
import DateFnsUtils from '@date-io/date-fns';
import * as locales from "date-fns/locale";
import { DatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";

const format = "dd MMMM yyyy";
const endOfDay = d => { d.setHours(23, 59, 59, 999); return d; };
const locale = locales[process.env.REACT_APP_LANG];

const Filter = ({ filter, setFilter }) => {
  const dateSince = filter.dateSince;
  const dateUntil = filter.dateUntil;
  const roomFilter = filter.roomFilter;
  const setSinceDate = date => setFilter(oldFilter => ({
    ...oldFilter, dateSince: new Date(date),
  }));
  const setUntilDate = date => setFilter(oldFilter => ({
    ...oldFilter, dateUntil: endOfDay(new Date(date)),
  }));
  const setRoomFilter = e => setFilter(oldFilter => ({
    ...oldFilter, roomFilter: e.target.value,
  }));

  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils} locale={locale}>
      <div className="padding">
        <span className="paddingRight">{labels.filter}</span>
        <TextField id="roomname-filter" label={labels.meetingName}
            name="roomContains" value={roomFilter} onChange={setRoomFilter} />
        <DatePicker label={labels.after} format={format} value={dateSince}
            name="dateSince" onChange={setSinceDate} />
        <DatePicker label={labels.before} format={format} value={dateUntil}
            name="dateUntil" onChange={setUntilDate} />
      </div>
    </MuiPickersUtilsProvider>
  );
};

export default Filter;
