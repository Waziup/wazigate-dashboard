import React, { useState, Fragment, useEffect } from "react";
// import { TimeComp } from "../Time";

import LockOpenIcon from '@material-ui/icons/LockOpen';
import Container from '@material-ui/core/Container';
import { Alert } from '@material-ui/lab';
import _wazigateLogo from "../../img/wazigate.svg"
import clsx from "clsx";

const wazigateLogo = `dist/${_wazigateLogo}`;

import {
  Divider,
  Card,
  CardContent,
  makeStyles,
  Grid,
  List,
  FormGroup,
  TextField,
  Button,
  CardActions,
  Grow,
  LinearProgress,
  ListItem,
  ListItemText
} from '@material-ui/core';


const useStyles = makeStyles((theme) => ({
  root: {
    width: 400,
    maxWidth: "calc(100% - 32px)",
    display: "inline-block",
    verticalAlign: "top",
  },
  name: {
    cursor: "text",
    '&:hover': {
      "text-decoration": "underline",
    },
  },
  icon: {
    width: "40px",
    height: "40px",
  },
  logo: {
    display: "inline-flex",
    height: "2rem",
    marginRight: 16,
  },
  expand: {
    transform: 'rotate(0deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: 'rotate(180deg)',
  },
  value: {
    float: "right",
    flexGrow: 0,
    marginLeft: "1.5em",
  },
  wrapper: {
    position: "relative",
  },
  progress: {
    color: "#4caf50",
    display: "inline",
  },
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  }
}));

export default function Login() {
  const classes = useStyles();

  /*------------ */
  // Run stuff on load
  useEffect(
    () => {
      // Nothing to run yet
    },
    [] /* This makes it to run only once*/
  );

  /*------------ */
  const [msg, setMsg] = useState("");
  const [checking, setChecking] = useState(false);
  const [loginErr, setLoginErr] = useState(false);
  const loginCheck = (event: any) => {
    event.preventDefault();
    setChecking(true);

    wazigate.set<any>("auth/token", { "username": event.target.username.value, "password": event.target.password.value }).then(
      (res) => {
        setChecking(false);
        setLoginErr(false);
        console.log("Token", res);
        setMsg("Login Success! [ Redirecting... ]");
        //Redirecting...
        window.location.href = "/";
      },
      (error) => {
        setChecking(false);
        setLoginErr(true);
        console.log(error);
        setMsg("Invalid credentials!");
      }
    );
  };


  return (

    <div className={classes.paper}>
      <Card className={clsx(classes.root)}>
        <Grow in={checking}>
          <LinearProgress />
        </Grow>
        <List dense={true}>
          <ListItem>
            <img className={classes.logo} src={wazigateLogo} />
            <ListItemText
              primary="Login to the Wazigate dahsboard"
            />
          </ListItem>
        </List>
        <Divider />
        <CardContent>
          <form noValidate onSubmit={loginCheck}>
            <FormGroup>

              <TextField
                // variant="outlined"
                margin="normal"
                required
                fullWidth
                id="username"
                label="Username"
                name="username"
                autoComplete="username"
                autoFocus
              />
              <TextField
                // variant="outlined"
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
              />
              <CardActions>
                <Button
                  type="submit"
                  fullWidth
                  disabled={checking}
                  color="primary"
                  variant="contained"
                  startIcon={<LockOpenIcon />}
                >
                  Login
                </Button>
              </CardActions>

            </FormGroup>
          </form>

          <Divider />
          <br />

          {msg != "" && (<Alert severity={loginErr ? "error" : "success"}>{msg}</Alert>)}

          <Grid container>
            <Grid item xs>
              Default username: <b>admin</b>
            </Grid>
          </Grid>
          <Grid container>
            <Grid item xs>
              Default password: <b>loragateway</b>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </div>
  );
}
