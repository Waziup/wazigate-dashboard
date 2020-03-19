import * as React from "react";
import * as waziup from "waziup";
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

declare var gateway: waziup.Waziup;

export interface Props {
  filter?: "installed" | "available";
}

export interface State {
  apps: waziup.App[];
  loading: boolean;
}

export class AppsPageComp extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      apps: null,
      loading: true
    };
  }

  /*---------------*/

  componentDidMount() {
    this.load();
  }

  /*---------------*/

  load() {
    this.setState({ loading: true });
    gateway.getApps().then(
      res => {
        this.setState({
          apps: res,
          loading: false
        });
      },
      error => {
        // Notify(error);
        this.setState({ loading: false });
      }
    );
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

    if (!this.state.apps) {
      return (
        <MDBAlert color="info" className="m-3">
          <MDBIcon icon="exclamation-circle" />
          <span className=""> There are no Apps installed.</span>
        </MDBAlert>
      );
    }

    /*-------*/
    var results;
    if (this.props.filter == "available") {
      results = this.state.apps
        ? this.state.apps.map((res, index) => (
            <MDBCol key={index} sm="4">
              <NewApp id={res.id} />
            </MDBCol>
          ))
        : "";
    } else {
      results = this.state.apps
        ? this.state.apps.map((res, index) => (
            <MDBCol key={index} sm="4">
              <App id={res.id} />
            </MDBCol>
          ))
        : "";
    }

    return (
      <MDBContainer>
        <MDBRow>
          <MDBBtn
            style={{ display: this.props.filter == "available" ? "" : "none" }}
          >
            <a href="/#/apps/new">
              <MDBIcon icon="puzzle-piece" /> Install a new App
            </a>
          </MDBBtn>
        </MDBRow>
        <MDBRow>{results}</MDBRow>
      </MDBContainer>
    );
  }
}
