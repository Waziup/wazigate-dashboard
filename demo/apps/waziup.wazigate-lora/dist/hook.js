/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ({

/***/ "./node_modules/@material-ui/icons/AddCircleOutline.js":
/*!*************************************************************!*\
  !*** ./node_modules/@material-ui/icons/AddCircleOutline.js ***!
  \*************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _interopRequireDefault = __webpack_require__(/*! @babel/runtime/helpers/interopRequireDefault */ "@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(__webpack_require__(/*! react */ "react"));

var _createSvgIcon = _interopRequireDefault(__webpack_require__(/*! ./utils/createSvgIcon */ "./node_modules/@material-ui/icons/utils/createSvgIcon.js"));

var _default = (0, _createSvgIcon.default)(_react.default.createElement("path", {
  d: "M13 7h-2v4H7v2h4v4h2v-4h4v-2h-4V7zm-1-5C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"
}), 'AddCircleOutline');

exports.default = _default;

/***/ }),

/***/ "./node_modules/@material-ui/icons/Remove.js":
/*!***************************************************!*\
  !*** ./node_modules/@material-ui/icons/Remove.js ***!
  \***************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _interopRequireDefault = __webpack_require__(/*! @babel/runtime/helpers/interopRequireDefault */ "@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(__webpack_require__(/*! react */ "react"));

var _createSvgIcon = _interopRequireDefault(__webpack_require__(/*! ./utils/createSvgIcon */ "./node_modules/@material-ui/icons/utils/createSvgIcon.js"));

var _default = (0, _createSvgIcon.default)(_react.default.createElement("path", {
  d: "M19 13H5v-2h14v2z"
}), 'Remove');

exports.default = _default;

/***/ }),

/***/ "./node_modules/@material-ui/icons/Router.js":
/*!***************************************************!*\
  !*** ./node_modules/@material-ui/icons/Router.js ***!
  \***************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _interopRequireDefault = __webpack_require__(/*! @babel/runtime/helpers/interopRequireDefault */ "@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(__webpack_require__(/*! react */ "react"));

var _createSvgIcon = _interopRequireDefault(__webpack_require__(/*! ./utils/createSvgIcon */ "./node_modules/@material-ui/icons/utils/createSvgIcon.js"));

var _default = (0, _createSvgIcon.default)(_react.default.createElement("path", {
  d: "M20.2 5.9l.8-.8C19.6 3.7 17.8 3 16 3s-3.6.7-5 2.1l.8.8C13 4.8 14.5 4.2 16 4.2s3 .6 4.2 1.7zm-.9.8c-.9-.9-2.1-1.4-3.3-1.4s-2.4.5-3.3 1.4l.8.8c.7-.7 1.6-1 2.5-1 .9 0 1.8.3 2.5 1l.8-.8zM19 13h-2V9h-2v4H5c-1.1 0-2 .9-2 2v4c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-4c0-1.1-.9-2-2-2zM8 18H6v-2h2v2zm3.5 0h-2v-2h2v2zm3.5 0h-2v-2h2v2z"
}), 'Router');

exports.default = _default;

/***/ }),

/***/ "./node_modules/@material-ui/icons/utils/createSvgIcon.js":
/*!****************************************************************!*\
  !*** ./node_modules/@material-ui/icons/utils/createSvgIcon.js ***!
  \****************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _interopRequireDefault = __webpack_require__(/*! @babel/runtime/helpers/interopRequireDefault */ "@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = createSvgIcon;

var _extends2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/extends */ "@babel/runtime/helpers/extends"));

var _react = _interopRequireDefault(__webpack_require__(/*! react */ "react"));

var _SvgIcon = _interopRequireDefault(__webpack_require__(/*! @material-ui/core/SvgIcon */ "@material-ui/core/SvgIcon"));

function createSvgIcon(path, displayName) {
  var Component = _react.default.memo(_react.default.forwardRef(function (props, ref) {
    return _react.default.createElement(_SvgIcon.default, (0, _extends2.default)({
      ref: ref
    }, props), path);
  }));

  if (true) {
    Component.displayName = "".concat(displayName, "Icon");
  }

  Component.muiName = _SvgIcon.default.muiName;
  return Component;
}

