const deserialize = <T>(data: string): T => {
  try {
    return JSON.parse(data as string) as T;
  } catch (error) {
    return data as T;
  }
};

export { deserialize };
