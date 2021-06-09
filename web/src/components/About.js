import { Button, Paper } from "@material-ui/core";
import labels from '../labels';

const About = ({history}) => {
  const back = (e) => {
    e.preventDefault();
    history.goBack();
  };

  return (
    <div className="vcenter">
      <Paper variant="outlined" className="padded">
        <div className="header">About</div>
        Jitsi Recordings Browser<br/>
        Source: <a href="https://github.com/sgumirov/jitsi-recordings-browser">on Github</a><br/>
        Copyright &copy; 2021 by <a href="https://shamil.gumirov.org">Shamil
        Gumirov</a>. All rights reserved.
        <br/>
        <br/>
        <br/>
        <Button
          color="primary"
          variant="contained"
          className="hcenter"
          onClick={back}
        >
          {labels.back}
        </Button>
      </Paper>
    </div>
  );
};
export default About;
