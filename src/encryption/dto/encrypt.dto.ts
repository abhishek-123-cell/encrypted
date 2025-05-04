import { IsUUID, IsNumber, Min, Max } from 'class-validator';

export class EncryptDto {
  @IsUUID()
  uuid!: string;

  publicKey!: string;

  @IsNumber()
  @Min(0.01)
  @Max(99.99)
  number!: number;
}
