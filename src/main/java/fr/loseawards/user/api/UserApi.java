package fr.loseawards.user.api;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.google.api.server.spi.config.ApiMethod;
import com.google.api.server.spi.config.ApiMethod.HttpMethod;
import com.google.api.server.spi.config.Named;

import fr.loseawards.AbstractServiceApi;
import fr.loseawards.model.Avatar;
import fr.loseawards.model.Nomination;
import fr.loseawards.model.User;
import fr.loseawards.nomination.dto.NominationDTO;
import fr.loseawards.user.dto.UserBundleDTO;
import fr.loseawards.user.dto.UserDTO;
import fr.loseawards.util.Converter;

public class UserApi extends AbstractServiceApi {
	/**
	 * Récupère tous les utilisateurs.
	 * GET http://localhost:8080/_ah/api/loseawards/v1/users
	 * @return
	 */
	@ApiMethod(path = "users", httpMethod = HttpMethod.GET)
	public List<UserDTO> getUsers() {
		// Récupération des utilisateurs dans la base		
		List<User> users = getPersistenceService().getUsers();

		// Conversion en DTO
		return Converter.toUsersDTO(users);
	}
	
	/**
	 * Récupère un utilisateur.
	 * GET http://localhost:8080/_ah/api/loseawards/v1/users/6641050231767040
	 * @param userId
	 * @return
	 */
	@ApiMethod(path = "users/{userId}", httpMethod = HttpMethod.GET)
	public UserDTO getUser(@Named("userId") final Long userId) {
		User user = getPersistenceService().getUser(userId);
		if (user == null) {
			return null;
		}
		return Converter.toDTO(user);
	}
	
	/**
	 * Crée un utilisateur.
	 * POST http://localhost:8080/_ah/api/loseawards/v1/users
	 * @param userDTO
	 * @return
	 */
	@ApiMethod(path = "users", httpMethod = HttpMethod.POST)
	public UserDTO createUser(final UserDTO userDTO) {
		User user = Converter.fromDTO(userDTO);
		
		// Avatar
		if (userDTO.getAvatar() != null) {
			Avatar avatar = new Avatar();
			avatar.setImage(userDTO.getAvatar());
			getPersistenceService().addAvatar(avatar);
			
			user.setAvatarId(avatar.getId());
			userDTO.setAvatarId(avatar.getId());
			userDTO.setAvatar(null);
		}
		
		getPersistenceService().addUser(user);
		userDTO.setId(user.getId());
		
		return userDTO;
	}
	
	/**
	 * Supprime un utilisateur.
	 * DELETE http://localhost:8080/_ah/api/loseawards/v1/users/6641050231767040
	 * @param idUser
	 */
	@ApiMethod(path = "users/{userId}", httpMethod = HttpMethod.DELETE)
	public void deleteUser(@Named("userId") final Long userId) {
		getPersistenceService().deleteUser(userId);
	}
	
	/**
	 * Met à jour un utilisateur.
	 * PUT http://localhost:8080/_ah/api/loseawards/v1/users/6641050231767040
	 * @param userId
	 * @param userDTO
	 * @return
	 */
	@ApiMethod(path = "users/{userId}", httpMethod = HttpMethod.PUT)
	public UserDTO updateUser(@Named("userId") final Long idUser, final UserDTO userDTO) {
		User user = Converter.fromDTO(userDTO);
		
		// Avatar
		if (userDTO.getAvatar() != null) {
			Avatar avatar = new Avatar();
			avatar.setImage(userDTO.getAvatar());
			getPersistenceService().addAvatar(avatar);
			
			user.setAvatarId(avatar.getId());
			userDTO.setAvatarId(avatar.getId());
			userDTO.setAvatar(null);
		}
		
		getPersistenceService().updateUser(user);
		
		return userDTO;
	}
	
	/**
	 * Retourne le bundle nécessaire à l'affichage de la page des utilisateurs.
	 * http://localhost:8080/_ah/api/loseawards/v1/users/bundle
	 * @return
	 */
	@ApiMethod(path = "users/bundle", httpMethod = HttpMethod.GET)
	public UserBundleDTO getUserBundle() {
		UserBundleDTO userBundleDTO = new UserBundleDTO();
		
		// Récupération de toutes les nominations
		List<Nomination> nominations = getPersistenceService().getNominations();
		
		// Regroupement des nominations par nominés
		Map<Long, List<NominationDTO>> nominationsByUser = new HashMap<Long, List<NominationDTO>>();
		nominations.forEach(nomination -> {
//		for (Nomination nomination : nominations) {
			if (nomination.getUsersIds() != null) {
				nomination.getUsersIdsAsLong().forEach(userId -> {
//				for (Long userId : nomination.getUsersIdsAsList()) {
					List<NominationDTO> nominationsOfOneUser = nominationsByUser.get(userId);
					if (nominationsOfOneUser == null) {
						nominationsOfOneUser = new ArrayList<NominationDTO>();
						nominationsByUser.put(userId, nominationsOfOneUser);
					}
					nominationsOfOneUser.add(new NominationDTO(nomination.getId(), nomination.getUsersIdsAsLong(), nomination.getCategoryId(), nomination.getReason(), nomination.getDate(), nomination.getImageId()));
				});
			}
		});
		
		userBundleDTO.setNominations(nominationsByUser);		
		return userBundleDTO;
	}
}
