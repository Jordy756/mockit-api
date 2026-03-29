import { AIResponse } from "../../entities/AIResponse.js";
import { Mock } from "../../entities/Mock.js";

export interface IAiDataGeneratorHelper {
    generateData(mock: Mock, count?: number): Promise<AIResponse>;
}