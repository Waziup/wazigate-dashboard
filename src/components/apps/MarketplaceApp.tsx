import React, { useState, Fragment } from "react";
import { App } from "waziup";
import GetAppIcon from "@material-ui/icons/GetApp";

import _wazigateLogo from "../../img/wazigate.svg";
const wazigateLogo = `dist/${_wazigateLogo}`;

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
      wazigate.get<InstallStatus>(`"apps/${app.id}?install_logs`).then(
        (res) => {
          setInstallStatus(res);
          setInstallLoading(false);
          if (timeout !== null) {
            timeout = setTimeout(pollStatus, 1000);
          }
        },
        (error) => {
          setInstallLoading(false);
          alert("There was an error getting the install status:\n" + error);
        }
      );
    };

    var timeout = setTimeout(pollStatus, 1000);

    wazigate.installApp(app.id).then(
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

  const start = () => {
    setStartLoading(true);
    wazigate.setAppConfig(app.id, { action: "first-start" } as any).then(
      (res) => {
        setStartLoading(false);
        // TODO: navigate / reload
      },
      (error) => {
        alert("The app failed to start:\n" + error);
        setStartLoading(false);
      }
    );
  };

  return (
    <Fragment>
      <Card className={className}>
        <CardHeader
          avatar={<img className={classes.logo} src={wazigateLogo} />}
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
          <Button startIcon={<GetAppIcon />} onClick={toggleModal}>
            Install
          </Button>
        </CardActions>
      </Card>

      <Dialog
        onClose={toggleModal}
        open={modal}
        fullWidth={true}
        maxWidth="xl"
        className={classes.modal}
      >
        <DialogTitle>Install {app.id}</DialogTitle>
        <DialogContent dividers>
          <FormGroup row>
            <div className={classes.wrapper}>
              <Button
                autoFocus
                onClick={install}
                color="primary"
                variant="contained"
                startIcon={<GetAppIcon />}
              >
                Download and Install
              </Button>
              {installLoading && (
                <CircularProgress
                  size={24}
                  className={classes.buttonProgress}
                />
              )}
            </div>
          </FormGroup>
          <textarea
            rows={14}
            className="bg-dark text-light form-control form-rounded"
            // spellCheck={false}
            // contentEditable={false}
            readOnly={true}
            value={installStatus?.log || "."}
            hidden={installLoading || !installStatus}
          ></textarea>
          {modalMsg ? (
            <Alert severity={error ? "error" : "warning"} onClose={() => {}}>
              {modalMsg}
            </Alert>
          ) : null}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={start}
            color="primary"
            disabled={!installStatus?.done}
            startIcon={<GetAppIcon />}
          >
            Launch the App
          </Button>
        </DialogActions>
      </Dialog>
    </Fragment>
  );
}
