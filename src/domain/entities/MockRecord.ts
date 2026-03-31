import { Mock } from "./Mock.js";

interface Props {
  id: string;
  mocks: Mock[];
  createdAt: Date;
  updatedAt: Date;
}

export class MockRecord {
  public id: string;
  public mocks: Mock[];
  public createdAt: Date;
  public updatedAt: Date;

  constructor({ id, mocks, createdAt, updatedAt }: Props) {
    this.id = id;
    this.mocks = mocks;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}
