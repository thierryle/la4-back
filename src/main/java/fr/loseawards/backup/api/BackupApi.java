package fr.loseawards.backup.api;

import com.google.api.server.spi.config.ApiMethod;
import com.google.api.server.spi.config.Named;
import fr.loseawards.AbstractServiceApi;
import fr.loseawards.backup.dto.*;
import fr.loseawards.model.*;
import fr.loseawards.nomination.api.NominationApi;
import fr.loseawards.nomination.dto.NominationBundleDTO;
import fr.loseawards.nomination.dto.NominationDTO;
import fr.loseawards.persistence.PersistenceService;
import fr.loseawards.user.api.UserApi;
import fr.loseawards.user.dto.UserDTO;
import fr.loseawards.user.dto.UserStringDTO;
import fr.loseawards.util.Util;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;
import java.util.*;
import java.util.stream.Collectors;

public class BackupApi extends AbstractServiceApi {
	protected UserApi userApi = null;
	protected NominationApi nominationApi = null;

	/**
	 * Permet de générer un backup de l'archive (sans les ID) pour pouvoir faire un restore.
	 * GET http://localhost:8080/_ah/api/loseawards/v1/backup/archives
	 * @param year
	 * @return
	 */
	@ApiMethod(path = "backup/archives", httpMethod = ApiMethod.HttpMethod.GET)
	public BackupArchiveWithAwardsDTO backupArchiveWithAwards(@Named("year") final Integer year) {
		BackupArchiveWithAwardsDTO backup = new BackupArchiveWithAwardsDTO();

		List<ArchiveCategory> categories = getPersistenceService().getArchiveCategories();
		List<ArchiveUser> users = getPersistenceService().getArchiveUsers();

		// Partie archive
		Archive archive = getPersistenceService().getArchiveByYear(year);
		if (archive == null) {
			return backup;
		}

		BackupArchiveDTO backupArchiveDTO = new BackupArchiveDTO();
		backupArchiveDTO.setYear(year);

		List<String> categoriesNames = new ArrayList<>();
		for (Long categoryId: archive.getCategoriesIdsAsLong()) {
			ArchiveCategory category = Util.getObjectById(categories, categoryId);
			categoriesNames.add(category.getName());
		}
		backupArchiveDTO.setCategoriesNames(categoriesNames);

		// Partie ranking
		Map<Integer, List<String>> ranking = new HashMap<Integer, List<String>>();
		List<ArchiveRank> archiveRanks = getPersistenceService().getArchiveRanksByYear(year);
		for (ArchiveRank archiveRank : archiveRanks) {
			List<String> usersNames = new ArrayList<>();
			for (Long userId : archiveRank.getUsersIdsAsLong()) {
				usersNames.add(Util.getObjectById(users, userId).getDisplayName());
			}
			ranking.put(archiveRank.getPosition(), usersNames);
		}
		backupArchiveDTO.setRanking(ranking);

		backup.setArchive(backupArchiveDTO);

		// Partie awards
		List<ArchiveAward> archiveAwards = getPersistenceService().getArchiveAwardsByYear(year);

		List<BackupArchiveAwardDTO> backupArchiveAwards = new ArrayList<>();
		for (ArchiveAward archiveAward : archiveAwards) {
			BackupArchiveAwardDTO backupArchiveAwardDTO = new BackupArchiveAwardDTO();
			if (archiveAward.getCategoryId() == null) {
				// Lose awards
				backupArchiveAwardDTO.setCategoryName("");
			} else {
				backupArchiveAwardDTO.setCategoryName(Util.getObjectById(categories, archiveAward.getCategoryIdAsLong()).getName());
			}
			backupArchiveAwardDTO.setReason(archiveAward.getReason());
			backupArchiveAwardDTO.setYear(archiveAward.getYear());

			// Utilisateurs
			List<String> usersNames = new ArrayList<>();
			for (Long userId : archiveAward.getUsersIdsAsLong()) {
				usersNames.add(Util.getObjectById(users, userId).getDisplayName());
			}
			backupArchiveAwardDTO.setUsersNames(usersNames);

			backupArchiveAwards.add(backupArchiveAwardDTO);
		}

		backup.setArchiveAwards(backupArchiveAwards);
		return backup;
	}

	/**
	 * Permet de générer un backup des utilisateurs (sans les ID).
	 * GET http://localhost:8080/_ah/api/loseawards/v1/backup/users
	 * @return
	 */
	@ApiMethod(path = "backup/users", httpMethod = ApiMethod.HttpMethod.GET)
	public List<UserDTO> backupUsersWithAvatars() {
		// Récupération des utilisateurs
		List<UserDTO> usersDTO = getUserApi().getUsers();

		// Récupération des avatars et mise à null des ID
		for (UserDTO userDTO : usersDTO) {
			userDTO.setId(null);
			if (userDTO.getAvatarId() != null) {
				Avatar avatar = getPersistenceService().getAvatar(userDTO.getAvatarId());
				userDTO.setAvatar(avatar.getImage());
				userDTO.setAvatarId(null);
			}
		}

		return usersDTO;
	}

