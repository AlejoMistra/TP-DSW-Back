export interface Repository<T> {
  getAll(): Promise<T[]>;
  getOne(id: number): Promise<T | undefined>;
  add(item: Omit<T, 'id'>): Promise<T>;
  update(id: number, item: Partial<Omit<T, 'id'>>): Promise<T | undefined>;
  delete(id: number): Promise<boolean>;
}
