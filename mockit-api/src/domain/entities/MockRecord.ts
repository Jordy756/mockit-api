import { Mock } from "./Mock.js";

interface MockRecordProps {
  id: string;
  mock: Mock;
  createdAt: Date;
  updatedAt: Date;
}

export class MockRecord {
  public readonly id: string;
  public readonly mock: Mock;
  public readonly createdAt: Date;
  public readonly updatedAt: Date;

  constructor({ id, mock, createdAt, updatedAt }: MockRecordProps) {
    this.id = id;
    this.mock = mock;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}
