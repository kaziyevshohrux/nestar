import { Mutation, Resolver , Query, Args } from '@nestjs/graphql';
import { MemberService } from './member.service';
import { InternalServerErrorException, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { LoginInput, MemberInput } from '../../libs/dto/member/member.input';
import { Member } from '../../libs/dto/member/member';
import { AuthGuard } from '../auth/guards/auth.guard';
import { AuthMember } from '../auth/decorators/authMember.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { MemberType } from '../../libs/enums/member.enum';
import { MemberUpdate } from '../../libs/dto/member/member.update';
import * as mongoose from 'mongoose';
import { shapeIntoMongoObjectId } from '../../libs/config';


@Resolver()
export class MemberResolver {
    constructor(private readonly memberService: MemberService){}

    @Mutation(() => Member)
    public async signup(@Args("input") input: MemberInput):Promise<Member>{

      console.log("signup")
      return this.memberService.signup(input)}
        
  
      @UseGuards(RolesGuard)
      @Mutation(() => Member)
    public async login(@Args("input") input: LoginInput):Promise<Member>{
      
      console.log("login")
      return this.memberService.login(input)
    }

    @Roles(MemberType.USER, MemberType.AGENT)
	@UseGuards(RolesGuard)
	@Mutation(() => String)
	public async checkAuthRoles(@AuthMember() authMember: Member): Promise<string> {
		console.log('Query checkAuth');
		return `Hi ${authMember.memberNick}, you are ${authMember.memberType} (memberId: ${authMember._id})`; 
	}

      @UseGuards(AuthGuard)
      @Mutation(() => Member)
    public async updateMember(@Args('input') input : MemberUpdate,
     @AuthMember('_id') memberId: mongoose.ObjectId ,): Promise<Member> {
        console.log("updateMember")
        delete input._id
            return this.memberService.updateMember(memberId, input)
        
    }

    	@UseGuards(AuthGuard)
	@Mutation(() => String)
	public async checkAuth(@AuthMember('memberNick') memberNick: string): Promise<string> {
		console.log('Query checkAuth');
		
		console.log('memberNick[auth] =>', memberNick);
		return `Hi ${memberNick}, you are authenticated!`; ;
	}


      @Query(() => Member)
	public async getMember(@Args('memberId') input: string): Promise<Member> {
		console.log('Mutation: getMember');
		const targetId = shapeIntoMongoObjectId(input);
		return this.memberService.getMember(targetId);
        
    }


    /** ADMIN **/

	// Authorization: Admin

  @Roles(MemberType.ADMIN)
	@UseGuards(RolesGuard)
	@Mutation(() => String)
public async getAllMembersByAdmin(@AuthMember() authMember: Member): Promise<string> {
		console.log("authMember.memberType", authMember.memberType);
		return this.memberService.getAllMembersByAdmin();
	}

	// Authorization: Admin
	@Mutation(() => String)
	public async updateMemberByAdmin(): Promise<string> {
		console.log('Mutation updateMemberByAdmin');
		return this.memberService.updateMemberByAdmin();
	}
}