/***/ }),

/***/ "./src/hook.tsx":
/*!**********************!*\
  !*** ./src/hook.tsx ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importStar(__webpack_require__(/*! react */ "react"));
const Remove_1 = __importDefault(__webpack_require__(/*! @material-ui/icons/Remove */ "./node_modules/@material-ui/icons/Remove.js"));
const Router_1 = __importDefault(__webpack_require__(/*! @material-ui/icons/Router */ "./node_modules/@material-ui/icons/Router.js"));
const AddCircleOutline_1 = __importDefault(__webpack_require__(/*! @material-ui/icons/AddCircleOutline */ "./node_modules/@material-ui/icons/AddCircleOutline.js"));
const InputAdornment_1 = __importDefault(__webpack_require__(/*! @material-ui/core/InputAdornment */ "@material-ui/core/InputAdornment"));
const Input_1 = __importDefault(__webpack_require__(/*! @material-ui/core/Input */ "@material-ui/core/Input"));
const FormHelperText_1 = __importDefault(__webpack_require__(/*! @material-ui/core/FormHelperText */ "@material-ui/core/FormHelperText"));
const core_1 = __webpack_require__(/*! @material-ui/core */ "@material-ui/core");
// Add a item to the dashboard menu.
// The menu structure will be like this:
// ```
// - Dashboard
// - Settings
// + Apps
//   - LoRaWAN    <- new
// ```
hooks.setMenuHook("apps.lorawan", {
    primary: "LoRaWAN",
    icon: react_1.default.createElement(Router_1.default, null),
    href: "#/apps/waziup.wazigate-lora/index.html",
});
// A DeviceMenuHook adds a item to the devices context menu.
// We show a "Make LoRaWAN" for all devices that don't have `lorawan` metadata.  
hooks.addDeviceMenuHook((props) => {
    const { device, handleMenuClose, setDevice } = props;
    const handleClick = () => {
        handleMenuClose();
        setDevice((device) => (Object.assign(Object.assign({}, device), { meta: Object.assign(Object.assign({}, device.meta), { lorawan: {
                    profile: "",
                } }) })));
        // gateway.setDeviceMeta(device.id, {
        //     lorawan: {
        //         DevEUI: null,
        //     }
        // })
    };
    if (device === null || device.meta.lorawan) {
        return null;
    }
    return (react_1.default.createElement(core_1.MenuItem, { onClick: handleClick, key: "waziup.wazigate-lora" },
        react_1.default.createElement(core_1.ListItemIcon, null,
            react_1.default.createElement(Router_1.default, { fontSize: "small" })),
        react_1.default.createElement(core_1.ListItemText, { primary: "Make LoRaWAN", secondary: "Declare as LoRaWAN device" })));
});
const useStylesLoRaWAN = core_1.makeStyles((theme) => ({
    root: {
        overflow: "auto",
    },
    scrollBox: {
        padding: theme.spacing(2),
        minWidth: "fit-content",
    },
    paper: {
        background: "#d8dee9",
        minWidth: "fit-content",
    },
    header: {
        color: "#34425a",
    },
    name: {
        flexGrow: 1,
    },
    body: {
        padding: theme.spacing(2),
    },
    shortInput: {
        width: "300px",
        marginTop: theme.spacing(2),
    },
    longInput: {
        width: 400,
        maxWidth: "100%",
        marginTop: theme.spacing(2),
    },
    button: {},
    footer: {
        color: "#34425a",
    },
    submit: {
        minWidth: 100,
    }
}));
// A DevicHook adds some UI to a device.
// We add some input fields to make LoRaWAN settings for a device with `lorawan` meta.
hooks.addDeviceHook((props) => {
    const classes = useStylesLoRaWAN();
    const { device, setDevice } = props;
    const meta = device === null || device === void 0 ? void 0 : device.meta["lorawan"];
    const setMeta = (meta) => {
        setDevice((device) => (Object.assign(Object.assign({}, device), { meta: Object.assign(Object.assign({}, device.meta), { lorawan: meta }) })));
    };
    const [hasUnsavedChanges, setHasUnsavedChanges] = react_1.useState(false);
    const [showErrors, setShowErrors] = react_1.useState(false);
    const handleProfileChange = (event) => {
        setMeta(Object.assign(Object.assign({}, meta), { profile: event.target.value }));
        setHasUnsavedChanges(true);
    };
    const handleDevAddrChange = (event) => {
        const devAddr = event.target.value;
        setMeta(Object.assign(Object.assign({}, meta), { devEUI: devAddr2EUI(devAddr), devAddr: devAddr }));
        setHasUnsavedChanges(true);
    };
    const handleNwkSKeyChange = (event) => {
        setMeta(Object.assign(Object.assign({}, meta), { nwkSEncKey: event.target.value }));
        setHasUnsavedChanges(true);
    };
    const handleAppKeyChange = (event) => {
        setMeta(Object.assign(Object.assign({}, meta), { appSKey: event.target.value }));
        setHasUnsavedChanges(true);
    };
    const handleRemoveClick = () => {
        if (confirm("Do you want to remove the LoRaWAN settings from this device?")) {
            wazigate.setDeviceMeta(device.id, {
                lorawan: null
            }).then(() => {
                setMeta(null);
            }, (error) => {
                // TODO: improve
                alert(error);
            });
        }
    };
    const generateKeys = () => {
        const r = () => "0123456789ABCDEF"[Math.random() * 16 | 0];
        const rk = () => {
            var k = new Array(32);
            for (var i = 0; i < 32; i++)
                k[i] = r();
            return k.join("");
        };
        setMeta(Object.assign(Object.assign({}, meta), { nwkSEncKey: rk(), appSKey: rk() }));
        setHasUnsavedChanges(true);
    };
    const devAddr2EUI = (devAddr) => "AA555A00" + devAddr;
    const generateDevAddr = () => __awaiter(void 0, void 0, void 0, function* () {
        // TODO: implement :)
        // The randomDevAddr endpoint exists but requires a valid devEUI
        // but the devEUI if generated from the devAddr, so this conflicts
        alert("This feature is not available right now.");
        // const devEUI = "AA555A0012345678";
        // const devAddr = await wazigate.set<string>("apps/waziup.wazigate-lora/randomDevAddr", devEUI);
        // setMeta({
        //     ...meta,
        //     devAddr: devAddr
        // });
    });
    // TODO: UI inputs should show an error if the keys or devAddr is bad formatted
    const devAddr = (meta === null || meta === void 0 ? void 0 : meta.devAddr) || "";
    const devAddrErr = !/^[0-9a-fA-F]{8}$/.test(devAddr);
    var devAddrHelper = "";
    if (devAddrErr && showErrors && devAddr !== "") {
        if (devAddr.length < 8)
            devAddrHelper = `Too short! Expected 8 characters, got ${devAddr.length}.`;
        else if (devAddr.length > 8)
            devAddrHelper = `Too long! Expected 8 characters, got ${devAddr.length}.`;
        else if (!/^[0-9a-fA-F]*$/.test(devAddr))
            devAddrHelper = `Invalid! Use only '0-9' and 'A-F'.`;
    }
    const nwkSEncKey = (meta === null || meta === void 0 ? void 0 : meta.nwkSEncKey) || "";
    const nwkSEncKeyErr = !/^[0-9a-fA-F]{32}$/.test(nwkSEncKey);
    var nwkSEncKeyHelper = "";
    if (nwkSEncKeyErr && showErrors && nwkSEncKey !== "") {
        if (nwkSEncKey.length < 32)
            nwkSEncKeyHelper = `Too short! Expected 32 characters, got ${nwkSEncKey.length}.`;
        else if (nwkSEncKey.length > 32)
            nwkSEncKeyHelper = `Too long! Expected 32 characters, got ${nwkSEncKey.length}.`;
        else if (!/^[0-9a-fA-F]*$/.test(nwkSEncKey))
            nwkSEncKeyHelper = `Invalid! Use only '0-9' and 'A-F'.`;
    }
    const appSKey = (meta === null || meta === void 0 ? void 0 : meta.appSKey) || "";
    const appSKeyErr = !/^[0-9a-fA-F]{32}$/.test(appSKey);
    var appSKeyHelper = "";
    if (appSKeyErr && showErrors && appSKey !== "") {
        if (appSKey.length < 32)
            appSKeyHelper = `Too short! Expected 32 characters, got ${appSKey.length}.`;
        else if (appSKey.length > 32)
            appSKeyHelper = `Too long! Expected 32 characters, got ${appSKey.length}.`;
        else if (!/^[0-9a-fA-F]*$/.test(appSKey))
            appSKeyHelper = `Invalid! Use only '0-9' and 'A-F'.`;
    }
    const saveChanges = () => {
        if (devAddrErr || appSKeyErr || nwkSEncKeyErr) {
            setShowErrors(true);
            return;
        }
        wazigate.setDeviceMeta(device.id, {
            lorawan: meta
        }).then(() => {
            setHasUnsavedChanges(false);
        }, (error) => {
            // TODO: improve
            alert(error);
        });
    };
    return (react_1.default.createElement("div", { className: classes.root },
        react_1.default.createElement("div", { className: classes.scrollBox },
            react_1.default.createElement(core_1.Grow, { in: !!meta, key: "waziup.wazigate-lora" },
                react_1.default.createElement(core_1.Paper, { variant: "outlined", className: classes.paper },
                    react_1.default.createElement(core_1.Toolbar, { className: classes.header, variant: "dense" },
                        react_1.default.createElement(core_1.IconButton, { edge: "start" },
                            react_1.default.createElement(Router_1.default, null)),
                        react_1.default.createElement(core_1.Typography, { variant: "h6", noWrap: true, className: classes.name }, "LoRaWAN Settings"),
                        react_1.default.createElement(core_1.IconButton, { onClick: handleRemoveClick },
                            react_1.default.createElement(Remove_1.default, null))),
                    react_1.default.createElement("div", { className: classes.body },
                        react_1.default.createElement(core_1.FormControl, { className: classes.shortInput },
                            react_1.default.createElement(core_1.InputLabel, { id: "lorawan-profile-label" }, "LoRaWAN Profile"),
                            react_1.default.createElement(core_1.Select, { labelId: "lorawan-profile-label", id: "lorawan-profile", value: (meta === null || meta === void 0 ? void 0 : meta.profile) || "", onChange: handleProfileChange },
                                react_1.default.createElement(core_1.MenuItem, { value: "WaziDev" }, "WaziDev"),
                                react_1.default.createElement(core_1.MenuItem, { value: "" }, "Other"))),
                        react_1.default.createElement("br", null),
                        (meta === null || meta === void 0 ? void 0 : meta.profile) === "WaziDev" ? (react_1.default.createElement(react_1.Fragment, null,
                            react_1.default.createElement(core_1.FormControl, { className: classes.shortInput, error: devAddrErr && showErrors },
                                react_1.default.createElement(core_1.InputLabel, { htmlFor: "lorawan-devaddr" }, "DevAddr (Device Address) HEX"),
                                react_1.default.createElement(Input_1.default, { id: "lorawan-devaddr", onChange: handleDevAddrChange, value: devAddr, error: devAddrErr && showErrors, endAdornment: react_1.default.createElement(InputAdornment_1.default, { position: "end" },
                                        react_1.default.createElement(core_1.Tooltip, { title: "autogenerate" },
                                            react_1.default.createElement(core_1.IconButton, { "aria-label": "autogenerate", className: classes.button, onClick: generateDevAddr },
                                                react_1.default.createElement(AddCircleOutline_1.default, null)))) }),
                                react_1.default.createElement(FormHelperText_1.default, { error: devAddrErr && showErrors, id: "lorawan-devaddr-helper" }, devAddrHelper)),
                            react_1.default.createElement("br", null),
                            react_1.default.createElement(core_1.FormControl, { className: classes.longInput, error: nwkSEncKeyErr && showErrors },
                                react_1.default.createElement(core_1.InputLabel, { htmlFor: "lorawan-nwkSEncKey" }, "NwkSKey (Network Session Key) HEX"),
                                react_1.default.createElement(Input_1.default, { id: "lorawan-nwkSEncKey", onChange: handleNwkSKeyChange, value: nwkSEncKey, error: nwkSEncKeyErr && showErrors, endAdornment: react_1.default.createElement(InputAdornment_1.default, { position: "end" },
                                        react_1.default.createElement(core_1.Tooltip, { title: "autogenerate" },
                                            react_1.default.createElement(core_1.IconButton, { "aria-label": "autogenerate", className: classes.button, onClick: generateKeys },
                                                react_1.default.createElement(AddCircleOutline_1.default, null)))) }),
                                react_1.default.createElement(FormHelperText_1.default, { error: nwkSEncKeyErr && showErrors, id: "lorawan-nwkSEncKey-helper" }, nwkSEncKeyHelper)),
                            react_1.default.createElement("br", null),
                            react_1.default.createElement(core_1.FormControl, { className: classes.longInput, error: appSKeyErr && showErrors },
                                react_1.default.createElement(core_1.InputLabel, { htmlFor: "lorawan-appSKey" }, "AppKey (App Key) HEX"),
                                react_1.default.createElement(Input_1.default, { id: "lorawan-appSKey", onChange: handleAppKeyChange, value: appSKey, error: appSKeyErr && showErrors }),
                                react_1.default.createElement(FormHelperText_1.default, { error: appSKeyErr && showErrors, id: "lorawan-appSKey-helper" }, appSKeyHelper)))) : null),
                    react_1.default.createElement(core_1.Grow, { in: hasUnsavedChanges },
                        react_1.default.createElement(core_1.CardActions, { className: classes.footer },
                            react_1.default.createElement(core_1.Button, { variant: "contained", color: "primary", className: classes.submit, onClick: saveChanges }, "Save"))))))));
});
// Hook scripts always need to call this function to signal that the hook file was
// successfully executed.
hooks.resolve();


