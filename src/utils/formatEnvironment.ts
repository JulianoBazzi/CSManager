export enum NodeEnvEnum {
  Production = 'production',
  Test = 'test',
  Development = 'development',
}

export default function formatEnvironment(value: string): NodeEnvEnum {
  if (value === 'test') {
    return NodeEnvEnum.Test;
  }
  if (value === 'development') {
    return NodeEnvEnum.Development;
  }
  return NodeEnvEnum.Production;
}
