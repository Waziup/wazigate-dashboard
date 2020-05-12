import React, { useState, Fragment } from "react";
import waziup, { App } from "waziup";
import { TimeComp } from "../Time";

import _wazigateLogo from "../../img/wazigate.svg";
const wazigateLogo = `dist/${_wazigateLogo}`;

import {
  makeStyles,
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  FormGroup,
  CircularProgress,
  DialogActions,
  Typography,
  FormControlLabel,
  Switch,
} from "@material-ui/core";
import { green } from "@material-ui/core/colors";

import DeleteIcon from "@material-ui/icons/Delete";
import SettingsIcon from "@material-ui/icons/Settings";
import UpdateIcon from "@material-ui/icons/Update";
import StopIcon from "@material-ui/icons/Stop";
import PlayArrowIcon from "@material-ui/icons/PlayArrow";

export declare type AppConfig = {
  action?: "start" | "stop" | "uninstal";
  restart?: "always" | "on-failure" | "unless-stopped" | "no";
};

interface Props {
  app: App;
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

type UninstallConfig = {
  keepConfig: boolean;
};

type UpdateConfig = {};

type SettingsConfig = {};

type UpdateStatus = {
  logs: string;
  isChecking: boolean;
  hasCheckedUpdates: boolean;
  hasUpdate: boolean;
  newVersion: string;
};

export default function InstalledApp({ app, className }: Props) {
  const classes = useStyles();

  const [uninstallModal, setUninstallModal] = useState<UninstallConfig>(null);

  const showModalUninstall = () => {
    setUninstallModal({
      keepConfig: false,
    });
  };

  const hideModalUninstall = () => {
    setUninstallModal(null);
  };

  const handleKeepConfigChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setUninstallModal({
      keepConfig: event.target.checked,
    });
  };

  //

  const [updateModal, setUpdateModal] = useState<UpdateConfig>(null);

  const showModalUpdate = () => {
    setUpdateModal({
      keepConfig: false,
    });
    hideModalSettings();
  };

  const hideModalUpdate = () => {
    setUpdateModal(null);
  };

  const [updateStatus, setUpdateStatus] = useState<UpdateStatus>(null);

  //

  const [settingsModal, setSettingsModal] = useState<SettingsConfig>(null);

  const showModalSettings = () => {
    setSettingsModal({
      keepConfig: false,
    });
  };

  const hideModalSettings = () => {
    setSettingsModal(null);
  };

  //

  const uninstall = () => {
    if (confirm("Do you wan tot uninstall the App?"))
      wazigate.uninstallApp(app.id, uninstallModal.keepConfig).then(
        (res) => {
          alert("The app has been uninstalled.");
          hideModalUninstall();
          // this.setState({
          //     setRemoveLoading: false,
          //     // modalMsg: res as any,
          //     modalMsg: "The App is uninstalled",
          //     error: false,
          // });

          // setTimeout(() => {
          //     this.setState({ redirect: true });
          // }, 2000);
        },
        (error) => {
          alert("There was an error uninstalling the app:\n" + error);
          // this.setState({
          //     setRemoveLoading: false,
          //     modalMsg: error as any,
          //     error: true,
          // });
        }
      );
  };

  //

  const checkUpdates = () => {
    // TODO : remove 'any' for this AppUpdate
    type AppUpdate = {
      newUpdate: string;
    };
    wazigate.get<AppUpdate>(`update/${app.id}`).then(
      (res) => {
        if (res.newUpdate) {
          setUpdateStatus((status) => ({
            logs: status.logs,
            isChecking: false,
            hasCheckedUpdates: true,
            hasUpdate: true,
            newVersion: res.newUpdate,
          }));
        } else {
          setUpdateStatus((status) => ({
            logs: status.logs,
            isChecking: false,
            hasCheckedUpdates: true,
            hasUpdate: false,
            newVersion: null,
          }));
          alert("The latest version is already installed.");
        }
      },
      (error) => {
        alert("There was an error checking for updates:\n" + error);
      }
    );
  };

  const update = () => {
    setUpdateStatus({
      logs: "Please wait...",
      isChecking: false,
      hasCheckedUpdates: false,
      hasUpdate: false,
      newVersion: null,
    });

    const pollStatus = () => {
      wazigate.get<string>(`apps/${app.id}?install_logs`).then(
        (res) => {
          setUpdateStatus((status) => ({
            ...status,
            logs: res,
          }));
          if (timeout !== null) {
            timeout = setTimeout(pollStatus, 1000);
          }
        },
        (error) => {
          alert("There was an error getting the update status:\n" + error);
        }
      );
    };

    var timeout = setTimeout(pollStatus, 1000);

    wazigate.set<any>("update/" + app.id, {}).then(
      () => {
        setUpdateStatus((status) => ({
          logs: status.logs,
          isChecking: false,
          hasCheckedUpdates: false,
          hasUpdate: false,
          newVersion: null,
        }));
        clearTimeout(timeout);
        timeout = null;
      },
      (error) => {
        alert("There was an error updating the app:\n" + error);
        clearTimeout(timeout);
        timeout = null;
      }
    );
  };

  //

  const [stopping, setStopping] = useState(false);

  const stop = () => {
    setStopping(true);
    wazigate.setAppConfig(app.id, { action: "stop" } as AppConfig).then(
      (res) => {
        setStopping(false);
      },
      (error) => {
        setStopping(false);
        alert("Can not perform action:\n" + error);
      }
    );
  };

