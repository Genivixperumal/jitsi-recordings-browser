import { Button, makeStyles, Modal, Paper, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, withStyles } from "@material-ui/core";
import ruLocale from "date-fns/locale/ru";
import { useState } from "react";
import labels from "../labels";
import { getStreamURL, getDownloadPath } from "../utils/API";
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
  const [videoDownload, setVideoDownload] = useState(null);
  const [videoName, setVideoName] = useState(null);
  const [filter, setFilter] = useState(initialFilter);
  const [size, setSize] = useState(null); //download video file size
  const [downloadFile, setDownloadFile] = useState(null); //download video file name

  const showVideo = (id, name, size, file) => {
    const url = getStreamURL(id);
    const downloadUrl = getDownloadPath(id);
    setVideoSrc(url);
    setVideoDownload(downloadUrl);
    setVideoName(name);
    setSize(size);
    setDownloadFile(file);
  };
  const hideVideo = () => {
    setVideoSrc(null);
    setVideoDownload(null);
    setVideoName(null);
    setSize(null);
    setDownloadFile(null);
  };

  const fdata = data ? data.filter(rec =>
      filter.dateSince < rec.dateObj &&
      rec.dateObj < filter.dateUntil &&
      (!filter.roomFilter || rec.roomDecoded.includes(filter.roomFilter))
    ) : null;

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
              <StyledTableCell align="left">{labels.size}</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            { (!fdata || fdata.length === 0) &&
              <div className="center">
                {labels.empty}
              </div>
            }
            { fdata && fdata.map(rec =>
              <StyledTableRow key={rec.id}>
                <StyledTableCell align="right">{readableDate(rec.date)}
                &nbsp;&nbsp;&nbsp;{readableTime(rec.date)}</StyledTableCell>
                <StyledTableCell align="center">{rec.roomDecoded}</StyledTableCell>
                <StyledTableCell align="left">
                  <Button className={classes.button}
                    onClick={() => showVideo(rec.id, rec.roomDecoded, rec.sizeDecoded, rec.fileName)}>
                    {labels.openVideo}
                  </Button>
                </StyledTableCell>
                <StyledTableCell align="left">
                  {rec.sizeDecoded}
                  <a className={classes.leftMargin} href={getDownloadPath(rec.id)} download={rec.fileName}>
                    <Button className={classes.button}>{labels.download}</Button>
                  </a>
                </StyledTableCell>
              </StyledTableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      {videoSrc &&
        <Modal className="modal" open={true} onClose={hideVideo}>
          <Paper elevation={10}>
            <div className={classes.header}>
              <span className={classes.title}>{labels.roomName}: {videoName}</span>
              <Button variant="outlined" onClick={hideVideo}
                      className={classes.right}>{labels.close}</Button>
              <a className={classes.rightWithGap} href={videoDownload}
                  download={downloadFile}>
                <Button variant="outlined">{labels.download} ({size})</Button>
              </a>
            </div>
            <video crossOrigin="use-credentials" className="video-modal"
                controls autoPlay>
              <source src={videoSrc} type="video/mp4" />
            </video>
          </Paper>
        </Modal>
      }
    </>);
};

const useStyles = makeStyles((theme) => ({
  title: {
    fontSize: 30,
    textAlign: "center",
    textTransform: "none",
    float: "center",
  },
  leftMargin: {
    marginLeft: 20,
  },
  right: {
    marginLeft: "auto",
    marginRight: 0,
    float: "right",
    marginBottom: theme.spacing(1),
  },
  rightWithGap: {
    marginLeft: "auto",
    marginRight: 10,
    float: "right",
    marginBottom: theme.spacing(1),
  },
  mRight: {
    marginRight: 20,
  },
  header: {
    backgroundColor: theme.palette.primary,
    padding: theme.spacing(2),
  },
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
}));

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

export default RecordingsTable;
