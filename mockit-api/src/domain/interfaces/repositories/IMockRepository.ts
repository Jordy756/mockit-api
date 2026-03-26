import type { Mock } from "../../entities/Mock.js";

export interface IMockRepository {
  register(mock: Mock): Promise<Mock>;
  list(): Promise<Mock[]>;
}
