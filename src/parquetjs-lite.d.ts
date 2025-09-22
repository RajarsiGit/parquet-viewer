declare module "parquetjs-lite" {
  export class ParquetReader {
    static openFile(path: string): Promise<ParquetReader>;
    getCursor(): any;
    close(): Promise<void>;
  }

  export class ParquetCursor {
    next(): Promise<any | null>;
  }
}
