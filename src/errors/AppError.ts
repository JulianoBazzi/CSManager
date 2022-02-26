/* eslint-disable no-shadow */
export enum ToastsTypeEnum {
  Default = 'default',
  Primary = 'primary',
  Secondary = 'secondary',
  Danger = 'danger',
  Warning = 'warning',
  Success = 'success',
  Info = 'info',
}

export default class AppError {
  public readonly title: string;

  public readonly message: string;

  public readonly variant: string;

  constructor(title: string, message: string, variant: ToastsTypeEnum = ToastsTypeEnum.Default) {
    this.title = title;
    this.message = message;
    this.variant = variant;
  }
}
