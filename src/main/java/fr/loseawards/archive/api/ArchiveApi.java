package fr.loseawards.archive.api;

import com.google.api.server.spi.config.ApiMethod;
import com.google.api.server.spi.config.Named;
import fr.loseawards.AbstractServiceApi;
import fr.loseawards.archive.dto.ArchiveBundleDTO;
import fr.loseawards.archive.dto.ArchiveDTO;
import fr.loseawards.archive.dto.ArchiveWithAwardsAndReportDTO;
import fr.loseawards.archive.dto.CategoriesLinksDTO;
import fr.loseawards.archiveaward.api.ArchiveAwardApi;
import fr.loseawards.archiveaward.dto.ArchiveAwardBundleDTO;
import fr.loseawards.archiveaward.dto.ArchiveAwardDTO;
import fr.loseawards.archivecategory.api.ArchiveCategoryApi;
import fr.loseawards.archivereport.api.ArchiveReportApi;
import fr.loseawards.archivereport.dto.ArchiveReportDTO;
import fr.loseawards.archiveuser.api.ArchiveUserApi;
import fr.loseawards.decision.api.DecisionApi;
import fr.loseawards.model.*;
import fr.loseawards.util.Converter;
import fr.loseawards.util.Util;
import fr.loseawards.vote.api.VoteApi;
import fr.loseawards.vote.dto.VoteDTO;
import fr.loseawards.vote.dto.VoteResultDTO;
import org.apache.commons.text.similarity.LevenshteinDistance;

import java.util.*;
import java.util.logging.Logger;

public class ArchiveApi extends AbstractServiceApi {
	private final Logger log = Logger.getLogger(ArchiveApi.class.getName());

	protected ArchiveUserApi archiveUserApi = null;
	protected ArchiveCategoryApi archiveCategoryApi = null;
	protected ArchiveAwardApi archiveAwardApi = null;
	protected ArchiveReportApi archiveReportApi = null;
	protected VoteApi voteApi = null;

	/**
	 * Retourne une archive.
	 * GET http://localhost:8080/_ah/api/loseawards/v1/archives/6641050231767040
	 * @param archiveId
	 * @return
	 */
	@ApiMethod(path = "archives/{archiveId}", httpMethod = ApiMethod.HttpMethod.GET)
	public ArchiveDTO getArchive(@Named("archiveId") final Long archiveId) {
		Archive archive = getPersistenceService().getArchive(archiveId);
		if (archive == null) {
			return null;
		}
		List<ArchiveRank> archiveRanks = getPersistenceService().getArchiveRanksByYear(archive.getYear());		
		return Converter.toDTO(archive, archiveRanks);
	}

	/**
	 * Retourne le bundle des archives.
	 * GET http://localhost:8080/_ah/api/loseawards/v1/archives/bundle
	 * @return
	 */
	@ApiMethod(path = "archives/bundle", httpMethod = ApiMethod.HttpMethod.GET)
	public ArchiveBundleDTO getArchiveBundle() {
		ArchiveBundleDTO archiveBundleDTO = new ArchiveBundleDTO();
		
		List<Archive> archives = getPersistenceService().getArchives();
		List<ArchiveRank> archiveRanks = getPersistenceService().getArchiveRanks();
		
		// Conversion en DTO
		List<ArchiveDTO> archivesDTO = Converter.toArchivesDTO(archives, archiveRanks);
		archiveBundleDTO.setArchives(archivesDTO);
		
		archiveBundleDTO.setArchiveUsers(getArchiveUserApi().getArchiveUsers());
		archiveBundleDTO.setArchiveCategories(getArchiveCategoryApi().getArchiveCategories().getArchiveCategories());
		
		// Grands Losers par année
		Map<Integer, List<Long>> losersByYear = new HashMap<>();
		List<ArchiveAward> archiveAwards = getPersistenceService().getArchiveAwardsByCategory(null);
//		List<ArchiveAward> archiveAwards = getPersistenceService().getArchiveAwards();
		for (ArchiveAward archiveAward : archiveAwards) {
			losersByYear.put(archiveAward.getYear(), archiveAward.getUsersIdsAsLong());
		}
		archiveBundleDTO.setLosersByYear(losersByYear);
		
		return archiveBundleDTO;
	}

