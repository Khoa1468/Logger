function eq(value: any, other: any) {
  return value === other || (value !== value && other !== other);
}

function defaults<T, P>(target: T, source: P): NonNullable<T & P> {
  target = Object(target);
  if (source != null) {
    Object.keys(source).forEach((key) => {
      const value = (target as any)[key];
      if (
        value === undefined ||
        (eq(value, (Object.prototype as any)[key]) &&
          !Object.hasOwnProperty.call(target, key))
      ) {
        (target as any)[key] = (source as any)[key];
      }
    });
  }
  return target as NonNullable<T & P>;
}

export { defaults };
