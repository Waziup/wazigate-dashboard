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
  MDBCol,
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

  update: {
    loading: boolean;
    modal: boolean; //Modal visibility
    status: any;
    btnTxt: string; // Button text
    modalMsg: string;
    newUpdate: boolean;
  };
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
      uninstallKeepConfig: true,

      update: {
        loading: false,
        modal: false,
        status: null,
        btnTxt: "Check for Update",
        modalMsg: "",
        newUpdate: false,
      },
    };
  }

  /**------------- */
  _isMounted = false;
  componentDidMount() {
    this._isMounted = true;
    this.load();
    this.updateApp();
  }
  componentWillUnmount() {
    this._isMounted = false;
  }
  /**------------- */

  load() {
    if (!this._isMounted) return;
    this.setState({ loading: true });
    wazigate.getApp(this.props.id).then(
      (res) => {
        this.setState({
          data: res as any,
          loading: false,
        });
      },
      (error) => {
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
      modalCnfrm: true,
    });
  }

  toggleModalCnfrm = () => {
    this.setState({
      modalCnfrm: !this.state.modalCnfrm,
    });
  };

  uninstallApp = () => {
    this.setState({
      setRemoveLoading: true,
      modalCnfrm: false,
    });

    wazigate.uninstallApp(this.props.id, this.state.uninstallKeepConfig).then(
      (res) => {
        this.setState({
          setRemoveLoading: false,
          // modalMsg: res as any,
          modalMsg: "The App is uninstalled",
          error: false,
        });

        setTimeout(() => {
          this.setState({ redirect: true });
        }, 2000);
      },
      (error) => {
        this.setState({
          setRemoveLoading: false,
          modalMsg: error as any,
          error: true,
        });
      }
    );
  };

  /*---------------*/

  postAppAction(action: string) {
    this.setState({
      setStartLoading: action == "start" || action == "first-start",
      setStopLoading: action == "stop",
    });
    wazigate.setAppConfig(this.props.id, { action: action } as AppConfig).then(
      (res) => {
        this.setState({
          setStartLoading: false,
          setStopLoading: false,
          modalMsg: res as any,
          error: false,
        });

        this.load();

        setTimeout(() => {
          this.setState({ modalMsg: "" });
        }, 5000);
      },
      (error) => {
        this.setState({
          setStartLoading: false,
          setStopLoading: false,
          modalMsg: error as any,
          error: true,
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
        (res) => {
          this.setState({ setRestartLoading: false });
          this.load();
        },
        (error) => {
          this.setState({ setRestartLoading: false });
          this.load();
        }
      );
  };

  /*---------------*/

  toggleModalHP = () => {
    this.setState({
      modalHP: !this.state.modalHP,
    });
  };

  /*---------------*/

  updateModal = () => {
    this.setState({
      update: {
        modal: !this.state.update.modal,
        loading: this.state.update.loading,
        status: this.state.update.status,
        btnTxt: this.state.update.btnTxt,
        modalMsg: this.state.update.modalMsg,
        newUpdate: this.state.update.newUpdate,
      },
    });
  };

  /*---------------*/

  //In future we will move this to the waziup package
  async getAppiLogs(id: string): Promise<any> {
    return wazigate.get<any>("apps/" + id + "?install_logs");
  }

  async waziupCheckUpdateApp(id: string): Promise<any> {
    return wazigate.get<any>("update/" + id);
  }

  async waziupUpdateApp(id: string): Promise<any> {
    return wazigate.set<any>("update/" + id, {});
  }

  /*---------------*/

  uStatusLoop() {
    if (
      !this._isMounted ||
      (this.state.update.status && this.state.update.status.done)
    )
      return;

    console.log("update Logs is called");

    this.getAppiLogs(this.props.id).then(
      (res) => {
        this.setState({
          update: {
            modal: this.state.update.modal,
            loading: this.state.update.loading,
            status: res,
            btnTxt: this.state.update.btnTxt,
            modalMsg: this.state.update.modalMsg,
            newUpdate: this.state.update.newUpdate,
          },
        });
        setTimeout(() => {
          this.uStatusLoop();
        }, 1000); // Check every second
      },
      (error) => {
        // Notify(error);
      }
    );
  }

  /*---------------*/

  updateApp = () => {
    if (!this._isMounted) return;

    //Check for updates first
    if (!this.state.update.newUpdate) {
      this.setState({
        update: {
          modal: this.state.update.modal,
          loading: true,
          status: null,
          btnTxt: "Checking for new updates...",
          modalMsg: "",
          newUpdate: this.state.update.newUpdate,
        },
      });

      this.waziupCheckUpdateApp(this.props.id).then(
        (res) => {
          this.setState({
            update: {
              modal: this.state.update.modal,
              loading: false,
              status: null,
              btnTxt: res.newUpdate
                ? "Download and update"
                : "Check for updates",
              modalMsg: "New update is available",
              newUpdate: res.newUpdate,
            },
          });
          // this.load();
        },
        (error) => {
          this.setState({
            update: {
              modal: this.state.update.modal,
              loading: false,
              status: null,
              btnTxt: "Check for updates",
              modalMsg: error as any,
              newUpdate: false,
            },
          });
        }
      );

      return; // Only check
    } //End of if (!this.state.update.newUpdate);

    this.setState({
      update: {
        modal: this.state.update.modal,
        loading: true,
        status: { log: "" },
        btnTxt: "Updating...",
        modalMsg: "",
        newUpdate: this.state.update.newUpdate,
      },
    });

    this.uStatusLoop();

    this.waziupUpdateApp(this.props.id).then(
      (res) => {
        this.setState({
          update: {
            modal: this.state.update.modal,
            loading: false,
            status: this.state.update.status,
            btnTxt: "Check for update",
            modalMsg: res as any,
            newUpdate: this.state.update.newUpdate,
          },
        });
        this.load();
      },
      (error) => {
        this.setState({
          update: {
            modal: this.state.update.modal,
            loading: false,
            status: this.state.update.status,
            btnTxt: this.state.update.btnTxt,
            modalMsg: error as any,
            newUpdate: this.state.update.newUpdate,
          },
        });
      }
    );
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

    var isSysApp = this.props.id == "waziup.wazigate-system";

    // console.log(this.state.apps);
    var isRunning =
      this.state.data.state && this.state.data.state.running == true;

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
                ? this.state.data.state.status
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

            <MDBBtn onClick={this.updateModal}>
              <MDBIcon icon="sync" spin={this.state.update.loading} /> Update
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

            {this.state.data.state && this.state.data.state.health ? (
              <MDBAlert color="success">
                <MDBIcon icon="briefcase-medical" /> Health:{" "}
                <b className="text-capitalize">
                  {this.state.data.state.health}
                </b>
              </MDBAlert>
            ) : (
              ""
            )}

            <MDBAlert color={isRunning ? "info" : "warning"}>
              <MDBIcon icon="tachometer-alt" /> Status:{" "}
              <b className="text-capitalize">
                {this.state.data.state
                  ? this.state.data.state.status
                  : "Disabled"}{" "}
              </b>
            </MDBAlert>

            {isRunning &&
            this.state.data.state &&
            this.state.data.state.startedAt ? (
              <MDBAlert color="info">
                <MDBIcon icon="stopwatch" /> Started:{" "}
                <b>
                  <TimeComp time={new Date(this.state.data.state.startedAt)} />
                </b>
              </MDBAlert>
            ) : (
              ""
            )}

            {!isRunning &&
            this.state.data.state &&
            this.state.data.state.finishedAt ? (
              <MDBAlert color="info">
                <MDBIcon icon="history" /> Finished:{" "}
                <b>
                  <TimeComp time={new Date(this.state.data.state.finishedAt)} />
                </b>
              </MDBAlert>
            ) : (
              ""
            )}

            {this.state.data.state && this.state.data.state.error ? (
              <MDBAlert color="warning">
                <MDBIcon icon="exclamation-triangle" /> Error:{" "}
                <b>{this.state.data.state.error}</b>
              </MDBAlert>
            ) : (
              ""
            )}

            {this.state.data.state &&
            this.state.data.state.restartPolicy !== null ? (
              <MDBAlert color="info">
                <MDBIcon icon="caret-square-right" /> Restart policy:{" "}
                <b className="text-capitalize">
                  {this.state.data.state.restartPolicy}
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
                  disabled={isSysApp}
                >
                  <MDBIcon
                    icon="cog"
                    spin
                    style={{
                      display: this.state.setRestartLoading ? "" : "none",
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
              disabled={isSysApp}
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
              disabled={isSysApp}
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
              disabled={isSysApp || !isRunning}
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
                this.state.data.state && this.state.data.state.startedAt != ""
                  ? "Start"
                  : "First Launch"
              }
              onClick={() =>
                this.postAppAction(
                  this.state.data.state && this.state.data.state.startedAt != ""
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

        <MDBModal
          isOpen={this.state.update.modal}
          toggle={this.updateModal}
          centered
          size="lg"
        >
          <MDBModalHeader toggle={this.updateModal} title={this.props.id}>
            Update {this.state.data.name}
          </MDBModalHeader>

          <MDBModalBody>
            <MDBAlert color="info">
              Current Version:{" "}
              <b>{this.state.data.version ? this.state.data.version : "---"}</b>
            </MDBAlert>

            <textarea
              rows={14}
              className="bg-dark text-light form-control form-rounded"
              // spellCheck={false}
              // contentEditable={false}
              readOnly={true}
              value={
                this.state.update.status ? this.state.update.status.log : "---"
              }
              hidden={this.state.update.status == null}
            ></textarea>
            {this.state.modalMsg != "" ? (
              <MDBAlert color={this.state.error ? "warning" : "info"} dismiss>
                {this.state.modalMsg}
              </MDBAlert>
            ) : (
              ""
            )}
          </MDBModalBody>

          <MDBModalFooter className="p-0">
            <MDBBtn
              disabled={this.state.update.loading}
              onClick={this.updateApp}
              color="orange"
            >
              <MDBIcon icon="sync" spin={this.state.update.loading} />
              {"  " + this.state.update.btnTxt}
            </MDBBtn>

            <MDBBtn
              disabled={isRunning || this.state.update.loading}
              title={
                this.state.data.state && this.state.data.state.startedAt != ""
                  ? "Start"
                  : "First Launch"
              }
              onClick={() =>
                this.postAppAction(
                  this.state.data.state && this.state.data.state.startedAt != ""
                    ? "start"
                    : "first-start"
                )
              }
              color="primary"
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
