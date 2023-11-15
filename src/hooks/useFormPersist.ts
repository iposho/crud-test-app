/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect } from 'react';
import { SetFieldValue } from 'react-hook-form';

export interface FormPersistConfig {
  storage?: Storage;
  watch: (names?: string | string[]) => any;
  setValue: SetFieldValue<any>;
  exclude?: string[];
  onDataRestored?: (data: any) => void;
  validate?: boolean;
  dirty?: boolean;
  touch?: boolean;
  onTimeout?: () => void;
  timeout?: number;
  skip: boolean;
}

const useFormPersist = (
  name: string,
  {
    storage,
    watch,
    setValue,
    exclude = [],
    onDataRestored,
    validate = false,
    dirty = false,
    touch = false,
    onTimeout,
    timeout,
    skip,
  }: FormPersistConfig,
) => {
  const watchedValues = watch();

  const getStorage = () => storage || window.sessionStorage;

  const clearStorage = () => getStorage().removeItem(name);

  useEffect(() => {
    if (skip) {
      return;
    }

    const str = getStorage().getItem(name);

    if (str) {
      const { timestamp = null, ...values } = JSON.parse(str);
      const dataRestored: { [key: string]: any } = {};
      const currTimestamp = Date.now();

      if (timeout && (currTimestamp - timestamp) > timeout) {
        if (onTimeout) {
          onTimeout();
        }

        clearStorage();
        return;
      }

      Object.keys(values).forEach((key) => {
        if (key === 'profile') {
          Object.keys(values[key]).forEach((k) => {
            setValue(`profile.${k}`, values[key][k]);
          });
        } else {
          dataRestored[key] = values[key];
          setValue(key, values[key], {
            shouldValidate: validate,
            shouldDirty: dirty,
            shouldTouch: touch,
          });
        }
      });

      if (onDataRestored) {
        onDataRestored(dataRestored);
      }
    }
  }, [
    storage,
    name,
    onDataRestored,
    setValue,
  ]);

  useEffect(() => {
    if (skip) {
      return;
    }

    const values = exclude.length
      ? Object.entries(watchedValues)
        .filter(([key]) => !exclude.includes(key))
        .reduce((obj, [key, val]) => Object.assign(obj, { [key]: val }), {})
      : ({ ...watchedValues });

    if (Object.entries(values).length) {
      if (timeout !== undefined) {
        values.timestamp = Date.now();
      }
      getStorage().setItem(name, JSON.stringify(values));
    }
  }, [watchedValues, timeout]);

  return {
    clearDataFromStorage: () => getStorage().removeItem(name),
  };
};

/* eslint-enable @typescript-eslint/no-explicit-any */
export default useFormPersist;
