import React, { useState, Fragment } from "react";
import { App } from "waziup";
import GetAppIcon from "@material-ui/icons/GetApp";
import FiberNewIcon from '@material-ui/icons/FiberNew';

import _wazigateLogo from "../../../img/wazigate.svg";
const wazigateLogo = `dist/${_wazigateLogo}`;

import _defaultLogo from "../../../img/default-app-logo.svg";
const defaultLogo = `dist/${_defaultLogo}`;

import {
  makeStyles,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  CircularProgress,
  Card,
  CardHeader,
  CardContent,
  CardActions,
  TextField,
} from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";
import { green, orange } from "@material-ui/core/colors";

interface Props {
  appInfo: App & {
    customApp?: boolean;
    description?: string;
    image?: string;
  };
  className?: string;
}

const useStyles = makeStyles((theme) => ({
  page: {
    marginTop: "64px",
  },
  modal: {
    marginLeft: 0,
    [theme.breakpoints.up("sm")]: {
      marginLeft: 240,
    },
  },
  textarea: {
    backgroundColor: "#000",
    color: "#FFD",
    borderRadius: "5px",
    width: "100%",
  },
  buttonProgress: {
    color: green[500],
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
  logo: {
    display: "inline-flex",
    height: "2rem",
    marginRight: 16,
  },
}));

type InstallStatus = {
  log: string;
  done: boolean;
};

export default function MarketplaceApp({ appInfo, className }: Props) {
  const classes = useStyles();

  /*------------ */

  const [app, setApp] = useState<App>(appInfo);
  const load = () => {
    wazigate.getApp(app.id).then(setApp, (error) => {
      alert("There was an error loading the app info:\n" + error);
    });
  };

  /*------------ */

  const imageIdChange = (event: any) => {
    appInfo.image = event.target.value;
    appInfo.id = event.target.value.replace("/", ".").split(":")[0];
    setApp(appInfo);
  }

  /*------------ */

  const [installStatus, setInstallStatus] = useState(null as InstallStatus);

  const [modal, setModal] = useState(false);
  const toggleModal = () => setModal(!modal);

  const [modalMsg, setModalMsg] = useState("");

  const [error, setError] = useState(Error);

  const [installLoading, setInstallLoading] = useState(false);
  const [installSuccess, setInstallSuccess] = useState(false);

  const [startLoading, setStartLoading] = useState(false);

  const install = () => {

    setInstallLoading(true);
    setInstallStatus({ log: "...", done: false });

    const pollStatus = () => {
      wazigate.get<InstallStatus>(`apps/${app.id}?install_logs`).then(
        (res) => {
          setInstallStatus(res);
          if (timeout !== null) {
            timeout = setTimeout(pollStatus, 1000);
          }
        },
        (error) => {
          alert("There was an error getting the install status:\n" + error);
        }
      );
    };

    var timeout = setTimeout(pollStatus, 1000);

    wazigate.installApp((app as any)?.image).then(
      (res) => {
        setInstallLoading(false);
        setModalMsg(`${res}`);
        setError(null);
        setInstallSuccess(true);
        clearTimeout(timeout);
        timeout = null;
      },
      (error) => {
        setInstallLoading(false);
        setModalMsg(`${error}`);
        setError(error);
        clearTimeout(timeout);
        timeout = null;
      }
    );
  };

  /*------------ */

  const start = () => {
    setStartLoading(true);
    wazigate.setAppConfig(app.id, { action: "up -d --no-build" } as any).then(
      (res) => {
        setStartLoading(false);
        setModal(false);
        //navigate / reload
        setTimeout(function () { window.location.reload() }, 500);
      },
      (error) => {
        alert("The app failed to start:\n" + error);
        setStartLoading(false);
      }
    );
  };

  /*----------*/

  var fallbackIcon = 0;
  const getDefaultAppIcon = (event: React.ChangeEvent<HTMLImageElement>) => {
    if (fallbackIcon > 1) return; // Trying twice
    event.target.src = defaultLogo;
    fallbackIcon++;
  };

  /*----------*/

  // Hide myself when install successfully
  if (installSuccess && !modal) return <span></span>;

  /*----------*/

  return (
    <Fragment>
      <Card className={className} style={appInfo.customApp && { backgroundColor: orange[50] }}>
        <CardHeader
          avatar={
            appInfo.customApp ?
              (<FiberNewIcon fontSize="large" style={{ color: orange[500] }} />)
              :
              (<img
                className={classes.logo}
                src={(app as any)?.waziapp?.icon || wazigateLogo}
                onError={getDefaultAppIcon}
              />)
          }
          title={appInfo.customApp ? "Install a Custom App" : app?.id}
          subheader={
            appInfo.customApp ? ("") :
              (<a
                href={
                  app.homepage ||
                  "https://hub.docker.com/r/" + app?.id?.replace(".", "/")
                }
                target={"_blank"}
              >
                {(app as any)?.image}
              </a>)
          }
        />
        <CardContent>
          <p>{`${(app as any)?.description || (appInfo.customApp ? "Install a custom App using docker image name" : ".")}`}</p>
          {/* <p>{(app as any)?.image}</p> */}
        </CardContent>
        <CardActions>
          <Button
            startIcon={<GetAppIcon />}
            onClick={toggleModal}
            disabled={installSuccess}
          >
            Install
          </Button>
        </CardActions>
      </Card>

      {/* <Fade in={modal}> */}
      <Dialog
        onClose={toggleModal}
        open={modal}
        fullWidth={true}
        maxWidth="xl"
        className={classes.modal}
      >
        <DialogTitle title={(app as any)?.image}>
          Install [ {appInfo.customApp ? "Custom App" : app?.id}]
        </DialogTitle>
        <DialogContent dividers>
          {appInfo.customApp && (
            <TextField
              id="imageId"
              name="imageId"
              onChange={imageIdChange}
              fullWidth
              required
              label="Full docker image name and associated tag (image_name:tag)" />
          )
          }
          <textarea
            rows={14}
            className={classes.textarea}
            // spellCheck={false}
            // contentEditable={false}
            readOnly={true}
            value={installStatus?.log || "."}
            hidden={!installStatus}
          ></textarea>
          {modalMsg && (
            <Alert severity={error ? "error" : "info"} onClose={() => { }}>
              {modalMsg}
            </Alert>
          )}
        </DialogContent>
        <DialogActions>
          <div className={classes.wrapper}>
            <Button
              autoFocus
              onClick={install}
              color="primary"
              variant="contained"
              startIcon={<GetAppIcon />}
              disabled={installLoading || installSuccess}
            >
              Download and Install
            </Button>
            {installLoading && (
              <CircularProgress size={24} className={classes.buttonProgress} />
            )}
          </div>

          <div className={classes.wrapper}>
            <Button
              onClick={start}
              color="primary"
              disabled={!installSuccess || startLoading}
              startIcon={<GetAppIcon />}
            >
              Launch the App
            </Button>
            {startLoading && (
              <CircularProgress size={24} className={classes.buttonProgress} />
            )}
          </div>
        </DialogActions>
      </Dialog>
      {/* </Fade> */}
    </Fragment>
  );
}
