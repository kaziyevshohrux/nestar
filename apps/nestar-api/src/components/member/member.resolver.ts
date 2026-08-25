import { Mutation, Resolver , Query, Args } from '@nestjs/graphql';
import { MemberService } from './member.service';
import { InternalServerErrorException, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { AgentInquiry, LoginInput, MemberInput, MembersInquiry } from '../../libs/dto/member/member.input';
import { Member, Members } from '../../libs/dto/member/member';
import { AuthGuard } from '../auth/guards/auth.guard';
import { AuthMember } from '../auth/decorators/authMember.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { MemberType } from '../../libs/enums/member.enum';
import { MemberUpdate } from '../../libs/dto/member/member.update';
import * as mongoose from 'mongoose';
import { shapeIntoMongoObjectId } from '../../libs/config';
import { WithoutGuard } from '../auth/guards/without.guard';


@Resolver()
export class MemberResolver {
    constructor(private readonly memberService: MemberService){}

    @Mutation(() => Member)
    public async signup(@Args("input") input: MemberInput):Promise<Member>{

      console.log("signup")
      return await this.memberService.signup(input)}
        
  
      @UseGuards(RolesGuard)
      @Mutation(() => Member)
    public async login(@Args("input") input: LoginInput):Promise<Member>{
      
      console.log("login")
      return await this.memberService.login(input)
    }

    @Roles(MemberType.USER, MemberType.AGENT)
	@UseGuards(RolesGuard)
	@Mutation(() => String)
	public async checkAuthRoles(@AuthMember() authMember: Member): Promise<string> {
		console.log('Query checkAuth');
		return await `Hi ${authMember.memberNick}, you are ${authMember.memberType} (memberId: ${authMember._id})`; 
	}

      @UseGuards(AuthGuard)
      @Mutation(() => Member)
    public async updateMember(@Args('input') input : MemberUpdate,
     @AuthMember('_id') memberId: mongoose.ObjectId ,): Promise<Member> {
        console.log("updateMember")
        delete input._id
            return await this.memberService.updateMember(memberId, input)
        
    }

    	@UseGuards(AuthGuard)
	@Mutation(() => String)
	public async checkAuth(@AuthMember('memberNick') memberNick: string): Promise<string> {
		console.log('Query checkAuth');
		
		console.log('memberNick[auth] =>', memberNick);
		return `Hi ${memberNick}, you are authenticated!`; ;
	}

      @UseGuards(WithoutGuard)
      @Query(() => Member)
	public async getMember(@Args("memberId") input: string, @AuthMember('_id')
   memberId: mongoose.ObjectId)
  : Promise<Member> {
		console.log('Mutation: getMember');
		const targetId = shapeIntoMongoObjectId(input);
			 return await this.memberService.getMember(memberId, targetId);
        
    }


    	 @UseGuards(WithoutGuard) //agentlar royxatini butun malumotlar bilan birgalikda olib beradi
    @Query(() => Members)
    public async getAgents(@Args("input") input: AgentInquiry, @AuthMember('_id') memberId: mongoose.ObjectId): Promise<Members>{
        console.log("Query getAgents")
        return await this.memberService.getAgents(memberId, input);
    }


    /** ADMIN **/

	// Authorization: Admin


	@Roles(MemberType.ADMIN)
	@UseGuards(RolesGuard)
	@Query(() => Members)
    public async getAllMembersByAdmin(@Args("input") input: MembersInquiry): Promise<Members> {
           console.log("Mutation: getAllMembersByAdmin");
        return await this.memberService.getAllMembersByAdmin(input);

	}

		// Authorization: Admin
	 @Roles(MemberType.ADMIN)
    @UseGuards(RolesGuard)
    @Mutation(() => Member) 
    public async updateMemberByAdmin(@Args("input") input: MemberUpdate): Promise<Member> {
        console.log("Mutation: updateMember");
        return await this.memberService.updateMemberByAdmin(input);
    }

}
