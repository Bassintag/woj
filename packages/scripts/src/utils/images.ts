import * as fs from "node:fs/promises";
import * as path from "node:path";
import * as os from "node:os";

export class ImagesClient {
  constructor(private readonly rootPath: string) {}

  async save(filePath: string, data: Parameters<(typeof fs)["writeFile"]>[1]) {
    const distPath = path.resolve(this.rootPath, filePath);
    const dirname = path.dirname(distPath);
    await fs.mkdir(dirname, { recursive: true });
    await fs.writeFile(distPath, data);
  }
}
