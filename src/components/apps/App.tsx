import React from "react";
import waziup from "waziup";
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
  MDBDropdownItem,
  MDBCol
} from "mdbreact";

export declare type WaziApp = {
  id: string;
  name: string;
  version: string;
  description: string;
  author: any;
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
  error: boolean;

  setStartLoading: boolean;
  setStopLoading: boolean;
  setRestartLoading: boolean;
  setRemoveLoading: boolean;

  redirect: boolean;

  modalCnfrm: boolean;
  modalCnfrmMsg: string;
  uninstallKeepConfig: boolean;
}

export class AppItem extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      data: null,
      loading: true,

      modalHP: false,
      modalMsg: "",
      error: false,

      setStartLoading: false,
      setStopLoading: false,
      setRestartLoading: false,
      setRemoveLoading: false,

      redirect: false,

      modalCnfrm: false,
      modalCnfrmMsg: "",
      uninstallKeepConfig: true
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
    wazigate.getApp(this.props.id).then(
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

  uninstallAppModal(keepConfig: boolean) {
    this.setState({
      modalCnfrmMsg: keepConfig
        ? "Are you sure that you want to uninstall this app?"
        : "Are you sure that you want to completely remove this app?",
      uninstallKeepConfig: keepConfig,
      modalCnfrm: true
    });
  }

  toggleModalCnfrm = () => {
    this.setState({
      modalCnfrm: !this.state.modalCnfrm
    });
  };

  uninstallApp = () => {
    this.setState({
      setRemoveLoading: true,
      modalCnfrm: false
    });

    wazigate.uninstallApp(this.props.id, this.state.uninstallKeepConfig).then(
      res => {
        this.setState({
          setRemoveLoading: false,
          // modalMsg: res as any,
          modalMsg: "The App is uninstalled",
          error: false
        });

        setTimeout(() => {
          this.setState({ redirect: true });
        }, 2000);
      },
      error => {
        this.setState({
          setRemoveLoading: false,
          modalMsg: error as any,
          error: true
        });
      }
    );
  };

  /*---------------*/

  postAppAction(action: string) {
    this.setState({
      setStartLoading: action == "start" || action == "first-start",
      setStopLoading: action == "stop"
    });
    wazigate.setAppConfig(this.props.id, { action: action } as AppConfig).then(
      res => {
        this.setState({
          setStartLoading: false,
          setStopLoading: false,
          modalMsg: res as any,
          error: false
        });

        this.load();

        setTimeout(() => {
          this.setState({ modalMsg: "" });
        }, 5000);
      },
      error => {
        this.setState({
          setStartLoading: false,
          setStopLoading: false,
          modalMsg: error as any,
          error: true
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
    wazigate
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

    /*-------*/

    //If the app is uninstalled but the config/data is still there
    if (!this.state.data.package) {
      return <span></span>;
    }

    /*-------*/

    // console.log(this.state.apps);
    var isRunning =
      this.state.data.state && this.state.data.state.Running == true;

    return (
      <MDBCol sm="4">
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
              {this.state.data.name ? this.state.data.name : "unknown"}
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
            {this.state.data.name ? this.state.data.name : "unknown"}
            {" " + this.state.data.version}
          </MDBModalHeader>

          <MDBModalBody>
            {this.state.data.author && this.state.data.author.name ? (
              <MDBAlert color="info">
                <MDBIcon icon="user-secret" /> Author:{" "}
                <b className="text-capitalize">{this.state.data.author.name}</b>
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

            {this.state.data.state &&
            this.state.data.state.RestartPolicy !== null ? (
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
              <MDBAlert color={this.state.error ? "warning" : "info"} dismiss>
                {this.state.modalMsg}
              </MDBAlert>
            ) : (
              ""
            )}
          </MDBModalBody>

          <MDBModalFooter className="p-0">
            {this.state.data.state ? (
              <MDBDropdown>
                <MDBDropdownToggle
                  caret
                  color="default"
                  title="Change the restart policy"
                >
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
              title="Uninstall, but keep config and data files"
              onClick={() => this.uninstallAppModal(true)}
              color="deep-orange"
            >
              <MDBIcon
                icon={
                  this.state.setRemoveLoading && this.state.uninstallKeepConfig
                    ? "cog"
                    : "trash-alt"
                }
                spin={
                  this.state.setRemoveLoading && this.state.uninstallKeepConfig
                }
              />{" "}
              Uninstall
            </MDBBtn>

            <MDBBtn
              title="Remove completely"
              onClick={() => this.uninstallAppModal(false)}
              color="danger"
            >
              <MDBIcon
                icon={
                  this.state.setRemoveLoading && !this.state.uninstallKeepConfig
                    ? "cog"
                    : "minus-circle"
                }
                spin={
                  this.state.setRemoveLoading && !this.state.uninstallKeepConfig
                }
              />{" "}
              Remove completely
            </MDBBtn>

            <MDBBtn
              disabled={!isRunning}
              title="Stop"
              onClick={() => this.postAppAction("stop")}
              color="elegant"
            >
              <MDBIcon
                icon={this.state.setStopLoading ? "cog" : "stop"}
                spin={this.state.setStopLoading}
              />
            </MDBBtn>

            <MDBBtn
              disabled={isRunning}
              title={
                this.state.data.state && this.state.data.state.StartedAt != ""
                  ? "Start"
                  : "First Launch"
              }
              onClick={() =>
                this.postAppAction(
                  this.state.data.state && this.state.data.state.StartedAt != ""
                    ? "start"
                    : "first-start"
                )
              }
              color="elegant"
            >
              <MDBIcon
                icon={this.state.setStartLoading ? "cog" : "play"}
                spin={this.state.setStartLoading}
              />
            </MDBBtn>

            {/* <MDBBtn color="secondary" onClick={this.toggleModalHP}>
              Close
            </MDBBtn> */}
          </MDBModalFooter>
        </MDBModal>

        {/* --------------------------- */}

        <MDBModal isOpen={this.state.modalCnfrm} toggle={this.toggleModalCnfrm}>
          <MDBModalHeader toggle={this.toggleModalCnfrm}>
            Uninstall confirmation
          </MDBModalHeader>
          <MDBModalBody>{this.state.modalCnfrmMsg}</MDBModalBody>
          <MDBModalFooter>
            <MDBBtn color="secondary" onClick={this.toggleModalCnfrm}>
              No
            </MDBBtn>
            <MDBBtn color="danger" onClick={this.uninstallApp}>
              Yes
            </MDBBtn>
          </MDBModalFooter>
        </MDBModal>
      </MDBCol>
    );
  }
}

export default AppItem;