	/**
	 * Permet de générer un backup des utilisateurs avec les avatars en String (sans les ID).
	 * GET http://localhost:8080/_ah/api/loseawards/v1/backup/users/string
	 * @return
	 */
	@ApiMethod(path = "backup/users/string", httpMethod = ApiMethod.HttpMethod.GET)
	public List<UserStringDTO> backupUsersWithAvatarsString() {
		// Récupération des utilisateurs
		List<UserDTO> usersDTO = getUserApi().getUsers();
		return usersDTO.stream().map(userDTO -> {
			UserStringDTO userStringDTO = new UserStringDTO(null, userDTO.getFirstName(), userDTO.getLastName(), userDTO.getEmail(), null, null);
			if (userDTO.getAvatarId() != null) {
				Avatar avatar = getPersistenceService().getAvatar(userDTO.getAvatarId());
				userStringDTO.setAvatar(Base64.getEncoder().encodeToString(avatar.getImage()));
			}
			return userStringDTO;
		}).collect(Collectors.toList());
	}

	/**
	 * Permet de générer un backup des catégories avec les nominations (sans les ID).
	 * GET http://localhost:8080/_ah/api/loseawards/v1/backup/categories
	 * @return
	 */
	@ApiMethod(path = "backup/categories", httpMethod = ApiMethod.HttpMethod.GET)
	public List<BackupCategoryWithNominationsDTO> backupCategoriesWithNominations() {
		 List<BackupCategoryWithNominationsDTO> backup = new ArrayList<>();

		 List<Category> categories = getPersistenceService().getCategories();
		 List<User> users = getPersistenceService().getUsers();

		 NominationBundleDTO bundle = getNominationApi().getNominationBundle();
		 for (Long categoryId : bundle.getNominations().keySet()) {
			 BackupCategoryWithNominationsDTO backupCategory = new BackupCategoryWithNominationsDTO();
			 backupCategory.setName(Util.getObjectById(categories, categoryId).getName());

			 // Nominations
			 List<BackupNominationDTO> backupNominations = new ArrayList<BackupNominationDTO>();
			 List<NominationDTO> nominationsDTO = bundle.getNominations().get(categoryId);

			 for (NominationDTO nominationDTO : nominationsDTO) {
				 BackupNominationDTO backupNomination = new BackupNominationDTO();
				 backupNomination.setDate(nominationDTO.getDate());
				 backupNomination.setReason(nominationDTO.getReason());

				// Utilisateurs
				List<String> usersNames = new ArrayList<String>();
				for (Long userId : nominationDTO.getUsersIds()) {
					usersNames.add(Util.getObjectById(users, userId).getDisplayName());
				}
				backupNomination.setUsersNames(usersNames);
				backupNominations.add(backupNomination);
			 }
			 backupCategory.setNominations(backupNominations);
			 backup.add(backupCategory);
		 }

		return backup;
	}

	/**
	 * Permet de générer un backup des commentaires (sans les ID).
	 * GET http://localhost:8080/_ah/api/loseawards/v1/backup/comments
	 * GET http://localhost:8888/api/backup/comments
	 * @return
	 */
	@ApiMethod(path = "backup/comments", httpMethod = ApiMethod.HttpMethod.GET)
	public List<BackupCommentDTO> backupComments() {
		List<BackupCommentDTO> backup = new ArrayList<>();

		List<Category> categories = getPersistenceService().getCategories();
		List<User> users = getPersistenceService().getUsers();

		List<Comment> comments = getPersistenceService().getComments();
		for (Comment comment : comments) {
			BackupCommentDTO backupComment = new BackupCommentDTO();
			backupComment.setAuthorName(Util.getObjectById(users, comment.getAuthorId()).getDisplayName());
			backupComment.setContent(comment.getContent());
			backupComment.setDate(comment.getDate());

			Nomination nomination = getPersistenceService().getNomination(comment.getNominationId());
			backupComment.setNominationCategoryName(Util.getObjectById(categories, nomination.getCategoryId()).getName());
			backupComment.setNominationReason(nomination.getReason());

			backup.add(backupComment);
		}

		return backup;
	}
	
	protected UserApi getUserApi() {
		if (userApi == null) {
			userApi = new UserApi();
		}
		return userApi;
	}
	
	protected NominationApi getNominationApi() {
		if (nominationApi == null) {
			nominationApi = new NominationApi();
		}
		return nominationApi;
	}
}
