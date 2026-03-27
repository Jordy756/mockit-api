import { randomUUID } from "node:crypto";

export type JsonPrimitive = string | number | boolean | null;

export interface JsonObject {
  [key: string]: JsonValue;
}

export interface JsonArray extends Array<JsonValue> {}

export type JsonValue = JsonPrimitive | JsonObject | JsonArray;

export class Template {
  public readonly id: string;
  public readonly payload: JsonValue;
  public readonly createdAt: Date;
  public readonly updatedAt: Date;

  constructor(payload: JsonValue) {
    this.id = randomUUID();
    this.payload = payload;
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }
}
