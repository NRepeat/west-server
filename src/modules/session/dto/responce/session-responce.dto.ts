import { RefreshResponseDto } from "modules/auth/dto/response/refresh-response.dto";
import { SessionDto } from "../session.dto";

export class SessionResponseDto extends SessionDto {

	constructor(partial: SessionResponseDto) {
		super();
	}
}
