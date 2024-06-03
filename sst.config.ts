import { SSTConfig } from "sst";
import { ImageResizingStack } from "./stacks/ImageResizingStack";

export default {
  config(_input) {
    return {
      name: "bucket-image-resize",
      region: "ap-southeast-1",
    };
  },
  stacks(app) {
    app.stack(ImageResizingStack);
  }
} satisfies SSTConfig;
