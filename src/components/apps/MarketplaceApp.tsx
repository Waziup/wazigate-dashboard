import React, { useState, Fragment } from "react";
import { App } from "waziup";
import GetAppIcon from "@material-ui/icons/GetApp";

import _wazigateLogo from "../../img/wazigate.svg";
const wazigateLogo = `dist/${_wazigateLogo}`;

import _defaultLogo from "../../img/default-app-logo.svg";
const defaultLogo = `dist/${_defaultLogo}`;

import {
  makeStyles,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  CircularProgress,
  FormGroup,
  Card,
  CardHeader,
  Typography,
  CardContent,
  CardActionArea,
  CardActions,
  Fade,
} from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";
import { green } from "@material-ui/core/colors";

interface Props {
  appInfo: App;
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
    wazigate.setAppConfig(app.id, { action: "first-start" } as any).then(
      (res) => {
        setStartLoading(false);
        setModal(false);
        // TODO: navigate / reload
      },
      (error) => {
        alert("The app failed to start:\n" + error);
        setStartLoading(false);
      }
    );
  };

  /*----------*/

  var fallbackIcon = false;
  const getDefaultAppIcon = (event: React.ChangeEvent<HTMLImageElement>) => {
    if (fallbackIcon) return;
    event.target.src = defaultLogo;
    fallbackIcon = true;
  };

  /*----------*/

  // Hide myself when install successfully
  if (installSuccess && !modal) return <span></span>;

  /*----------*/

  return (
    <Fragment>
      <Card className={className}>
        <CardHeader
          avatar={
            <img
              className={classes.logo}
              src={(app as any)?.waziapp?.icon || wazigateLogo}
              onError={getDefaultAppIcon}
            />
          }
          title={app?.id}
          subheader={
            <a
              href={
                app.homepage ||
                "https://hub.docker.com/r/" + app?.id?.replace(".", "/")
              }
              target={"_blank"}
            >
              {app?.id}
            </a>
          }
        />
        <CardContent>
          <p>{`${(app as any)?.description || "."}`}</p>
          <p>{(app as any)?.image}</p>
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
        <DialogTitle>Install {app.id}</DialogTitle>
        <DialogContent dividers>
          <textarea
            rows={14}
            className="bg-dark text-light form-control form-rounded"
            // spellCheck={false}
            // contentEditable={false}
            readOnly={true}
            value={installStatus?.log || "."}
            hidden={!installStatus}
          ></textarea>
          {modalMsg && (
            <Alert severity={error ? "error" : "info"} onClose={() => {}}>
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
