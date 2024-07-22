import { GroupPermission, GroupRole, GroupRolePermission, PrismaClient } from "@prisma/client";
import { randomUUID } from "crypto";

export async function seed(client: PrismaClient) 
{
    const permissions: GroupPermission[] = [
        {id: randomUUID(), name: 'update-settings'},
        {id: randomUUID(), name: 'delete-group'},
        {id: randomUUID(), name: 'remove-member'},
        {id: randomUUID(), name: 'delete-posts'},
        {id: randomUUID(), name: 'delete-events'},
        {id: randomUUID(), name: 'create-posts'},
        {id: randomUUID(), name: 'create-events'},
        {id: randomUUID(), name: 'accept-requests'},
        {id: randomUUID(), name: 'create-role'},
        {id: randomUUID(), name: 'remove-role'},
        {id: randomUUID(), name: 'update-role'},
        {id: randomUUID(), name: 'change-member-role'}
    ];

    for(const p of permissions) {
        const exists = await client.groupPermission.findFirst({where: {name: p.name}});

        if(exists === null || exists === undefined) {
            await client.groupPermission.create({
                data: p
            });
        }else {
            p.id = exists.id;
        }
    }

    const roles: {role: GroupRole, permissions: GroupPermission[]}[] = [
        {
            role: {
                id: randomUUID(), 
                name: 'administrator', 
                hex_color: '#f5bc42', 
                is_immutable: true, 
                created_at: new Date(), 
                updated_at: new Date(), 
                group_id: null
            },
            permissions: [...permissions]
        },
        {
            role: {
                id: randomUUID(), 
                name: 'member', 
                hex_color: '#4ef542', 
                is_immutable: true, 
                created_at: new Date(), 
                updated_at: new Date(), 
                group_id: null
            },
            permissions: permissions.filter((p) => ['create-posts', 'create-events'].includes(p.name))
        }
    ];

    for(const r of roles) {
        const exists = await client.groupRole.findFirst({where: {name: r.role.name}});

        if(exists === null || exists === undefined) {
            await client.groupRole.create({
                data: {
                    ...r.role,
                    permissions: {
                        createMany: {
                            data: r.permissions.map((p) => {return {group_permission_id: p.id};})
                        }
                    }
                }
            });
        }
    }
}