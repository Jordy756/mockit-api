import { randomUUID } from "node:crypto";

export type JsonPrimitive = string | number | boolean | null;

export interface JsonObject {
  [key: string]: JsonValue;
}

export interface JsonArray extends Array<JsonValue> {}

export type JsonValue = JsonPrimitive | JsonObject | JsonArray;

export interface MockDefinitionProps {
  id: string;
  payload: JsonValue;
  createdAt: Date;
  updatedAt: Date;
}

export interface NewMockDefinitionProps {
  payload: JsonValue;
}

export class Mock {
  public readonly id: string;
  public readonly payload: JsonValue;
  public readonly createdAt: Date;
  public readonly updatedAt: Date;

  constructor(props: MockDefinitionProps) {
    this.id = props.id;
    this.payload = props.payload;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }

  public static createNew(input: NewMockDefinitionProps): Mock {
    return new Mock({
      id: randomUUID(),
      payload: input.payload,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }
}
