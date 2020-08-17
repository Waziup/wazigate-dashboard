import React, { useState, Fragment, useEffect } from "react";
// import { TimeComp } from "../Time";

import { Alert } from '@material-ui/lab';
import SaveIcon from '@material-ui/icons/Save';
import List from '@material-ui/core/List';
import _wazigateLogo from "../../img/wazigate.svg"
import clsx from "clsx";

const wazigateLogo = `dist/${_wazigateLogo}`;

import {
  Divider,
  Card,
  CardContent,
  makeStyles,
  colors,
  FormGroup,
  TextField,
  Switch,
  Button,
  CardActions,
  Grow,
  LinearProgress,
  ListItem,
  ListItemText
} from '@material-ui/core';

export declare type User = {
  name: string;
  sensors: string;
  username: string;
  password: string;
  newPassword: string;
};

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
  avatar: {
    backgroundColor: colors.red[500],
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

export default function UserProfile() {
  const classes = useStyles();

  /*------------ */

  // Run stuff on load
  useEffect(
    () => {
      loadProfile();
    },
    [] /* This makes it to run only once*/
  );

  /*------------ */

  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState(null as User);
  const loadProfile = () => {
    setLoading(true);
    wazigate.get<any>("auth/profile").then(
      (res) => {
        setLoading(false);
        setProfile(res);
      },
      (error) => {
        setLoading(false);
        console.log(error);
      }
    );
  };

  /*------------ */

  const [msg, setMsg] = useState("");
  const [err, setErr] = useState(false);

  const saveProfile = (event: any) => {
    event.preventDefault();

    //Validation
    if (event.target.password.value.length > 0 &&
      event.target.newPassword.value != event.target.newPasswordConfirm.value
    ) {
      setErr(true);
      setMsg("The new password doesn't match with the confirm new password!");
      return;
    }

    var formData = {
      "name": event.target.name.value,
      "password": event.target.password.value,
      "newPassword": event.target.newPassword.value
    };
    var passField = event.target.password;

    setLoading(true);
    wazigate.set<any>("auth/profile", formData).then(
      (res) => {
        setLoading(false);
        setErr(false);
        setMsg(res);
      },
      (error) => {
        setLoading(false);
        setErr(true);
        console.log(error);
        setMsg("Wrong password!");
        passField.focus();
      }
    );
  };


  return (
    <div className={classes.paper}>
      <Card className={clsx(classes.root)}>
        <Grow in={loading}>
          <LinearProgress />
        </Grow>
        <List dense={true}>
          <ListItem>
            <img className={classes.logo} src={wazigateLogo} />
            <ListItemText
              primary="Wazigate user profile"
            />
          </ListItem>
        </List>
        <Divider />
        <CardContent>
          <form noValidate onSubmit={saveProfile}>
            <FormGroup>
              {profile && profile.name &&
                (<TextField
                  label="Name"
                  name="name"
                  defaultValue={profile.name}
                  margin="normal"
                />)
              }
              <TextField
                label="Username"
                name="username"
                value={profile && profile.username ? profile.username : "..."}
                margin="normal"
                disabled={true}
              />
              <TextField
                label="Password"
                type="password"
                name="password"
                margin="normal"
              />
              <TextField
                label="New password"
                type="password"
                name="newPassword"
                margin="normal"
              />
              <TextField
                label="Confirm new password"
                type="password"
                name="newPasswordConfirm"
                margin="normal"
              />

              <CardActions>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  startIcon={<SaveIcon />}
                  disabled={loading}
                > Save</Button>
              </CardActions>
            </FormGroup>
          </form>

          {msg != "" && (<Alert severity={err ? "error" : "success"}>{msg}</Alert>)}

        </CardContent>
      </Card>
    </div>
  );
}
