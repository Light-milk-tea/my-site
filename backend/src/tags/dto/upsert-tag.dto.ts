import { IsOptional, IsString, MinLength } from 'class-validator';

export class UpsertTagDto {
  @IsString()
  @MinLength(1)
  name!: string;

  @IsOptional()
  @IsString()
  slug?: string;
}
