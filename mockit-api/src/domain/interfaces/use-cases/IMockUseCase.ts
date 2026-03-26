import type { Mock, JsonValue } from "../../entities/Mock.js";

export interface IMockUseCase {
  register(payload: JsonValue): Promise<Mock>;
  list(): Promise<Mock[]>;
}
