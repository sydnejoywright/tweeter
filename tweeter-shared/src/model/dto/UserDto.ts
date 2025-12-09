export interface UserDto {
  readonly firstName: string;
  readonly lastName: string;
  readonly alias: string;
  imageUrl?: string | undefined;
}
