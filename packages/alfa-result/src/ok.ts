import { Equatable } from "@siteimprove/alfa-equatable";
import { Mapper } from "@siteimprove/alfa-mapper";
import { None, Option } from "@siteimprove/alfa-option";
import { Reducer } from "@siteimprove/alfa-reducer";
import { Err } from "./err";
import { Result } from "./result";

export class Ok<T> implements Result<T, never> {
  public static of<T>(value: T): Ok<T> {
    return new Ok(value);
  }

  private readonly _value: T;

  private constructor(value: T) {
    this._value = value;
  }

  public isOk(): this is Ok<T> {
    return true;
  }

  public isErr(): this is Err<never> {
    return false;
  }

  public map<U>(mapper: Mapper<T, U>): Ok<U> {
    return new Ok(mapper(this._value));
  }

  public mapErr(): this {
    return this;
  }

  public flatMap<U, F>(mapper: Mapper<T, Result<U, F>>): Result<U, F> {
    return mapper(this._value);
  }

  public reduce<U>(reducer: Reducer<T, U>, accumulator: U): U {
    return reducer(accumulator, this._value);
  }

  public and<U, F>(result: Result<U, F>): Result<U, F> {
    return result;
  }

  public andThen<U, F>(result: Mapper<T, Result<U, F>>): Result<U, F> {
    return result(this._value);
  }

  public or(): this {
    return this;
  }

  public orElse(): this {
    return this;
  }

  public get(): T {
    return this._value;
  }

  public getOr(): T {
    return this._value;
  }

  public getOrElse(): T {
    return this._value;
  }

  public ok(): Option<T> {
    return Option.of(this._value);
  }

  public err(): None {
    return None;
  }

  public equals(value: unknown): value is Ok<T> {
    return value instanceof Ok && Equatable.equals(value._value, this._value);
  }

  public *[Symbol.iterator]() {
    yield this._value;
  }

  public toJSON(): { value: T } {
    return { value: this._value };
  }

  public toString(): string {
    return `Ok { ${this._value} }`;
  }
}

export namespace Ok {
  export function isOk<T>(value: unknown): value is Ok<T> {
    return value instanceof Ok;
  }
}
