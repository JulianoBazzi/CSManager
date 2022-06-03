function CloneObject<T>(object: T): T {
  return JSON.parse(JSON.stringify(object));
}

export default CloneObject;