	/**
	 * Crée une archive.
	 * POST http://localhost:8080/_ah/api/loseawards/v1/archives
	 * @param archiveDTO
	 * @return
	 */
	@ApiMethod(path = "archives", httpMethod = ApiMethod.HttpMethod.POST)
	public ArchiveDTO createArchive(final ArchiveDTO archiveDTO) {
		Archive archive = Converter.fromDTO(archiveDTO);
		List<ArchiveRank> archiveRanks = Converter.fromDTO(archiveDTO.getRanking(), archiveDTO.getYear());
		getPersistenceService().addArchive(archive);
		
		// Ranking
		//getPersistenceService().deleteArchiveRanksOfYear(archiveDTO.getYear());
		if (archiveRanks != null) {
			archiveRanks.forEach(archiveRank -> {
				getPersistenceService().addArchiveRank(archiveRank);
			});
		}
		
		archiveDTO.setId(archive.getId());
		return archiveDTO;
	}
	
	/**
	 * Fait le lien entre les catégories actuelles et les catégories archive.
	 * GET http://localhost:8080/_ah/api/loseawards/v1/archives/categoriesLinks
	 * @return
	 */
	@ApiMethod(path = "archives/categoriesLinks", httpMethod = ApiMethod.HttpMethod.GET)
	public CategoriesLinksDTO linkCategories() {
		CategoriesLinksDTO categoriesLinksDTO = new CategoriesLinksDTO();
		categoriesLinksDTO.setArchiveCategories(getArchiveCategoryApi().getArchiveCategories().getArchiveCategories());
		
		Map<Long, Long> links = new HashMap<Long, Long>();
		List<Category> categories = getPersistenceService().getCategories();
		List<ArchiveCategory> archiveCategories = getPersistenceService().getArchiveCategories();
		
		// On tente de faire un rapprochement entre les catégories actuelles et les catégories archive
		categories.forEach(category -> {
			ArchiveCategory archiveCategory = findArchiveCategory(category, archiveCategories);
			if (archiveCategory != null) {
				links.put(category.getId(), archiveCategory.getId());
			} else {
				links.put(category.getId(), -1L);
			}
		});
		categoriesLinksDTO.setLinks(links);
		
		return categoriesLinksDTO;
	}
	
