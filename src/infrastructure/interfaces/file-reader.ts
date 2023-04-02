export interface IFileReaderParams {
  location: string;
}

export interface IFileReaderResponse<T> {
  data: T;
}

export interface IFileReader<IFileReaderResponse> {
  read(params: IFileReaderParams): IFileReaderResponse;
}
