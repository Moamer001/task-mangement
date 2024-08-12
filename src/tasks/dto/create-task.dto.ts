import {IsNotEmpty,IsString} from "class-validator" ;

export class CreatetaskDto {

    @IsString()
    @IsNotEmpty()
    title: string 


    @IsString()
    @IsNotEmpty()
    description:string
}