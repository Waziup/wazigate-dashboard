import * as React from "react";
import * as waziup from "waziup";
import { TimeComp } from "../Time";
import { Redirect } from "react-router-dom";

import {
  MDBBtn,
  MDBCard,
  MDBCardBody,
  MDBCardTitle,
  MDBIcon,
  MDBAlert,
  MDBModal,
  MDBModalBody,
  MDBModalHeader,
  MDBModalFooter,
  MDBDropdown,
  MDBDropdownToggle,
  MDBDropdownMenu,
  MDBDropdownItem
} from "mdbreact";

declare var gateway: waziup.Waziup;

export declare type WaziApp = {
  id: string;
  name: string;
  version: string;
  description: string;
  author: string;
  homepage: string;
  state: any;
  package: any;
};

export declare type AppConfig = {
  action?: "start" | "stop" | "uninstal";
  restart?: "always" | "on-failure" | "unless-stopped" | "no";
};

export interface Props {
  id: string;
}

export interface State {
  data: WaziApp;
  loading: boolean;
  modalHP: boolean;
  modalMsg: string;
  setStartLoading: boolean;
  setStopLoading: boolean;
  setRestartLoading: boolean;
  setRemoveLoading: boolean;
  redirect: boolean;
}

export class AppItem extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      data: null,
      loading: true,
      modalHP: false,
      modalMsg: "",
      setStartLoading: false,
      setStopLoading: false,
      setRestartLoading: false,
      setRemoveLoading: false,
      redirect: false
    };
  }

  /**------------- */
  _isMounted = false;
  componentDidMount() {
    this._isMounted = true;
    this.load();
  }
  componentWillUnmount() {
    this._isMounted = false;
  }
  /**------------- */

  load() {
    if (!this._isMounted) return;
    this.setState({ loading: true });
    gateway.getApp(this.props.id).then(
      res => {
        this.setState({
          data: res as any,
          loading: false
        });
      },
      error => {
        // Notify(error);
        this.setState({ loading: false });
      }
    );

    if (this.state.modalHP) {
      setTimeout(() => {
        this.load();
      }, 5000);
    }
  }

  /*---------------*/

  postAppAction(action: string) {
    this.setState({
      setStartLoading: action == "start",
      setStopLoading: action == "stop",
      setRemoveLoading: action == "uninstall"
    });
    gateway.setAppConfig(this.props.id, { action: action } as AppConfig).then(
      res => {
        this.setState({
          setStartLoading: false,
          setStopLoading: false,
          setRemoveLoading: false,
          modalMsg: res as any
        });

        if (action == "uninstall") {
          setTimeout(() => {
            this.setState({ redirect: true });
          }, 2000);
          return;
        }

        this.load();

        setTimeout(() => {
          this.setState({ modalMsg: "" });
        }, 5000);
      },
      error => {
        this.setState({
          setStartLoading: false,
          setStopLoading: false,
          setRemoveLoading: false,
          modalMsg: error as any
        });
        this.load();
      }
    );
  }

  /*---------------*/

  restartPolicyClick = (e: any) => {
    if (this.state.setRestartLoading) return; // Already on progress
    this.setState({ setRestartLoading: true });

    var newPolicy = e.target.innerHTML;
    gateway
      .setAppConfig(this.props.id, { restart: newPolicy } as AppConfig)
      .then(
        res => {
          this.setState({ setRestartLoading: false });
          this.load();
        },
        error => {
          this.setState({ setRestartLoading: false });
          this.load();
        }
      );
  };

  /*---------------*/

  toggleModalHP = () => {
    this.setState({
      modalHP: !this.state.modalHP
    });
  };

  /*---------------*/

  render() {
    if (this.state.redirect) {
      window.location.reload(); // Not a good tactic, but we will fix it later
      return <div></div>;
      // return <Redirect to="/apps" />;
    }

    if (!this.state.modalHP && this.state.loading) {
      return (
        <div className="center p-lg-5">
          Loading <MDBIcon spin icon="cog" />
        </div>
      );
    }

    /*-------*/

    if (!this.state.data) {
      return (
        <MDBAlert color="warning" className="m-3">
          <b>{this.props.id}</b> <br />
          <MDBIcon icon="exclamation-triangle" />
          <span className=""> Could not load the App Info.</span>
        </MDBAlert>
      );
    }

    // /*-------*/

    // console.log(this.state.apps);
    var isRunning =
      this.state.data.state && this.state.data.state.Running == true;

    return (
      <React.Fragment>
        <MDBCard style={{ width: "22rem" }} className="mt-3">
          <MDBCardBody>
            <MDBCardTitle title={"App ID: " + this.state.data.id}>
              {isRunning ? (
                <MDBIcon
                  icon="play"
                  className="text-secondary"
                  title="Running"
                />
              ) : (
                <MDBIcon
                  icon="exclamation-triangle"
                  className="text-warning"
                  title="Stopped"
                />
              )}{" "}
              {this.state.data.name}
            </MDBCardTitle>

            {this.state.data.description}

            <MDBAlert color={isRunning ? "info" : "warning"}>
              Status:{" "}
              {this.state.data.state
                ? this.state.data.state.Status
                : "Disabled"}
            </MDBAlert>
            {/* <MDBAlert color="info">Id: {this.state.data.Id}</MDBAlert> */}
            <a
              href={this.state.data.homepage}
              target="_blank"
              style={{ display: this.state.data.homepage ? "" : "none" }}
            >
              <MDBIcon icon="external-link-square-alt" /> Home page
            </a>
            <br />

            <MDBBtn onClick={this.toggleModalHP}>
              <MDBIcon icon="cogs" /> Setting
            </MDBBtn>
          </MDBCardBody>
        </MDBCard>
        <MDBModal
          isOpen={this.state.modalHP}
          toggle={this.toggleModalHP}
          centered
          size="lg"
        >
          <MDBModalHeader toggle={this.toggleModalHP}>
            {this.state.data.name}
            {" " + this.state.data.version}
          </MDBModalHeader>

          <MDBModalBody>
            {this.state.data.author ? (
              <MDBAlert color="info">
                <MDBIcon icon="user-secret" /> Author:{" "}
                <b className="text-capitalize">{this.state.data.author}</b>
              </MDBAlert>
            ) : (
              ""
            )}

            {this.state.data.state && this.state.data.state.Health ? (
              <MDBAlert color="success">
                <MDBIcon icon="briefcase-medical" /> Health:{" "}
                <b className="text-capitalize">
                  {this.state.data.state.Health}
                </b>
              </MDBAlert>
            ) : (
              ""
            )}

            <MDBAlert color={isRunning ? "info" : "warning"}>
              <MDBIcon icon="tachometer-alt" /> Status:{" "}
              <b className="text-capitalize">
                {this.state.data.state
                  ? this.state.data.state.Status
                  : "Disabled"}{" "}
              </b>
            </MDBAlert>

            {isRunning &&
            this.state.data.state &&
            this.state.data.state.StartedAt ? (
              <MDBAlert color="info">
                <MDBIcon icon="stopwatch" /> Started:{" "}
                <b>
                  <TimeComp time={new Date(this.state.data.state.StartedAt)} />
                </b>
              </MDBAlert>
            ) : (
              ""
            )}

            {!isRunning &&
            this.state.data.state &&
            this.state.data.state.FinishedAt ? (
              <MDBAlert color="info">
                <MDBIcon icon="history" /> Finished:{" "}
                <b>
                  <TimeComp time={new Date(this.state.data.state.FinishedAt)} />
                </b>
              </MDBAlert>
            ) : (
              ""
            )}

            {this.state.data.state && this.state.data.state.Error ? (
              <MDBAlert color="warning">
                <MDBIcon icon="exclamation-triangle" /> Error:{" "}
                <b>{this.state.data.state.Error}</b>
              </MDBAlert>
            ) : (
              ""
            )}

            {this.state.data.state && this.state.data.state.RestartPolicy ? (
              <MDBAlert color="info">
                <MDBIcon icon="caret-square-right" /> Restart policy:{" "}
                <b className="text-capitalize">
                  {this.state.data.state.RestartPolicy}
                </b>
              </MDBAlert>
            ) : (
              ""
            )}

            <a
              href={this.state.data.homepage}
              target="_blank"
              style={{ display: this.state.data.homepage ? "" : "none" }}
            >
              <MDBIcon icon="external-link-square-alt" /> Home page
            </a>

            {this.state.modalMsg != "" ? (
              <MDBAlert color="warning" dismiss>
                {this.state.modalMsg}
              </MDBAlert>
            ) : (
              ""
            )}
          </MDBModalBody>

          <MDBModalFooter>
            {this.state.data.state && this.state.data.state.RestartPolicy ? (
              <MDBDropdown>
                <MDBDropdownToggle caret color="default">
                  <MDBIcon
                    icon="cog"
                    spin
                    style={{
                      display: this.state.setRestartLoading ? "" : "none"
                    }}
                  />{" "}
                  Restart Policy
                </MDBDropdownToggle>
                <MDBDropdownMenu basic>
                  <MDBDropdownItem
                    onClick={this.restartPolicyClick}
                    className="text-capitalize"
                  >
                    always
                  </MDBDropdownItem>
                  <MDBDropdownItem
                    onClick={this.restartPolicyClick}
                    className="text-capitalize"
                  >
                    on-failure
                  </MDBDropdownItem>
                  <MDBDropdownItem
                    onClick={this.restartPolicyClick}
                    className="text-capitalize"
                  >
                    unless-stopped
                  </MDBDropdownItem>
                  <MDBDropdownItem
                    onClick={this.restartPolicyClick}
                    className="text-capitalize"
                  >
                    no
                  </MDBDropdownItem>
                </MDBDropdownMenu>
              </MDBDropdown>
            ) : (
              ""
            )}

            <MDBBtn
              title="Uninstall"
              onClick={() => this.postAppAction("uninstall")}
            >
              <MDBIcon
                icon={this.state.setRemoveLoading ? "cog" : "trash-alt"}
                spin={this.state.setRemoveLoading}
              />{" "}
              Uninstall
            </MDBBtn>

            <MDBBtn
              disabled={!isRunning}
              title="Stop"
              onClick={() => this.postAppAction("stop")}
            >
              <MDBIcon
                icon={this.state.setStopLoading ? "cog" : "stop"}
                spin={this.state.setStopLoading}
              />
            </MDBBtn>

            <MDBBtn
              disabled={isRunning}
              title="Start"
              onClick={() => this.postAppAction("start")}
            >
              <MDBIcon
                icon={this.state.setStartLoading ? "cog" : "play"}
                spin={this.state.setStartLoading}
              />
            </MDBBtn>

            <MDBBtn color="secondary" onClick={this.toggleModalHP}>
              Close
            </MDBBtn>
          </MDBModalFooter>
        </MDBModal>
      </React.Fragment>
    );
  }
}

export default AppItem;
