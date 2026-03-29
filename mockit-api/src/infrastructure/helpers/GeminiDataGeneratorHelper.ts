import { GoogleGenAI } from "@google/genai";
import { IAiDataGeneratorHelper } from '../../domain/interfaces/helpers/IAiDataGeneratorHelper.js';
import { AIResponse } from '../../domain/entities/AIResponse.js';
import { PromGenerator } from "../../domain/constants/Proms.js";
import { Mock } from '../../domain/entities/Mock.js';

export class GeminiDataGeneratorHelper implements IAiDataGeneratorHelper {
    
    constructor(
        private readonly ai: GoogleGenAI,
        private readonly model: string,
        private readonly responseMimeType: string
    ){}
    
    public async generateData(mock: Mock, count: number = 10): Promise<AIResponse> {
        
        var prom = PromGenerator(mock.data[0], count);
        
        const response = await this.ai.models.generateContent({
            model: this.model,
            contents: prom,
            config: {
                responseMimeType: this.responseMimeType,
            }
        });

        if (!response.text) 
            throw new Error("No fue posible generar la informacion necesaria. Intente mas tarde.");
        

        return new AIResponse(JSON.parse(response.text));
    }
    
}