package fr.loseawards.avatar.api;

import java.util.List;

import com.google.api.server.spi.config.ApiMethod;
import com.google.api.server.spi.config.ApiMethod.HttpMethod;
import com.google.api.server.spi.config.Named;

import fr.loseawards.AbstractServiceApi;
import fr.loseawards.avatar.dto.AvatarDTO;
import fr.loseawards.model.Avatar;
import fr.loseawards.util.Converter;

public class AvatarApi extends AbstractServiceApi {
	/**
	 * Retourne l'image d'un avatar.
	 * GET http://localhost:8080/_ah/api/loseawards/v1/avatars/4547580092481536
	 * @param avatarId
	 * @return
	 */
//	@ApiMethod(path = "avatars/{avatarId}", httpMethod = HttpMethod.GET)
//	public byte[] getAvatar(@Named("avatarId") final Long avatarId) {
//		Avatar avatar = getPersistenceService().getAvatar(avatarId);
//		if (avatar != null) {
//			return avatar.getImage();
//		}
//		return null;
//	}
	
	/**
	 * Récupère tous les avatars.
	 * GET http://localhost:8080/_ah/api/loseawards/v1/avatars
	 * @return
	 */
	@ApiMethod(path = "avatars", httpMethod = HttpMethod.GET)
	public List<AvatarDTO> getAvatars() {
		// Récupération des avatars dans la base		
		List<Avatar> avatars = getPersistenceService().getAvatars();

		// Conversion en DTO
		return Converter.toAvatarsDTO(avatars);
	}
	
	/**
	 * Supprime un avatar.
	 * DELETE http://localhost:8080/_ah/api/loseawards/v1/avatars/6641050231767040
	 * @param idUser
	 */
	@ApiMethod(path = "avatars/{avatarId}", httpMethod = HttpMethod.DELETE)
	public void deleteAvatar(@Named("avatarId") final Long avatarId) {
		getPersistenceService().deleteAvatar(avatarId);
	}
}
