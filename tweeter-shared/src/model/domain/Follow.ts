import { FollowDto } from "../dto/FollowDto";
import { User } from "./User";

export class Follow {
    private _follower: User;
    private _followee: User;

    public constructor(follower: User, followee: User) {
        this._follower = follower;
        this._followee = followee;
    }

    public get follower(): User {
        return this._follower;
    }

    public set follower(value: User) {
        this._follower = value;
    }
    
    public get followee(): User {
        return this._followee;
    }

    public set followee(value: User) {
        this._followee = value;
    }

    // public equals(other: Follow): boolean {
    //     return this._follower.equals(other._follower) && this._followee.equals(other._followee);
    // }

    public static fromJsonString(json: string | null | undefined): Follow | null {
        return json ? this.fromDto(JSON.parse(json)) : null;
    }

    public static fromDto(dto: FollowDto | null | undefined): Follow | null {
        if (dto) {
            const follower = User.fromDto(dto.follower);
            const followee = User.fromDto(dto.followee);
            if (follower && followee) {
                return new Follow(follower, followee);
            } else {
                return null;
            }
        } else {
            return null;
        }
    }

    public get dto(): FollowDto {
        return {
            follower: this.follower.dto,
            followee: this.followee.dto
        };
    }

    public toJson(): string {
        return JSON.stringify(this.dto);
    }


}
