import { randomUUID } from "crypto";
import { GoogleGenAI } from "@google/genai";
import { IAiDataGeneratorHelper } from "../../domain/interfaces/helpers/IAiDataGeneratorHelper.js";
import { PromGenerator } from "../../domain/constants/Proms.js";
import { Mock } from "../../domain/entities/Mock.js";

export class GeminiDataGeneratorHelper implements IAiDataGeneratorHelper {
  constructor(
    private readonly ai: GoogleGenAI,
    private readonly model: string,
    private readonly responseMimeType: string,
  ) {}

  public async generateData(schameExample: Mock, countValue: number = 10): Promise<Mock[]> {
    const prom = PromGenerator(schameExample.data, countValue);

    const response = await this.ai.models.generateContent({
      model: this.model,
      contents: prom,
      config: {
        responseMimeType: this.responseMimeType,
      },
    });

    if (!response.text) throw new Error("No fue posible generar la informacion necesaria. Intente mas tarde.");

    const responseContent = JSON.parse(response.text);

    const generateData: Mock[] = responseContent.map(
      (data: Record<string, unknown>) => 
        new Mock(
          { 
            id: randomUUID(), 
            data: data 
          }
        ),
    );

    return generateData;
  }
}
