import { Equality } from "@siteimprove/alfa-equality";
import { Mapper } from "@siteimprove/alfa-mapper";
import { None, Option, Some } from "@siteimprove/alfa-option";
import { Predicate } from "@siteimprove/alfa-predicate";
import { Reducer } from "@siteimprove/alfa-reducer";

export namespace Iterable {
  export function* from<T>(arrayLike: ArrayLike<T>): Iterable<T> {
    for (let i = 0, n = arrayLike.length; i < n; i++) {
      yield arrayLike[i];
    }
  }

  export function* map<T, U = T>(
    iterable: Iterable<T>,
    mapper: Mapper<T, U>
  ): Iterable<U> {
    for (const value of iterable) {
      yield mapper(value);
    }
  }

  export function* flatMap<T, U = T>(
    iterable: Iterable<T>,
    mapper: Mapper<T, Iterable<U>>
  ): Iterable<U> {
    for (const value of iterable) {
      yield* mapper(value);
    }
  }

  export function reduce<T, U = T>(
    iterable: Iterable<T>,
    reducer: Reducer<T, U>,
    accumulator: U
  ): U {
    for (const value of iterable) {
      accumulator = reducer(accumulator, value);
    }

    return accumulator;
  }

  export function includes<T>(iterable: Iterable<T>, value: T): boolean {
    for (const found of iterable) {
      if (Equality.equals(value, found)) {
        return true;
      }
    }

    return false;
  }

  export function find<T, U extends T = T>(
    iterable: Iterable<T>,
    predicate: Predicate<T, U>
  ): Option<U> {
    for (const value of iterable) {
      if (Predicate.test(predicate, value)) {
        return Some.of(value);
      }
    }

    return None;
  }

  export function some<T, U extends T = T>(
    iterable: Iterable<T>,
    predicate: Predicate<T, U>
  ): boolean {
    for (const value of iterable) {
      if (Predicate.test(predicate, value)) {
        return true;
      }
    }

    return false;
  }

  export function every<T, U extends T = T>(
    iterable: Iterable<T>,
    predicate: Predicate<T, U>
  ): boolean {
    for (const value of iterable) {
      if (!Predicate.test(predicate, value)) {
        return false;
      }
    }

    return true;
  }

  export function* filter<T, U extends T = T>(
    iterable: Iterable<T>,
    predicate: Predicate<T, U>
  ): Iterable<U> {
    for (const value of iterable) {
      if (Predicate.test(predicate, value)) {
        yield value;
      }
    }
  }

  export function first<T>(iterable: Iterable<T>): Option<T> {
    for (const value of iterable) {
      return Some.of(value);
    }

    return None;
  }

  export function join(iterable: Iterable<string>, separator: string): string {
    const iterator = iterable[Symbol.iterator]();

    let next = iterator.next();

    if (next.done === true) {
      return "";
    }

    let result = next.value;
    next = iterator.next();

    while (next.done !== true) {
      result += separator + next.value;
      next = iterator.next();
    }

    return result;
  }

  export function subtract<T>(
    left: Iterable<T>,
    right: Iterable<T>
  ): Iterable<T> {
    return filter(left, left => !includes(right, left));
  }

  export function intersect<T>(
    left: Iterable<T>,
    right: Iterable<T>
  ): Iterable<T> {
    return filter(left, left => includes(right, left));
  }

  export function isIterable<T>(value: unknown): value is Iterable<T> {
    return (
      typeof value === "object" && value !== null && Symbol.iterator in value
    );
  }
}