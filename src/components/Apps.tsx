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
  MDBBtn
} from "mdbreact";

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
      filter: this.props.filter
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
      loading: false
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
      if (this.state.filter == "available") {
        results = this.state.apps
          ? this.state.apps.map((res, index) => (
              <MDBCol key={index} sm="4">
                <NewApp id={res.id} appInfo={res} />
              </MDBCol>
            ))
          : "";
      } else {
        //Exclude the system app from the list, we may use internal(private) flag in future
        let apps = this.state.apps.filter(
          obj => obj.id != "waziup.wazigate-system"
        );
        results = apps
          ? apps.map((res, index) => <App key={index} id={res.id} />)
          : "";
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

    return (
      <MDBContainer>
        <MDBRow>
          <MDBBtn
            style={{ display: this.state.filter == "available" ? "none" : "" }}
            onClick={() => this.load("available")}
            color="orange"
          >
            <MDBIcon icon="puzzle-piece" /> Install a new App
          </MDBBtn>

          <MDBBtn
            style={{ display: this.state.filter == "installed" ? "none" : "" }}
            onClick={() => this.load("installed")}
            color="primary"
          >
            <MDBIcon icon="cogs" /> Manage installed Apps
          </MDBBtn>
        </MDBRow>
        <MDBRow>{results}</MDBRow>
      </MDBContainer>
    );
  }
}
