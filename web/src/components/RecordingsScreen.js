import { useEffect, useState } from 'react';
import { loadMedia } from '../utils/API';

import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import Loader from "react-loader-spinner";
import RecordingsTable from './RecordingsTable';
import labels from '../labels';

const RecordingsScreen = () => {
  const [recordings, setRecordings] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const dataLoaded = data => {
    setRecordings(
      data
        .map(rec => ({...rec, dateObj: new Date(rec.date)}))
        .sort((a,b) => b.dateObj - a.dateObj)
    );
  };

  const loadRecordings = () => {
    setError(null);
    setLoading(true);
    loadMedia().then((res) => {
      setError(null);
      setLoading(false);
      dataLoaded(res.data);
    }).catch((err) => {
      if (err.response?.data.error) {
        setError(err.response.data.error);
      } else {
        setError(err.message);
      }
      setRecordings(null);
      setLoading(false);
    });
  };

  useEffect(loadRecordings, []);

  return <>
    <h1>{labels.recordings}</h1>
    { loading &&
      <Loader className="center" type="Watch" color="#00bfff" height={100} width={100} />
    }
    { error &&
      <div className="error">Error: {error}</div>
    }
    { recordings &&
      <RecordingsTable data={recordings} />
    }
  </>;
};

export default RecordingsScreen;
