package fr.loseawards.home.api;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import com.google.api.server.spi.config.ApiMethod;
import com.google.api.server.spi.config.ApiMethod.HttpMethod;

import fr.loseawards.AbstractServiceApi;
import fr.loseawards.category.api.CategoryApi;
import fr.loseawards.global.api.GlobalApi;
import fr.loseawards.home.dto.HomeBundleDTO;
import fr.loseawards.model.Category;
import fr.loseawards.model.Comment;
import fr.loseawards.model.Nomination;
import fr.loseawards.model.User;
import fr.loseawards.nomination.api.NominationApi;
import fr.loseawards.nomination.dto.NominationDTO;
import fr.loseawards.user.api.UserApi;
import fr.loseawards.util.Converter;
import fr.loseawards.vote.api.VoteApi;

public class HomeApi extends AbstractServiceApi {
	private static final int NOMINATIONS_NUMBER = 5;
	
	protected UserApi userApi = null;
	protected CategoryApi categoryApi = null;
	protected GlobalApi globalApi = null;
	protected VoteApi voteApi = null;
	protected NominationApi nominationApi = null;
	
	/**
	 * Retourne le bundle nécessaire à la page d'accueil.
	 * GET http://localhost:8080/_ah/api/loseawards/v1/home/bundle
	 * @return
	 */
	@ApiMethod(path = "home/bundle", httpMethod = HttpMethod.GET)
	public HomeBundleDTO getHomeBundle() {
		HomeBundleDTO homeBundleDTO = new HomeBundleDTO();
		
		homeBundleDTO.setUsers(getUserApi().getUsers());
		homeBundleDTO.setCategories(getCategoryApi().getCategories());
		
		// Récupération des nominations
		List<Nomination> nominations = getPersistenceService().getOrderedNominations();
		homeBundleDTO.setTotalNominations(nominations.size());
		
		// Conversion en DTO des 5 dernières nominations
		List<NominationDTO> nominationsDTO = new ArrayList<>();
		for (int i = 0; i < nominations.size() && i < NOMINATIONS_NUMBER; i++) {
			Nomination nomination = nominations.get(i);
			nominationsDTO.add(Converter.toDTO(nomination));
		}
		homeBundleDTO.setNominations(nominationsDTO);
		
		// Statistiques (nombre de nominations par utilisateur)
		final Map<Long, Integer> stats = new HashMap<>();
		for (Nomination nomination: nominations) {
			nomination.getUsersIdsAsLong().forEach(userId -> {
				Integer count = stats.get(userId);
				if (count == null) {
					count = 1;
				} else {
					count = count + 1;
				}
				stats.put(userId, count);
			});
		}
		
		// Tri par nombre de nominations
		List<Long> sortedUsers = new ArrayList<>(stats.keySet());
		Collections.sort(sortedUsers, (u1, u2) -> stats.get(u2).compareTo(stats.get(u1)));
		Map<Long, Integer> sortedStats = new LinkedHashMap<>();
		for (Long userId : sortedUsers) {
			sortedStats.put(userId, stats.get(userId));
		}		
		homeBundleDTO.setStatistiques(sortedStats);
		
		// Variables globales
		homeBundleDTO.setGlobals(getGlobalApi().getGlobals());
		
		return homeBundleDTO;
	}

	/**
	 * Réinitialise le site.
	 * GET http://localhost:8080/_ah/api/loseawards/v1/home/reset
	 */
	@ApiMethod(path = "home/reset", httpMethod = HttpMethod.DELETE)
	public void reset() {
		getVoteApi().deleteVotes();
		getNominationApi().deleteNominations();
		getCategoryApi().deleteCategories();
	}
	
	/**
	 * Nettoie la base de données.
	 * GET http://localhost:8080/_ah/api/loseawards/v1/home/clean
	 */
	@ApiMethod(path = "home/clean", httpMethod = HttpMethod.GET)
	public void clean() {
		// Récupération des catégories et extraction des ID
		List<Category> categories = getPersistenceService().getCategories();
		List<Long> categoriesIds = categories.stream().map(category -> category.getId()).collect(Collectors.toList());

		// Récupération des utilisateurs et extraction des ID
		List<User> users = getPersistenceService().getUsers();
		List<Long> usersIds = users.stream().map(user -> user.getId()).collect(Collectors.toList());

		// Récupération des nominations et vérification que la catégorie et les utilisateurs existent toujours
		List<Nomination> nominations = getPersistenceService().getNominations();
		List<Long> nominationsIds = new ArrayList<>();
		for (Nomination nomination : nominations) {
			if (nomination.getCategoryId() == null || nomination.getUsersIds() == null || !categoriesIds.contains(nomination.getCategoryId())) {
				getPersistenceService().deleteNomination(nomination.getId());
			} else {
				boolean deleted = false;
				for (Long userId : nomination.getUsersIdsAsLong()) {
					if (!usersIds.contains(userId)) {
						getPersistenceService().deleteNomination(nomination.getId());
						deleted = true;
						break;
					}
				}
				if (!deleted) {
					nominationsIds.add(nomination.getId());
				}
			}
		}

		// Récupération des commentaires et vérification que la nomination et l'utilisateur existent toujours
		List<Comment> comments = getPersistenceService().getComments();
		comments.stream().filter(comment -> comment.getAuthorId() == null || comment.getNominationId() == null || !usersIds.contains(comment.getAuthorId()) || !nominationsIds.contains(comment.getNominationId())).forEach(comment -> {
			getPersistenceService().deleteComment(comment.getId());
		});
	}
		
	protected UserApi getUserApi() {
		if (userApi == null) {
			userApi = new UserApi();
		}
		return userApi;
	}
	
	protected CategoryApi getCategoryApi() {
		if (categoryApi == null) {
			categoryApi = new CategoryApi();
		}
		return categoryApi;
	}	
	
	protected GlobalApi getGlobalApi() {
		if (globalApi == null) {
			globalApi = new GlobalApi();
		}
		return globalApi;
	}
	
	protected VoteApi getVoteApi() {
		if (voteApi == null) {
			voteApi = new VoteApi();
		}
		return voteApi;
	}
	
	protected NominationApi getNominationApi() {
		if (nominationApi == null) {
			nominationApi = new NominationApi();
		}
		return nominationApi;
	}
}
