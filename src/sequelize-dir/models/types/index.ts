export type RequiredKeyType<T, K extends keyof T> = Omit<T, K> &
  Required<Pick<T, K>>;

export interface TimeStampAttributes {
  created_at?: Date | string;
  updated_at?: Date | string;
  deleted_at?: Date | string;
}
