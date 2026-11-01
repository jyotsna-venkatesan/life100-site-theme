import * as ghostErrors from "./errors";
import { deserialize, isGhostError, prepareStackForUser, serialize } from "./utils";
export * from "./errors";
var index_default = ghostErrors;
const utils = {
  serialize,
  deserialize,
  isGhostError,
  prepareStackForUser
};
export {
  index_default as default,
  utils
};
