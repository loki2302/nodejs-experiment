import { expect } from "chai";
import { FileModel, ClassModel, MethodModel, ParameterModel, readCode } from "./code-model-reader";

describe('code-model-reader', () => {
    it('should work', () => {
        const fileModels: FileModel[] = readCode(["dummy.ts"]);
        expect(fileModels.length).to.equal(1);

        const dummyFileModel: FileModel = fileModels[0];
        expect(dummyFileModel.classes.length).to.equal(2);

        const classModel: ClassModel = dummyFileModel.classes.filter((c: ClassModel) => c.name == 'Calculator')[0];
        expect(classModel.comment).to.contain('Provides functionality to add an subtract numbers');
        expect(classModel.methods.length).to.equal(2);
    });
});
