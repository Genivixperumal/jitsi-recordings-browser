import { Button, makeStyles, Modal, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, withStyles } from "@material-ui/core";
import ruLocale from "date-fns/locale/ru";
import { useState } from "react";
import labels from "../labels";
import { getStreamURL } from "../utils/API";
import Filter from "./Filter";
import { format } from 'date-fns';

const readableDate = (d) => format(new Date(d), "dd MMMM yyyy", {locale: ruLocale});
const readableTime = (d) => new Date(d).toLocaleTimeString();

const initialFilter = {
  dateSince: new Date("2021-01-01T00:00:00.000Z"),
  dateUntil: new Date(),
  roomFilter: "",
};

const RecordingsTable = ({ data }) => {
  const classes = useStyles();
  const [videoSrc, setVideoSrc] = useState(null);
  const [filter, setFilter] = useState(initialFilter);

  const showVideo = (id) => {
    const url = getStreamURL(id);
    setVideoSrc(url);
  };
  const hideVideo = () => {
    setVideoSrc(null);
  };

  const fdata = data ? data.filter(rec =>
    filter.dateSince < rec.dateObj &&
    rec.dateObj < filter.dateUntil &&
    (!filter.roomFilter || rec.room.includes(filter.roomFilter)))
      : null;

  return (
    <>
      <Filter filter={filter} setFilter={setFilter} />
      <TableContainer component={Paper}>
        <Table className={classes.table}>
          <TableHead>
            <TableRow>
              <StyledTableCell align="right">{labels.date}</StyledTableCell>
              <StyledTableCell align="center">{labels.meetingName}</StyledTableCell>
              <StyledTableCell align="left">{labels.files}</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            { fdata && fdata.length === 0 &&
              <div className="center">
                {labels.empty}
              </div>
            }
            { fdata && fdata.map(rec =>
              <StyledTableRow key={rec.id}>
                <StyledTableCell align="right">{readableDate(rec.date)}
                &nbsp;&nbsp;&nbsp;{readableTime(rec.date)}</StyledTableCell>
                <StyledTableCell align="center">{rec.room}</StyledTableCell>
                <StyledTableCell align="left">
                  <Button className={classes.button}
                    onClick={() => showVideo(rec.id)}>
                    {labels.openVideo}
                  </Button>
                </StyledTableCell>
              </StyledTableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      {videoSrc &&
        <Modal className="modal" open={true} onClose={hideVideo}>
          <video crossOrigin="use-credentials" className="video-modal"
              controls autoPlay>
            <source src={videoSrc} type="video/mp4"></source>
          </video>
        </Modal>
      }
    </>);
};

const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: "#70ba90",
    color: theme.palette.common.white,
    fontSize: 22,
  },
  body: {
    fontSize: 22,
  },
}))(TableCell);

const StyledTableRow = withStyles((theme) => ({
  root: {
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover,
    },
  },
}))(TableRow);

const useStyles = makeStyles({
  table: {
    minWidth: 700,
  },
  button: {
    background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
    border: 0,
    borderRadius: 3,
    boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
    color: 'white',
    height: 48,
    padding: '0 30px',
  },
});

export default RecordingsTable;
