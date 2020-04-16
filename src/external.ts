import * as MaterialUI from "@material-ui/core";
import helpersInteropRequireDefault from "@babel/runtime/helpers/interopRequireDefault";
import helpersExtends from "@babel/runtime/helpers/extends";

(window as any)["BabelRuntimeHelpers"] = {
    extends: helpersExtends,
    interopRequireDefault: helpersInteropRequireDefault,
};

(window as any)["MaterialUI"] = MaterialUI;