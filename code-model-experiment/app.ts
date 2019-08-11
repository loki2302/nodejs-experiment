import * as cmr from "./code-model-reader";

const fileModels: cmr.FileModel[] = cmr.readCode(['dummy.ts']);
console.log(JSON.stringify(fileModels, null, '  '));
