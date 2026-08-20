import { Mutation, Resolver , Query, Args } from '@nestjs/graphql';
import { MemberService } from './member.service';
import { InternalServerErrorException, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { LoginInput, MemberInput } from '../../libs/dto/member/member.input';
import { Member } from '../../libs/dto/member/member';
import { AuthGuard } from '../auth/guards/auth.guard';
import { AuthMember } from '../auth/decorators/authMember.decorator';
import * as mongoose from 'mongoose';


@Resolver()
export class MemberResolver {
    constructor(private readonly memberService: MemberService){}

    @Mutation(() => Member)
    public async signup(@Args("input") input: MemberInput):Promise<Member>{

      console.log("signup")
      return this.memberService.signup(input)}
        
  

      @Mutation(() => Member)
    public async login(@Args("input") input: LoginInput):Promise<Member>{
      
      console.log("login")
      return this.memberService.login(input)
    }

      @UseGuards(AuthGuard)
      @Mutation(() => String)
    public async updateMember(@AuthMember('_id') memberId: mongoose.ObjectId): Promise<string> {
        console.log("updateMember")
            return this.memberService.updateMember()
        
    }

    	@UseGuards(AuthGuard)
	@Mutation(() => String)
	public async checkAuth(@AuthMember('memberNick') memberNick: string): Promise<string> {
		console.log('Query checkAuth');
		
		console.log('memberNick[auth] =>', memberNick);
		return `Hi ${memberNick}, you are authenticated!`; ;
	}


      @Query(() => String)
    public async getMember():Promise<string>{
        console.log("getMember")
            return this.memberService.getMember()
        
    }


    /** ADMIN **/

	// Authorization: Admin
	@Mutation(() => String)
	public async getAllMembersByAdmin(): Promise<string> {
		console.log('Mutation getAllMembersByAdmin');
		return this.memberService.getAllMembersByAdmin();
	}

	// Authorization: Admin
	@Mutation(() => String)
	public async updateMemberByAdmin(): Promise<string> {
		console.log('Mutation updateMemberByAdmin');
		return this.memberService.updateMemberByAdmin();
	}
}