	/**
	 * Crée une archive à partir des résultats de vote et des liens entre les catégories précisés par l'utilisateur.
	 * POST http://localhost:8080/_ah/api/loseawards/v1/archives/fromVoteResult
	 * @param categoriesLinksDTO
	 */
	@ApiMethod(path = "archives/fromVoteResult", httpMethod = ApiMethod.HttpMethod.POST)
	public void createArchiveFromVoteResult(final CategoriesLinksDTO categoriesLinksDTO) {
		ArchiveWithAwardsAndReportDTO archiveWithAwardsAndReportDTO = new ArchiveWithAwardsAndReportDTO();
		
		// De même qu'on a des liens entre les catégories, il faut faire les liens entre les utilisateurs courants et les utilisateurs archive
		Map<Long, Long> usersLinks = new HashMap<Long, Long>();
		List<User> users = getPersistenceService().getUsers();
		List<ArchiveUser> archiveUsers = getPersistenceService().getArchiveUsers();
		users.forEach(user -> {
			boolean found = false;
			// On fait d'abord un rapprochement avec le displayName
			for (ArchiveUser archiveUser : archiveUsers) {
				if (archiveUser.getDisplayName().equals(user.getDisplayName())) {
					usersLinks.put(user.getId(), archiveUser.getId());
					found = true;
					break;
				}
			}
			if (!found) {
				// Sinon, on fait le rapprochement sur le firstName
				for (ArchiveUser archiveUser : archiveUsers) {
					if (archiveUser.getFirstName().equals(user.getFirstName())) {
						usersLinks.put(user.getId(), archiveUser.getId());
						found = true;
						break;
					}
				}
			}
			if (!found) {
				// Problème
				throw new IllegalArgumentException("Utilisateur " + user.getDisplayName() + " non-trouvé");
			}
		});
		
		// Récupération des résultats de vote
		VoteResultDTO voteResultDTO = getVoteApi().getVoteResult();
		
		// ===== Création de l'archive =====
		
		ArchiveDTO archiveDTO = new ArchiveDTO();
		archiveDTO.setYear(categoriesLinksDTO.getYear());
		
		// Conversion des catégories en catégories archive 
		final Map<Long, ArchiveCategory> archiveCategoriesById = new HashMap<>();
		for (Long categoryId : categoriesLinksDTO.getLinks().keySet()) {
			Long linkedArchiveCategoryId = categoriesLinksDTO.getLinks().get(categoryId);
			if (linkedArchiveCategoryId == -1L) {
				// L'utilisateur n'a fait aucun lien : il s'agit d'une nouvelle catégorie à créer
				Category category = getPersistenceService().getCategory(categoryId);
				ArchiveCategory newArchiveCategory = new ArchiveCategory(null, category.getName());
				getPersistenceService().addArchiveCategory(newArchiveCategory);
				
				// On range la nouvelle catégorie archive dans les liens et dans la map de classement
				linkedArchiveCategoryId = newArchiveCategory.getId();
				categoriesLinksDTO.getLinks().put(categoryId, linkedArchiveCategoryId);
				archiveCategoriesById.put(linkedArchiveCategoryId, newArchiveCategory);
			} else {
				ArchiveCategory archiveCategory = getPersistenceService().getArchiveCategory(linkedArchiveCategoryId);
				archiveCategoriesById.put(linkedArchiveCategoryId, archiveCategory);
			}
		}
		
		// Tri par ordre alphabétique
		List<Long> sortedArchiveCategoriesIds = new ArrayList<>(archiveCategoriesById.keySet());
		Collections.sort(sortedArchiveCategoriesIds, (o1, o2) -> {
			ArchiveCategory archiveCategory1 = archiveCategoriesById.get(o1);
			ArchiveCategory archiveCategory2 = archiveCategoriesById.get(o2);
			return archiveCategory1.getName().compareTo(archiveCategory2.getName());
		});
		
		archiveDTO.setCategoriesIds(sortedArchiveCategoriesIds);
		
		// Ranking
		Map<Integer, List<Long>> archiveRanking = new HashMap<>();
		for (Integer rank : voteResultDTO.getRanking().keySet()) {
			// Conversion des ID des utilisateurs en ID des utilisateurs archive
			List<Long> usersIds = voteResultDTO.getRanking().get(rank);
			archiveRanking.put(rank, usersIdsToArchiveUsersIds(usersIds, usersLinks));
		}
		archiveDTO.setRanking(archiveRanking);
		
		archiveWithAwardsAndReportDTO.setArchive(archiveDTO);
		
		// ===== Récompenses =====
		
		List<Nomination> nominations = getPersistenceService().getNominations();
		List<ArchiveAwardDTO> archiveAwardsDTO = new ArrayList<>();
		
		for (Long categoryId : voteResultDTO.getWinnersByCategory().keySet()) {
			Long archiveCategoryId = categoriesLinksDTO.getLinks().get(categoryId);
			List<Long> winners = voteResultDTO.getWinnersByCategory().get(categoryId);
			List<Long> archiveUsersIds = null;
			String reason = null;
			
			if (winners.size() == 1) {
				// Un seul vainqueur
				archiveUsersIds = usersIdsToArchiveUsersIds(winners, usersLinks);
				reason = getReason(winners, voteResultDTO.getVotesByCategory().get(categoryId), nominations);
			} else if (winners.size() > 1) {
				// Plusieurs vainqueurs : y a-t-il une décision du président ?
				Long decision = voteResultDTO.getDecisionsByCategory().get(categoryId);
				if (decision == null || decision == -2L) {
					// Pas de décision, ou alors tous : dans les deux cas, on les prend tous
					archiveUsersIds = usersIdsToArchiveUsersIds(winners, usersLinks);
					reason = getReason(winners, voteResultDTO.getVotesByCategory().get(categoryId), nominations);
				} else {
					// Un seul vainqueur
					List<Long> oneWinner = Arrays.asList(decision);
					archiveUsersIds = usersIdsToArchiveUsersIds(oneWinner, usersLinks);
					reason = getReason(oneWinner, voteResultDTO.getVotesByCategory().get(categoryId), nominations);
				}
			}			
			ArchiveAwardDTO archiveAwardDTO = new ArchiveAwardDTO(null, categoriesLinksDTO.getYear(), archiveCategoryId, archiveUsersIds, reason);
			archiveAwardsDTO.add(archiveAwardDTO);
		}
		
		// Lose award
		List<Long> losers = archiveRanking.get(1);
		archiveAwardsDTO.add(new ArchiveAwardDTO(null, categoriesLinksDTO.getYear(), null, losers, null));
		
		archiveWithAwardsAndReportDTO.setArchiveAwards(archiveAwardsDTO);
		
		// ===== Rapport =====
		
		ArchiveReportDTO archiveReportDTO = new ArchiveReportDTO(null, categoriesLinksDTO.getYear(), "", Converter.stringToBlob(""), "", Converter.stringToBlob(""));
		archiveWithAwardsAndReportDTO.setArchiveReport(archiveReportDTO);
		
		createArchiveWithAwardsAndReport(archiveWithAwardsAndReportDTO);
	}
	
