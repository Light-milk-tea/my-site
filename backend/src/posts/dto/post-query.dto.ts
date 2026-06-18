import { Transform } from 'class-transformer';
import { IsOptional, IsString, Max, Min } from 'class-validator';

export class PostQueryDto {
  @IsOptional()
  @Transform(({ value }) => Number(value))
  @Min(1)
  page = 1;

  @IsOptional()
  @Transform(({ value }) => Number(value))
  @Min(1)
  @Max(50)
  pageSize = 10;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsString()
  tag?: string;

  @IsOptional()
  @IsString()
  keyword?: string;
}
