import { Paper } from "@material-ui/core";

const About = () => (
  <div className="vcenter">
    <Paper variant="outlined" className="padded">
      <div className="header">About</div>
      Jitsi Recordings Browser<br/>
      Source: <a href="https://github.com/sgumirov/jitsi-recordings-browser">on Github</a><br/>
      Copyright &copy; 2021 by <a href="https://shamil.gumirov.org">Shamil
      Gumirov</a>. All rights reserved.
    </Paper>
  </div>
);
export default About;
