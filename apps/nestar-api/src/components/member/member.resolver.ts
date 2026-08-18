import { Mutation, Resolver , Query, Args } from '@nestjs/graphql';
import { MemberService } from './member.service';
import { UsePipes, ValidationPipe } from '@nestjs/common';
import { loginInput, MemberInput } from '../../libs/dto/member/member.input';


@Resolver()
export class MemberResolver {
    constructor(private readonly memberService: MemberService){}

    @Mutation(() => String)
    @UsePipes(ValidationPipe)
    public async signup(@Args("input") input: MemberInput):Promise<string>{
        console.log("signup")
            return this.memberService.signup()
        
    }

      @Mutation(() => String)
          @UsePipes(ValidationPipe)
    public async login(@Args("input") input: loginInput):Promise<string>{
        console.log("login")
            return this.memberService.login()
        
    }

      @Mutation(() => String)
    public async updateMember():Promise<string>{
        console.log("updateMember")
            return this.memberService.updateMember()
        
    }

      @Query(() => String)
    public async getMember():Promise<string>{
        console.log("getMember")
            return this.memberService.getMember()
        
    }
}
