import { UserDto } from "../dto/UserDto";

export class User {
  private _firstName: string;
  private _lastName: string;
  private _alias: string;
  private _imageUrl: string;

  public constructor(
    firstName: string,
    lastName: string,
    alias: string,
    imageUrl: string
  ) {
    this._firstName = firstName;
    this._lastName = lastName;
    this._alias = alias;
    this._imageUrl = imageUrl;
  }

  public get firstName(): string {
    return this._firstName;
  }

  public set firstName(value: string) {
    this._firstName = value;
  }

  public get lastName(): string {
    return this._lastName;
  }

  public set lastName(value: string) {
    this._lastName = value;
  }

  public get name() {
    return `${this.firstName} ${this.lastName}`;
  }

  public get alias(): string {
    return this._alias;
  }

  public set alias(value: string) {
    this._alias = value;
  }

  public get imageUrl(): string {
    return this._imageUrl;
  }

  public set imageUrl(value: string) {
    this._imageUrl = value;
  }

  public equals(other: User): boolean {
    return this._alias === other._alias;
  }

  public static fromJson(json: string | null | undefined): User | null {
    if (!json) return null;

    const obj: {
      firstName: string;
      lastName: string;
      alias: string;
      imageUrl: string;
    } = JSON.parse(json);

    return new User(obj.firstName, obj.lastName, obj.alias, obj.imageUrl);
  }

  public toJson(): string {
    return JSON.stringify(this);
  }

  public get dto(): UserDto {
    // Hardcoded S3 bucket and region
    const bucket = "tweeter-server-profile-pics-try1";
    const region = "us-east-1";

    const fullImageUrl =
      this.imageUrl && !this.imageUrl.startsWith("http")
        ? `https://${bucket}.s3.${region}.amazonaws.com/${this.imageUrl}`
        : this.imageUrl;

    return {
      firstName: this.firstName,
      lastName: this.lastName,
      alias: this.alias,
      imageUrl: fullImageUrl,
    };
  }

  public static fromDto(dto: UserDto | null): User | null {
    if (!dto) return null;
    return new User(dto.firstName, dto.lastName, dto.alias, dto.imageUrl ?? "");
  }
}