/***/ }),

/***/ 0:
/*!****************************!*\
  !*** multi ./src/hook.tsx ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! ./src/hook.tsx */"./src/hook.tsx");


/***/ }),

/***/ "@babel/runtime/helpers/extends":
/*!**********************************************!*\
  !*** external "BabelRuntimeHelpers.extends" ***!
  \**********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = BabelRuntimeHelpers.extends;

/***/ }),

/***/ "@babel/runtime/helpers/interopRequireDefault":
/*!************************************************************!*\
  !*** external "BabelRuntimeHelpers.interopRequireDefault" ***!
  \************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = BabelRuntimeHelpers.interopRequireDefault;

/***/ }),

/***/ "@material-ui/core":
/*!*****************************!*\
  !*** external "MaterialUI" ***!
  \*****************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = MaterialUI;

/***/ }),

/***/ "@material-ui/core/FormHelperText":
/*!********************************************!*\
  !*** external "MaterialUI.FormHelperText" ***!
  \********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = MaterialUI.FormHelperText;

/***/ }),

/***/ "@material-ui/core/Input":
/*!***********************************!*\
  !*** external "MaterialUI.Input" ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = MaterialUI.Input;

/***/ }),

/***/ "@material-ui/core/InputAdornment":
/*!********************************************!*\
  !*** external "MaterialUI.InputAdornment" ***!
  \********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = MaterialUI.InputAdornment;

/***/ }),

/***/ "@material-ui/core/SvgIcon":
/*!*************************************!*\
  !*** external "MaterialUI.SvgIcon" ***!
  \*************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = MaterialUI.SvgIcon;

/***/ }),

/***/ "react":
/*!************************!*\
  !*** external "React" ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = React;

/***/ })

/******/ });
//# sourceMappingURL=hook.js.map