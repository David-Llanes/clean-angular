export type Operator =
  | '='
  | '<>'
  | '>'
  | '>='
  | '<'
  | '<='
  | 'startswith'
  | 'endswith'
  | 'contains'
  | 'notcontains';

export type LogicalOperator = 'and' | 'or';

export interface Filter<T> {
  field: keyof T;
  operator: Operator;
  value: string;
}

export type QueryOptionsFilter<TEntity> =
  | Filter<TEntity>
  | LogicalOperator
  | QueryOptionsFilterArray<TEntity>;

export type QueryOptionsFilterArray<TEntity> = (
  | Filter<TEntity>
  | LogicalOperator
  | QueryOptionsFilterArray<TEntity>
)[];

export interface Sort<T> {
  selector: keyof T;
  desc: boolean;
}

export interface QueryOptions<TEntity> {
  page?: number;
  skip?: number;
  take?: number;
  requireTotalCount?: boolean;
  filters?: QueryOptionsFilter<TEntity>[];
  sort?: Sort<TEntity>[];
}
