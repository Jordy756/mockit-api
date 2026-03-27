import { randomUUID } from "node:crypto";

import type { JsonObject } from "./Template.js";

export class Mock {
  public readonly id: string;
  public readonly templateId: string;
  public readonly data: JsonObject;
  public readonly createdAt: Date;
  public readonly updatedAt: Date;

  constructor(templateId: string, data: JsonObject) {
    this.id = randomUUID();
    this.templateId = templateId;
    this.data = data;
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }
}
