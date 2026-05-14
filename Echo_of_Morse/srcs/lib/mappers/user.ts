// convert the full API user info to simpler UI user info.
import type { User } from "@/generated/prisma"; 
import type { UserDTO } from "@/types/user";

export function toUserDTO(user: User): UserDTO {
  return {
    id: user.id,
    username: user.username,
    image: user.image,
    isOnline: user.isOnline,
  };
}