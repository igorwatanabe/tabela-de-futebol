import { ID } from '.';

export interface ICRUDModelCreator<T> {
  create(data: Partial<T>): Promise<T>,
}

export interface ICRUDModelReaderById<T> {
  findById(id: ID): Promise<T | null>,
}

export interface ICRUDModelReaderAll<T> {
  findAll(): Promise<T[]>,
}

export interface ICRUDModelUpdater<T> {
  update(id: ID): Promise<T | null>,
}

export interface ICRUDModelDeleter {
  delete(id: ID): Promise<number>,
}

export interface ICRUDModel<T>
  extends ICRUDModelCreator<T>,
  ICRUDModelReaderAll<T>,
  ICRUDModelReaderById<T>,
  ICRUDModelUpdater<T>,
  ICRUDModelDeleter { }