	/**
	 * On cherche la raison pour laquelle, dans une catégorie donnée, le ou les vainqueurs ont gagné.
	 * Il s'agit donc de rechercher les nominations qui les concerne et pour lesquelles il y a eu des votes, puis regarder quelle nomination est dominante.
	 * @param winners
	 * @param votesDTO
	 * @param nominations
	 * @return
	 */
	protected String getReason(final List<Long> winners, final List<VoteDTO> votesDTO, final List<Nomination> nominations) {
		List<Long> nominationsIds = new ArrayList<>();

		// On recherche toutes les nominations liées aux votes, concernant les vainqueurs (utilisateurs en paramètre)
		votesDTO.stream().filter(voteDTO -> voteDTO.getNominationId() != null).forEach(voteDTO -> {
			// On récupère la nomination concernée pour avoir les utilisateurs
			Nomination nomination = Util.getObjectById(nominations, voteDTO.getNominationId());

			// Les nominations doivent contenir tous les vainqueurs
			boolean containsAll = winners.stream().allMatch(userId -> nomination.getUsersIdsAsLong().contains(userId));
			if (containsAll) {
				nominationsIds.add(nomination.getId());
			}
		});

		if (nominationsIds.isEmpty()) {
			return "";
		}
		
		// S'il y a plusieurs nominations qui ressortent, on prend la première
		Long nominationId = Util.getMostRecurrentElements(nominationsIds, null).get(0);
		return Util.getObjectById(nominations, nominationId).getReason();
	}
	
	protected List<Long> usersIdsToArchiveUsersIds(final List<Long> usersIds, final Map<Long, Long> links) {
		List<Long> archiveUsersIds = new ArrayList<>();
		usersIds.forEach(userId-> {
			archiveUsersIds.add(links.get(userId));
		});
		return archiveUsersIds;
	}
	
	protected ArchiveCategory findArchiveCategory(final Category category, final List<ArchiveCategory> archiveCategories) {
		for (ArchiveCategory archiveCategory : archiveCategories) {
			int distance = LevenshteinDistance.getDefaultInstance().apply(category.getName(), archiveCategory.getName());
			if (distance <= 2) {
				return archiveCategory;
			}
		}
		return null;
	}

