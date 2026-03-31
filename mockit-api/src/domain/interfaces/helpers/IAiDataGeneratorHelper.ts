import { Mock } from "../../entities/Mock.js";

export interface IAiDataGeneratorHelper {
  generateData(schameExample: Mock, countValue?: number): Promise<Mock[]>;
}
