import { Mock } from "./Mock.js";

interface MockRecordProps {
  id: string;
  mocks: Mock[];
  createdAt: Date;
  updatedAt: Date;
}

export class MockRecord {
  public readonly id: string;
  public readonly mocks: Mock[];
  public readonly createdAt: Date;
  public readonly updatedAt: Date;

  constructor({ id, mocks, createdAt, updatedAt }: MockRecordProps) {
    this.id = id;
    this.mocks = mocks;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}
