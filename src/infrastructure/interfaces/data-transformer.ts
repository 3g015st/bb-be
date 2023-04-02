export interface IDataTransformerParams<T> {
  data: T;
}

export interface IDataTransformerResponse<T> {
  result: T;
}

export interface IDataTransformer<TInput, TOutput> {
  transform(
    params: IDataTransformerParams<TInput>
  ): IDataTransformerResponse<TOutput>;
}
