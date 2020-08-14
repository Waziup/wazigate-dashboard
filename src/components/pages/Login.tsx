import React, { useState, Fragment, useEffect } from "react";
// import { TimeComp } from "../Time";

import Avatar from '@material-ui/core/Avatar';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import { green } from "@material-ui/core/colors";
import { Alert } from '@material-ui/lab';

import {
  makeStyles,
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Button,
  CircularProgress,
  DialogActions,
  // Typography,
  FormControlLabel,
  Switch,
  // LinearProgress,
  Fade,
  Grid,
} from "@material-ui/core";


const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  buttonProgress: {
    color: green[200],
    position: "absolute",
    top: "50%",
    left: "50%",
    marginTop: -12,
    marginLeft: -12,
  },
  wrapper: {
    margin: theme.spacing(1),
    position: "relative",
  },
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
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Login to the Wazigate dahsboard
        </Typography>
        <form className={classes.form} noValidate onSubmit={loginCheck}>
          <TextField
            variant="outlined"
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
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
          />
          <div className={classes.wrapper}>
            <Button
              type="submit"
              fullWidth
              disabled={checking}
              color="primary"
              variant="contained"
              className={classes.submit}
            // startIcon={<PlayArrowIcon />}
            >
              Login
              </Button>
            {checking && (
              <CircularProgress
                size={24}
                className={classes.buttonProgress}
              />
            )}
          </div>

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
        </form>
      </div>
    </Container>
  );
}
