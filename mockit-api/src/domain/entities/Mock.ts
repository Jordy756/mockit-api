import { randomUUID } from "node:crypto";

export type JsonPrimitive = string | number | boolean | null;

export interface JsonObject {
  [key: string]: JsonValue;
}

export interface JsonArray extends Array<JsonValue> {}

export type JsonValue = JsonPrimitive | JsonObject | JsonArray;

export class Mock {
  public readonly id: string;
  public readonly data: JsonObject;
  public readonly createdAt: Date;
  public readonly updatedAt: Date;

  constructor(data: JsonObject) {
    this.id = randomUUID();
    this.data = data;
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }
}
