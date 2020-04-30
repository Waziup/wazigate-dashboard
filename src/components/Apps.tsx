import React from "react";
import waziup from "waziup";
import App from "./apps/App";
import NewApp from "./apps/NewApp";
import {
  MDBIcon,
  MDBAlert,
  MDBCol,
  MDBContainer,
  MDBRow,
  MDBBtn,
} from "mdbreact";

import AddIcon from "@material-ui/icons/Add";
import SettingsIcon from "@material-ui/icons/Settings";

import {
  Fab,
  // AppBar,
  // IconButton,
  // Toolbar,
  // Typography,
  // makeStyles,
} from "@material-ui/core";

/*---------------*/

export interface Props {
  filter?: "installed" | "available";
}

export interface State {
  apps: waziup.App[];
  loading: boolean;
  filter: string;
}

export class AppsPageComp extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      apps: null,
      loading: true,
      filter: this.props.filter,
    };
  }

  /*---------------*/

  componentDidMount() {
    this.load();
  }

  /*---------------*/

  async load(filter: string = null) {
    if (!filter) filter = this.state.filter;
    this.setState({ loading: true, filter: filter });

    var apps;

    if (filter == "available") {
      apps = await wazigate.get<any>("apps?available"); // Later we will change this when we fix the wazi-lib
    } else {
      apps = await wazigate.getApps();
    }

    this.setState({
      apps: apps,
      loading: false,
    });
  }

  /*---------------*/

  render() {
    if (this.state.loading) {
      return (
        <div className="center p-lg-5">
          Loading <MDBIcon spin icon="cog" />
        </div>
      );
    }

    /*-------*/

    var results;
    if (this.state.apps) {
      console.log(this.state.apps);
      if (this.state.filter == "available") {
        results = this.state.apps.map((res, index) => (
          <MDBCol key={index} sm="4">
            <NewApp id={res.id} appInfo={res} />
          </MDBCol>
        ));
      } else {
        //Exclude the system app from the list, we may use internal(private) flag in future
        // let apps = this.state.apps.filter(
        //   (obj) => obj.id != "waziup.wazigate-system"
        // );
        results = this.state.apps.map((res, index) => (
          <App key={index} id={res.id} />
        ));
      }
    }

    if (!results || results.length == 0) {
      results = (
        <MDBAlert color="info" className="m-3">
          <MDBIcon icon="exclamation-circle" />
          <span className=""> There are no Apps.</span>
        </MDBAlert>
      );
    }

    var manageApps = this.state.filter == "installed";

    return (
      <MDBContainer>
        <MDBRow>{results}</MDBRow>
        <span className="MuiFab-root">
          {manageApps ? (
            <Fab
              className="wazigate-fabAdd"
              onClick={() => this.load("available")}
              aria-label="add"
              title="Install a new App"
            >
              <AddIcon />
            </Fab>
          ) : (
            <Fab
              className="wazigate-fabSetting"
              onClick={() => this.load("installed")}
              aria-label="edit"
              title="Manage installed Apps"
            >
              <SettingsIcon />
            </Fab>
          )}
        </span>
      </MDBContainer>
    );
  }
}