  const [starting, setStarting] = useState(false);

  const start = () => {
    setStarting(true);
    wazigate.setAppConfig(app.id, { action: "start" } as AppConfig).then(
      (res) => {
        setStarting(false);
      },
      (error) => {
        setStarting(false);
        alert("Can not perform action:\n" + error);
      }
    );
  };

  const running = !!app?.state?.running;

  const getDefaultAppIcon = (event: React.ChangeEvent<HTMLImageElement>) => {
    event.target.src = "img/default-app-icon.svg";
  };

  const isSysApp =
    app.id == "wazigate-edge" || app.id == "waziup.wazigate-system";

  return (
    <Fragment>
      <Card className={className}>
        <CardHeader
          avatar={
            <img
              className={classes.logo}
              src={
                app.id == "wazigate-edge"
                  ? (app as any)?.waziapp?.icon
                  : wazigate.toProxyURL(app.id, (app as any)?.waziapp?.icon)
              }
              onError={getDefaultAppIcon}
            />
          }
          title={app?.name}
          subheader={
            <a
              href={
                app.homepage ||
                "https://hub.docker.com/r/" + app.id.replace(".", "/")
              }
              target={"_blank"}
            >
              {app.id}
            </a>
          }
        />
        <CardContent>
          {app.state ? (
            <span className="text-capitalize">
              Status: {app.state.status || "Disabled"}
            </span>
          ) : null}
          <p>{`${(app as any)?.description || <br />}`}</p>
        </CardContent>
        <CardActions>
          <Button startIcon={<UpdateIcon />} onClick={showModalUpdate}>
            Update
          </Button>
          <Button startIcon={<SettingsIcon />} onClick={showModalSettings}>
            Settings
          </Button>
          <Button
            startIcon={<DeleteIcon />}
            disabled={isSysApp}
            onClick={showModalUninstall}
          >
            Uninstall
          </Button>
        </CardActions>
      </Card>

      <Dialog
        onClose={hideModalUninstall}
        open={uninstallModal !== null}
        fullWidth={true}
        maxWidth="xl"
        className={classes.modal}
      >
        <DialogTitle>Uninstall {app?.name}</DialogTitle>
        <DialogContent dividers>
          <FormGroup>
            <FormControlLabel
              control={<Switch onChange={handleKeepConfigChange} />}
              value={!!uninstallModal?.keepConfig}
              label="Keep Config"
            />
          </FormGroup>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={uninstall}
            color="primary"
            disabled={isSysApp}
            startIcon={<DeleteIcon />}
          >
            Uninstall now
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        onClose={hideModalUpdate}
        open={updateModal !== null}
        fullWidth={true}
        maxWidth="xl"
        className={classes.modal}
      >
        <DialogTitle>Update {app?.name}</DialogTitle>
        <DialogContent dividers>
          Current Version: {app?.version}
          <textarea
            rows={14}
            className="bg-dark text-light form-control form-rounded"
            // spellCheck={false}
            // contentEditable={false}
            readOnly={true}
            value={updateStatus?.logs || "N/A"}
          ></textarea>
        </DialogContent>
        <DialogActions>
          {!updateStatus?.hasUpdate ? (
            <Button
              onClick={checkUpdates}
              color="primary"
              startIcon={<UpdateIcon />}
            >
              Check for Updates
            </Button>
          ) : null}
          {updateStatus?.hasUpdate ? (
            <Button onClick={update} color="primary" startIcon={<UpdateIcon />}>
              Update Now
            </Button>
          ) : null}
        </DialogActions>
      </Dialog>

      <Dialog
        onClose={hideModalSettings}
        open={settingsModal !== null}
        fullWidth={true}
        maxWidth="xl"
        className={classes.modal}
      >
        <DialogTitle>Settings [ {app?.name} ]</DialogTitle>
        <DialogContent dividers>
          {/* <p>Status: {running ? "Running" : "Stopped"}</p> */}
          <p className="text-capitalize">
            Status: {`${app?.state?.status || "Unknown"}`}
          </p>
          <p>Current Version: {`${app?.version || "Unknown"}`}</p>
          <p>Author: {`${app?.author || "Unknown"}`}</p>
          <p>Health: {`${app?.state?.health || "Unknown"}`}</p>
          <p>{`${(app as any)?.description || ""}`}</p>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={showModalUpdate}
            color="primary"
            startIcon={<UpdateIcon />}
          >
            Update
          </Button>
          <Button
            onClick={showModalUninstall}
            disabled={isSysApp}
            color="primary"
            startIcon={<DeleteIcon />}
          >
            Uninstall
          </Button>
          <div className={classes.wrapper}>
            <Button
              disabled={stopping || !running || isSysApp}
              onClick={stop}
              color="primary"
              startIcon={<StopIcon />}
            >
              Stop
            </Button>
            {stopping && (
              <CircularProgress size={24} className={classes.buttonProgress} />
            )}
          </div>
          <div className={classes.wrapper}>
            <Button
              disabled={starting || running}
              onClick={start}
              color="primary"
              startIcon={<PlayArrowIcon />}
            >
              Start
            </Button>
            {starting && (
              <CircularProgress size={24} className={classes.buttonProgress} />
            )}
          </div>
        </DialogActions>
      </Dialog>
    </Fragment>
  );
}