	/**
	 * Supprime une archive.
	 * DELETE http://localhost:8080/_ah/api/loseawards/v1/archives/6641050231767040
	 * @param archiveId
	 */
	@ApiMethod(path = "archives/{archiveId}", httpMethod = ApiMethod.HttpMethod.DELETE)
	public void deleteArchive(@Named("archiveId") final Long archiveId) {
		getPersistenceService().deleteArchive(archiveId);
	}
	
	/**
	 * Crée une archive avec ses récompenses.
	 * POST http://localhost:8080/_ah/api/loseawards/v1/archives/awards
	 * @param archiveWithAwardsDTO
	 */
	@ApiMethod(path = "archives/{awards}", httpMethod = ApiMethod.HttpMethod.POST)
	public void createArchiveWithAwardsAndReport(final ArchiveWithAwardsAndReportDTO archiveWithAwardsDTO) {
		createArchive(archiveWithAwardsDTO.getArchive());
		getArchiveAwardApi().createArchiveAwards(new ArchiveAwardBundleDTO(archiveWithAwardsDTO.getArchiveAwards()));
		getArchiveReportApi().createArchiveReport(archiveWithAwardsDTO.getArchiveReport());
	}
	
	/**
	 * Met à jour une archive avec ses récompenses.
	 * PUT http://localhost:8080/_ah/api/loseawards/v1/archives/awards/4822457999425536
	 * @param archiveId
	 * @param archiveWithAwardsDTO
	 */
	@ApiMethod(path = "archives/awards/{archiveId}", httpMethod = ApiMethod.HttpMethod.PUT)
	public void updateArchiveWithAwardsAndReport(@Named("archiveId") final Long archiveId, final ArchiveWithAwardsAndReportDTO archiveWithAwardsDTO) {
		Archive archive = Converter.fromDTO(archiveWithAwardsDTO.getArchive());
		getPersistenceService().updateArchive(archive);
		
		// Suppression des récompenses, rangs et rapport précédents
		getPersistenceService().deleteArchiveAwardsOfYear(archive.getYear());
		getPersistenceService().deleteArchiveRanksOfYear(archive.getYear());
		getPersistenceService().deleteArchiveReportOfYear(archive.getYear());
		
		// Ajout des récompenses, rangs et rapport
		getArchiveAwardApi().createArchiveAwards(new ArchiveAwardBundleDTO(archiveWithAwardsDTO.getArchiveAwards()));
		List<ArchiveRank> archiveRanks = Converter.fromDTO(archiveWithAwardsDTO.getArchive().getRanking(), archive.getYear());
		if (archiveRanks != null) {
			archiveRanks.forEach(archiveRank -> {
				getPersistenceService().addArchiveRank(archiveRank);
			});
		}
		getArchiveReportApi().createArchiveReport(archiveWithAwardsDTO.getArchiveReport());
	}
		
	protected ArchiveUserApi getArchiveUserApi() {
		if (archiveUserApi == null) {
			archiveUserApi = new ArchiveUserApi();
		}
		return archiveUserApi;
	}
	
	protected ArchiveCategoryApi getArchiveCategoryApi() {
		if (archiveCategoryApi == null) {
			archiveCategoryApi = new ArchiveCategoryApi();
		}
		return archiveCategoryApi;
	}
	
	protected ArchiveAwardApi getArchiveAwardApi() {
		if (archiveAwardApi == null) {
			archiveAwardApi = new ArchiveAwardApi();
		}
		return archiveAwardApi;
	}
	
	protected ArchiveReportApi getArchiveReportApi() {
		if (archiveReportApi == null) {
			archiveReportApi = new ArchiveReportApi();
		}
		return archiveReportApi;
	}

	protected VoteApi getVoteApi() {
		if (voteApi == null) {
			voteApi = new VoteApi();
		}
		return voteApi;
	}
}
