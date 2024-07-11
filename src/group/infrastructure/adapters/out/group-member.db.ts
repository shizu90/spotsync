import { Injectable } from "@nestjs/common";
import { GroupMemberRepository } from "src/group/application/ports/out/group-member.repository";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class GroupMemberRepositoryImpl implements GroupMemberRepository
{
    constructor(
        @Inject(PrismaService)
        protected prismaService: PrismaService
    ) 
    {}

    
}