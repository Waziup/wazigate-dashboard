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
  MDBCol
} from "mdbreact";

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

export interface Props {
  id: string;
  appInfo: any;
}

export interface State {
  data: WaziApp;
  loading: boolean;

  modalHP: boolean;
  modalMsg: string;
  error: boolean;

  installLoading: boolean;
  installStatus: any;

  installSuccess: boolean;
  setStartLoading: boolean;
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

      installLoading: false,
      installStatus: null,

      setStartLoading: false,
      installSuccess: false
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

    // if (this.state.modalHP) {
    //   setTimeout(() => {
    //     this.load();
    //   }, 5000);
    // }
  }

  /*---------------*/

  //In future we will move this to the waziup package
  async getAppiLogs(id: string): Promise<any> {
    return wazigate.get<any>("apps/" + id + "?install_logs");
  }

  /*---------------*/

  iStatusLoop() {
    if (
      !this._isMounted ||
      (this.state.installStatus && this.state.installStatus.done)
    )
      return;

    this.getAppiLogs(this.props.id).then(
      res => {
        this.setState({
          installStatus: res
        });
        setTimeout(() => {
          this.iStatusLoop();
        }, 1000); // Check every second
      },
      error => {
        // Notify(error);
      }
    );
  }

  /*---------------*/

  startApp = () => {
    this.setState({ setStartLoading: true });
    wazigate.setAppConfig(this.props.id, { action: "first-start" } as any).then(
      res => {
        this.setState({ setStartLoading: false });
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      },
      error => {
        this.setState({
          setStartLoading: false
        });
      }
    );
  };

  /*---------------*/

  installApp = () => {
    if (!this._isMounted) return;
    this.setState({ installLoading: true, installStatus: { log: "" } });

    this.iStatusLoop();

    wazigate.installApp(this.props.appInfo.image).then(
      res => {
        this.setState({
          installLoading: false,
          modalMsg: res as any,
          error: false,
          installSuccess: true
        });
        this.load();
      },
      error => {
        this.setState({
          installLoading: false,
          modalMsg: error as any,
          error: true
        });
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
    // if (this.state.redirect) {
    //   window.location.reload(); // Not a good tactic, but we will fix it later
    //   return <div></div>;
    //   // return <Redirect to="/apps" />;
    // }

    if (!this.state.modalHP && this.state.loading) {
      return (
        <div className="center p-lg-5">
          Loading <MDBIcon spin icon="cog" />
        </div>
      );
    }

    /*-------*/

    return (
      <MDBCol sm="4">
        <MDBCard style={{ width: "22rem" }} className="mt-3">
          <MDBCardBody>
            <MDBCardTitle title={"App ID: " + this.props.appInfo.id}>
              {this.state.data && this.state.data.name
                ? this.state.data.name
                : this.props.appInfo.id}
            </MDBCardTitle>
            {this.state.data &&
            Object.getOwnPropertyNames(this.state.data).length != 0 ? (
              <MDBAlert
                color={
                  this.state.data.state && this.state.data.state.Running
                    ? "info"
                    : "warning"
                }
              >
                Status:{" "}
                {this.state.data.state
                  ? this.state.data.state.Status
                  : "Disabled"}
              </MDBAlert>
            ) : (
              <MDBBtn onClick={this.toggleModalHP}>
                <MDBIcon
                  icon={this.state.installLoading ? "cog" : "puzzle-piece"}
                  spin={this.state.installLoading}
                />
                Install
              </MDBBtn>
            )}
          </MDBCardBody>
        </MDBCard>
        <MDBModal
          isOpen={this.state.modalHP}
          toggle={this.toggleModalHP}
          centered
          size="lg"
        >
          <MDBModalHeader toggle={this.toggleModalHP}>
            Install {this.props.id}
          </MDBModalHeader>

          <MDBModalBody>
            <MDBBtn
              disabled={this.state.installLoading}
              onClick={this.installApp}
              color="orange"
            >
              <MDBIcon
                icon={this.state.installLoading ? "cog" : "angle-double-down"}
                spin={this.state.installLoading}
              />
              {"  "}
              Download and Install
            </MDBBtn>
            <MDBBtn>
              <a
                href={
                  this.props.appInfo.homepage
                    ? this.props.appInfo.homepage
                    : "https://hub.docker.com/r/" +
                      this.props.id.replace(".", "/")
                }
                target="_blank"
              >
                <MDBIcon icon="external-link-square-alt" />
                {"  "}Home page
              </a>
            </MDBBtn>
            <textarea
              rows={14}
              className="bg-dark text-light form-control form-rounded"
              // spellCheck={false}
              // contentEditable={false}
              readOnly={true}
              value={
                this.state.installStatus ? this.state.installStatus.log : "N/A"
              }
              hidden={this.state.installStatus == null}
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
              style={{ display: this.state.installSuccess ? "" : "none" }}
              onClick={this.startApp}
              color="primary"
            >
              <MDBIcon
                icon={this.state.setStartLoading ? "cog" : "play"}
                spin={this.state.setStartLoading}
              />
              {"  "}
              Launch the App
            </MDBBtn>

            {/* <MDBBtn color="secondary" onClick={this.toggleModalHP}>
              Close
            </MDBBtn> */}
          </MDBModalFooter>
        </MDBModal>

        {/* --------------------------- */}
      </MDBCol>
    );
  }
}

export default AppItem;
