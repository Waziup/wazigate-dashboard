import * as React from "react";
import { DevicesPageComp } from "./Devices";
import { ErrorComp } from "./Error";
import { AppsPageComp } from "./Apps";
import icons from "../img/icons.svg";
import { IconComp } from "./Icon";
import * as waziup from "waziup";
import { AppsProxyComp } from "./AppsProxy";
import { MetaHandler, metaHandler } from "./devices/Entity";

import "@fortawesome/fontawesome-free/css/all.min.css";
import "bootstrap-css-only/css/bootstrap.min.css";
import "mdbreact/dist/css/mdb.css";

declare var gateway: waziup.Waziup;

type MenuItem = {
  icon: string;
  label: string;
  href: string;
  items?: MenuItem[];
  target?: string;
};

interface State {
  page: string;
  loading: {
    pending: number;
  };
}

const appsRegExp = /^#\/apps\/([\.a-zA-Z0-9_-]+)\/(.+)/;

var menu = (item: MenuItem) => {
  return (
    <a
      key={`${item.label}${item.href}`}
      className="menu-item"
      href={item.href}
      target={item.target || "_self"}
    >
      <IconComp className="item-icon" src={item.icon} />
      <span className="item-name">{item.label}</span>
    </a>
  );
};

type WazigatePkg = {
  menu: MenuItem[];
  hook: string;
};

export class DashboardComp extends React.Component<{}, State> {
  menu: MenuItem[] = [
    {
      label: "Dashboard",
      icon: `dist/${icons}#dashboard`,
      href: "#/",
      items: []
    },
    {
      label: "Synchronization",
      icon: `dist/${icons}#clouds`,
      href: "#/clouds",
      items: []
    },
    {
      label: "Apps",
      icon: `dist/${icons}#apps`,
      href: "#/apps",
      items: []
    }
  ];

  constructor(props: {}) {
    super(props);

    this.onHandleHashChange = this.onHandleHashChange.bind(this);
    var page = location.hash;
    if (page.length < 2) {
      location.hash = page = "#/";
    }

    this.state = {
      page,
      loading: {
        pending: 0
      }
    };

    window.addEventListener("hashchange", this.onHandleHashChange, false);

    this.load();
  }

  async load() {
    (window as any)["dashboard"] = {
      dashboard: this
    };

    var apps = await gateway.getApps();
    var pending = apps ? apps.length : 0;
    if (pending === 0) {
      this.setState({ loading: null });
      return;
    }
    this.setState({
      loading: { pending }
    });
    apps.forEach(async app => {
      var appInfo = (await gateway.getApp(app.id)) as any;

      if (
        !appInfo ||
        Object.getOwnPropertyNames(appInfo).length == 0 ||
        !appInfo.package ||
        Object.getOwnPropertyNames(appInfo.package).length == 0
      ) {
        var pending = this.state.loading.pending - 1;
        this.setState({ loading: { pending } });
        if (pending <= 0) this.completeHook();
        return;
      }
      var wazigatePkg = (await appInfo.package) as WazigatePkg;
      if (wazigatePkg.menu) {
        this.menu.push(...wazigatePkg.menu);
      }
      if (wazigatePkg.hook) {
        loadHook(app.id, wazigatePkg.hook);
      } else {
        this.completeHook();
      }
    });
  }

  addMetaHandler(meta: string, handler: MetaHandler) {
    if (meta in metaHandler) {
      metaHandler[meta].push(handler);
    } else {
      metaHandler[meta] = [handler];
    }
  }

  getMetaHandler(meta: string) {
    return metaHandler[meta] || [];
  }

  completeHook() {
    if (--this.state.loading.pending <= 0) {
      this.setState({ loading: null });
    }
  }

  onHandleHashChange() {
    this.navigate(location.hash);
  }

  navigate(page: string) {
    this.setState({ page });
  }

  render() {
    var page = this.state.page;
    var match: RegExpMatchArray;

    if (this.state.loading) {
      return (
        <div className="loading">
          Loading, please wait. Pending: {this.state.loading.pending} apps.
        </div>
      );
    }

    if (page == "#/") {
      var pageComp = <DevicesPageComp />;
    } else if (page === "#/apps") {
      var pageComp = <AppsPageComp filter="installed" />;
    } else if (page === "#/apps/new") {
      var pageComp = <AppsPageComp filter="available" />;
    } else if ((match = page.match(appsRegExp))) {
      var pageComp = <AppsProxyComp app={match[1]} path={match[2]} />;
    } else {
      var pageComp = (
        <ErrorComp
          error={`Page not found.\nThere is nothing at \"${page}\".`}
        />
      );
    }

    return (
      <div className="dashboard">
        <div id="menu">{this.menu.map(menu)}</div>
        <div id="statusbar"></div>
        {pageComp}
      </div>
    );
  }
}

function loadHook(app: string, hook: string) {
  return new Promise((resolve, reject) => {
    var script = document.createElement("script");
    // var rnd = `${Math.random()}`.slice(2);
    // hooks[rnd] = () => {
    //     delete hooks[rnd];
    //     resolve();
    // }
    // script.setAttribute("data-hook", rnd);
    script.src = gateway.toProxyURL(app, hook);
    document.head.appendChild(script);
  });
}
