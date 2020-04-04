package fr.loseawards.archiveuser.api;

import com.google.api.server.spi.config.ApiMethod;
import com.google.api.server.spi.config.Named;
import fr.loseawards.AbstractServiceApi;
import fr.loseawards.archiveuser.dto.ArchiveUserDTO;
import fr.loseawards.model.ArchiveUser;
import fr.loseawards.util.Converter;

import java.util.List;

public class ArchiveUserApi extends AbstractServiceApi {
	/**
	 * Retourne tous les utilisateurs d'archive.
	 * GET http://localhost:8080/_ah/api/loseawards/v1/archiveusers
	 * @return
	 */
	@ApiMethod(path = "archiveusers", httpMethod = ApiMethod.HttpMethod.GET)
	public List<ArchiveUserDTO> getArchiveUsers() {
		// Récupération des utilisateurs dans la base		
		List<ArchiveUser> archiveUsers = getPersistenceService().getArchiveUsers();

		// Conversion en DTO
		return Converter.toArchiveUsersDTO(archiveUsers);
	}

	/**
	 * Retourne un utilisateur d'archive.
	 * GET http://localhost:8080/_ah/api/loseawards/v1/archiveusers/6641050231767040
	 * @param archiveUserId
	 * @return
	 */
	@ApiMethod(path = "archiveusers/{archiveUserId}", httpMethod = ApiMethod.HttpMethod.GET)
	public ArchiveUserDTO getArchiveUser(@Named("archiveUserId") final Long archiveUserId) {
		ArchiveUser archiveUser = getPersistenceService().getArchiveUser(archiveUserId);
		if (archiveUser == null) {
			return null;
		}

		// Conversion en DTO
		return Converter.toDTO(archiveUser);
	}

	/**
	 * Crée un utilisateur d'archive.
	 * POST http://localhost:8080/_ah/api/loseawards/v1/archiveusers
	 * @param archiveUserDTO
	 * @return
	 */
	@ApiMethod(path = "archiveusers", httpMethod = ApiMethod.HttpMethod.POST)
	public ArchiveUserDTO createArchiveUser(final ArchiveUserDTO archiveUserDTO) {
		ArchiveUser archiveUser = Converter.fromDTO(archiveUserDTO);
		getPersistenceService().addArchiveUser(archiveUser);
		archiveUserDTO.setId(archiveUser.getId());
		
		return archiveUserDTO;
	}

	/**
	 * Supprime un utilisateur d'archive.
	 * DELETE http://localhost:8080/_ah/api/loseawards/v1/archiveusers/6641050231767040
	 * @param archiveUserId
	 */
	@ApiMethod(path = "archiveusers/{archiveUserId}", httpMethod = ApiMethod.HttpMethod.DELETE)
	public void deleteArchiveUser(@Named("archiveUserId") final Long archiveUserId) {
		getPersistenceService().deleteArchiveUser(archiveUserId);
	}

	/**
	 * Met à jour un utilisateur d'archive.
	 * PUT http://localhost:8080/_ah/api/loseawards/v1/archiveusers/6641050231767040
	 * @param archiveUserId
	 * @param archiveUserDTO
	 * @return
	 */
	@ApiMethod(path = "archiveusers/{archiveUserId}", httpMethod = ApiMethod.HttpMethod.PUT)
	public ArchiveUserDTO updateArchiveUser(@Named("archiveUserId") final Long archiveUserId, final ArchiveUserDTO archiveUserDTO) {
		ArchiveUser archiveUser = Converter.fromDTO(archiveUserDTO);
		getPersistenceService().updateArchiveUser(archiveUser);
		
		return archiveUserDTO;
	}
}
