import {
  createPluginFactory,
} from "@udecode/plate";

import { ELEMENT_CAPTURE } from "@mexit/core";

export const createCapturePlugin = createPluginFactory({
  key: ELEMENT_CAPTURE,
  isElement: true,
  type: ELEMENT_CAPTURE,
});
