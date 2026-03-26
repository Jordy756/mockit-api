export const HTTP_METHOD = {
  GET: "GET",
  POST: "POST",
  PUT: "PUT",
  PATCH: "PATCH",
  DELETE: "DELETE",
} as const;

export type HttpMethod = (typeof HTTP_METHOD)[keyof typeof HTTP_METHOD];

export type JsonPrimitive = string | number | boolean | null;

export interface JsonObject {
  [key: string]: JsonValue;
}

export interface JsonArray extends Array<JsonValue> {}

export type JsonValue = JsonPrimitive | JsonObject | JsonArray;

export interface MockDefinitionProps {
  id: number;
  name: string;
  method: HttpMethod;
  path: string;
  statusCode: number;
  responseBody: JsonValue;
  headers: Record<string, string>;
  delayMs: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface NewMockDefinitionProps {
  name: string;
  method: HttpMethod;
  path: string;
  statusCode: number;
  responseBody: JsonValue;
  headers?: Record<string, string>;
  delayMs?: number;
  isActive?: boolean;
}

export class MockDefinition {
  public readonly id: number;
  public readonly name: string;
  public readonly method: HttpMethod;
  public readonly path: string;
  public readonly statusCode: number;
  public readonly responseBody: JsonValue;
  public readonly headers: Record<string, string>;
  public readonly delayMs: number;
  public readonly isActive: boolean;
  public readonly createdAt: Date;
  public readonly updatedAt: Date;

  constructor(props: MockDefinitionProps) {
    this.id = props.id;
    this.name = props.name;
    this.method = props.method;
    this.path = props.path;
    this.statusCode = props.statusCode;
    this.responseBody = props.responseBody;
    this.headers = props.headers;
    this.delayMs = props.delayMs;
    this.isActive = props.isActive;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }

  public static createNew(input: NewMockDefinitionProps): NewMockDefinitionProps {
    return {
      name: input.name,
      method: input.method,
      path: input.path,
      statusCode: input.statusCode,
      responseBody: input.responseBody,
      headers: input.headers ?? {},
      delayMs: input.delayMs ?? 0,
      isActive: input.isActive ?? true,
    };
  }
}
