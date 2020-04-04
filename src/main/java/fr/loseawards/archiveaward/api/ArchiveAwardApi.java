package fr.loseawards.archiveaward.api;

import com.google.api.server.spi.config.ApiMethod;
import com.google.api.server.spi.config.Named;
import com.google.api.server.spi.config.Nullable;
import fr.loseawards.AbstractServiceApi;
import fr.loseawards.archiveaward.dto.*;
import fr.loseawards.model.*;
import fr.loseawards.util.Converter;
import fr.loseawards.util.Util;

import java.util.*;

public class ArchiveAwardApi extends AbstractServiceApi {
	/**
	 * Retourne une récompense.
	 * GET http://localhost:8080/_ah/api/loseawards/v1/archiveawards/6641050231767040
	 * @param archiveAwardId
	 * @return
	 */
	@ApiMethod(path = "archiveawards/archiveAwardId", httpMethod = ApiMethod.HttpMethod.GET)
	public ArchiveAwardDTO getArchiveAward(@Named("archiveAwardId") final Long archiveAwardId) {
		ArchiveAward archiveAward = getPersistenceService().getArchiveAward(archiveAwardId);
		if (archiveAward == null) {
			return null;
		}
		return Converter.toDTO(archiveAward);
	}

	/**
	 * Retourne les récompenses par année.
	 * GET http://localhost:8080/_ah/api/loseawards/v1/archiveawards?year=2009
	 * @param year
	 * @return
	 */
	@ApiMethod(path = "archiveawards", httpMethod = ApiMethod.HttpMethod.GET)
	public List<ArchiveAwardDTO> getArchiveAwards(@Named("year") @Nullable final Integer year) {
		List<ArchiveAward> archiveAwards;
		if (year == null) {
			archiveAwards = getPersistenceService().getArchiveAwards();
		} else {
			archiveAwards = getPersistenceService().getArchiveAwardsByYear(year);
		}

		// Conversion en DTO
		return Converter.toArchiveAwardsDTO(archiveAwards);
	}

	/**
	 * Retourne les récompenses et le rapport pour une année.
	 * GET http://localhost:8080/_ah/api/loseawards/v1/archiveawards/report?year=2009
	 * @param year
	 * @return
	 */
	@ApiMethod(path = "archiveawards/report", httpMethod = ApiMethod.HttpMethod.GET)
	public ArchiveAwardsAndReportDTO getArchiveAwardsAndReport(@Named("year") final Integer year) {
		ArchiveAwardsAndReportDTO bundle = new ArchiveAwardsAndReportDTO();
		
		List<ArchiveAward> archiveAwards = getPersistenceService().getArchiveAwardsByYear(year);
		bundle.setArchiveAwards(Converter.toArchiveAwardsDTO(archiveAwards));
		
		ArchiveReport archiveReport = getPersistenceService().getArchiveReportOfYear(year);
		if (archiveReport != null) {
			bundle.setArchiveReport(Converter.toDTO(archiveReport));
		}		

		return bundle;
	}

	/**
	 * Supprime une récompense.
	 * DELETE http://localhost:8080/_ah/api/loseawards/v1/archiveawards/6641050231767040
	 * @param archiveAwardId
	 * @return
	 */
	@ApiMethod(path = "archiveawards/{archiveAwardId}", httpMethod = ApiMethod.HttpMethod.DELETE)
	public void deleteArchiveAward(@Named("archiveAwardId") final Long archiveAwardId) {
		getPersistenceService().deleteArchiveAward(archiveAwardId);
	}
	
	/**
	 * Supprime toutes les récompenses.
	 * DELETE http://localhost:8080/_ah/api/loseawards/v1/archiveawards
	 * @return
	 */
	@ApiMethod(path = "archiveawards", httpMethod = ApiMethod.HttpMethod.DELETE)
	public void deleteArchiveAwards() {
		getPersistenceService().deleteArchiveAwards();
	}
	
	/**
	 * Crée une liste de récompenses (pour une même année) en supprimant les récompenses précédentes de la même année.
	 * POST http://localhost:8080/_ah/api/loseawards/v1/archiveawards/bulk
	 * @param archiveAwardBundleDTO
	 */
	@ApiMethod(path = "archiveawards/bulk", httpMethod = ApiMethod.HttpMethod.POST)
	public void createArchiveAwards(ArchiveAwardBundleDTO archiveAwardBundleDTO) {
		List<ArchiveAwardDTO> archiveAwards = archiveAwardBundleDTO.getArchiveAwards();
		if (archiveAwards != null && !archiveAwards.isEmpty()) {
			// Suppression des récompenses précédentes de cette année
			getPersistenceService().deleteArchiveAwardsOfYear(archiveAwards.get(0).getYear());

			archiveAwards.forEach(archiveAwardDTO -> {
				getPersistenceService().addArchiveAward(Converter.fromDTO(archiveAwardDTO));
			});
		}
	}
	
	/**
	 * Récupère les stats pour une catégorie.
	 * GET http://localhost:8080/_ah/api/loseawards/v1/archiveawards/statcategory?categoryId=5704266324901888
	 * @param categoryId
	 * @return
	 */
	@ApiMethod(path = "archiveawards/statcategory", httpMethod = ApiMethod.HttpMethod.GET)
	public StatCategoryDTO getStatCategory(@Named("categoryId") @Nullable Long categoryId) {
		StatCategoryDTO statCategoryDTO = new StatCategoryDTO();
		List<Integer> appearingYears = new ArrayList<>();
		
		int total = 0;
		final Map<Long, List<Integer>> awardsByUser = new HashMap<>(); // Années de victoire par utilisateur
		List<ArchiveAward> archiveAwards = getPersistenceService().getArchiveAwardsByCategory(categoryId);
		for (ArchiveAward archiveAward : archiveAwards) {
			if (archiveAward.getUsersIds() != null) {
				for (Long userId: archiveAward.getUsersIdsAsLong()) {
					List<Integer> years = awardsByUser.get(userId);
					if (years == null) {
						years = new ArrayList<>();
						awardsByUser.put(userId, years);
					}
					years.add(archiveAward.getYear());
					total++;
				}
				if (!appearingYears.contains(archiveAward.getYear())) {
					appearingYears.add(archiveAward.getYear());
				}				
			}
		}
		
		// Ordonnancement des années
		Comparator<Integer> comparator = (o1, o2) -> o1.compareTo(o2);
		
		Collections.sort(appearingYears, comparator);
		statCategoryDTO.setAppearingYears(appearingYears);
		
		for (Long userId: awardsByUser.keySet()) {
			List<Integer> years = awardsByUser.get(userId);
			Collections.sort(years, comparator);
		}
		
		// Ordonnancement des utilisateurs
		List<Long> sortedUsers = new ArrayList<>(awardsByUser.keySet());
		Collections.sort(sortedUsers, (u1, u2) -> {
			int nb1 = awardsByUser.get(u2).size();
			int nb2 = awardsByUser.get(u1).size();
			return Integer.compare(nb1, nb2);
		});
		Map<Long, List<Integer>> sortedAwardsByUser = new LinkedHashMap<Long, List<Integer>>();
		for (Long userId : sortedUsers) {
			sortedAwardsByUser.put(userId, awardsByUser.get(userId));
		}
		statCategoryDTO.setAwardsByUser(sortedAwardsByUser);
		
		// Statistiques
		List<ArchiveUser> users = getPersistenceService().getArchiveUsers();
		List<GraphicsDatumDTO> graphicsData = new ArrayList<>();
		for (Long userId: sortedAwardsByUser.keySet()) {
			graphicsData.add(new GraphicsDatumDTO(Util.getObjectById(users, userId).getDisplayName(), ((double) awardsByUser.get(userId).size()) / ((double) total) * 100D));
		}
		statCategoryDTO.setGraphicsData(graphicsData);
		
		return statCategoryDTO;
	}

	/**
	 * Récupère les records par catégorie.
	 * GET http://localhost:8080/_ah/api/loseawards/v1/archiveawards/statrecords
	 * @return
	 */
	@ApiMethod(path = "archiveawards/statrecords", httpMethod = ApiMethod.HttpMethod.GET)
	public UserAndRecordBundleDTO getStatRecords() {
		UserAndRecordBundleDTO userAndRecordBundleDTO = new UserAndRecordBundleDTO();

		// Pour chaque catégorie, nombre de victoires par utilisateur
		Map<Long, Map<Long, Integer>> recordsByCategory = new HashMap<>();
		List<ArchiveAward> archiveAwards = getPersistenceService().getArchiveAwards();
		for (ArchiveAward archiveAward : archiveAwards) {
			Long categoryId = archiveAward.getCategoryIdAsLong();
			if (categoryId == null) {
				categoryId = -1L;
			}
			Map<Long, Integer> recordsOfOneCategory = recordsByCategory.computeIfAbsent(categoryId, k -> new HashMap<>());
			if (archiveAward.getUsersIdsAsLong() != null) {
				for (Long userId: archiveAward.getUsersIdsAsLong()) {
					Integer nbAwardsOfOneUser = recordsOfOneCategory.get(userId);
					if (nbAwardsOfOneUser == null) {
						recordsOfOneCategory.put(userId, 1);
					} else {
						recordsOfOneCategory.put(userId, nbAwardsOfOneUser + 1);
					}
				}
			}
		}

		// Records pour chaque catégorie
		Map<Long, List<UserAndRecordDTO>> usersRecordsByCategory = new HashMap<>();
		for (Long categoryId : recordsByCategory.keySet()) {
			Map<Long, Integer> recordsOfOneCategory = recordsByCategory.get(categoryId);

			// On cherche le record
			int record = 0;
			for (Long userId : recordsOfOneCategory.keySet()) {
				Integer nbAwards = recordsOfOneCategory.get(userId);
				if (nbAwards > record) {
					record = nbAwards;
				}
			}

			// On cherche les utilisateurs qui ont ce record
			for (Long userId : recordsOfOneCategory.keySet()) {
				Integer nbAwards = recordsOfOneCategory.get(userId);
				if (nbAwards == record) {
					List<UserAndRecordDTO> usersAndRecords = usersRecordsByCategory.computeIfAbsent(categoryId, k -> new ArrayList<>());
					usersAndRecords.add(new UserAndRecordDTO(userId, nbAwards));
				}
			}
		}

		// Ordonnancement des utilisateurs
		final List<ArchiveCategory> categories = getPersistenceService().getArchiveCategories();
		List<Long> sortedCategories = new ArrayList<Long>(usersRecordsByCategory.keySet());
		Collections.sort(sortedCategories, (id1, id2) -> {
			if (id1.equals(-1L)) {
				return -1;
			}
			if (id2.equals(-1L)) {
				return 1;
			}
			ArchiveCategory category1 = Util.getObjectById(categories, id1);
			ArchiveCategory category2 = Util.getObjectById(categories, id2);
			return (category1.getName().compareTo(category2.getName()));
		});
		Map<Long, List<UserAndRecordDTO>> sortedUsersRecordsByCategory = new LinkedHashMap<>();
		for (Long categoryId : sortedCategories) {
			sortedUsersRecordsByCategory.put(categoryId, usersRecordsByCategory.get(categoryId));
		}

		userAndRecordBundleDTO.setUsersAndRecords(sortedUsersRecordsByCategory);
		return userAndRecordBundleDTO;
	}

	/**
	 * Récupère les stats pour un utilisateur
	 * GET http://localhost:8080/_ah/api/loseawards/v1/archiveawards/statuser?userId=6619059999211520
	 * @param userId
	 * @return
	 */
	@ApiMethod(path = "archiveawards/statuser", httpMethod = ApiMethod.HttpMethod.GET)
	public StatUserDTO getStatUser(@Named("userId") final Long userId) {
		StatUserDTO statUserDTO = new StatUserDTO();
		
		int total = 0;
		final Map<Long, List<Integer>> awardsByCategory = new HashMap<>(); // Listes des années de récompense par catégorie
		final Map<Integer, Integer> nbAwardsByYear = new HashMap<>(); // Nombre de récompenses par année
		List<ArchiveAward> archiveAwards = getPersistenceService().getArchiveAwardsByUser(userId);
		for (ArchiveAward archiveAward : archiveAwards) {
			Long categoryId = archiveAward.getCategoryIdAsLong();
			if (categoryId == null) {
				categoryId = -1L;
			} else {
				total++;
			}
			// Liste des années pour la catégorie courante
			List<Integer> years = awardsByCategory.computeIfAbsent(categoryId, k -> new ArrayList<>());
			years.add(archiveAward.getYear());
			
			// Nombre de récompenses pour l'année courante
			if (categoryId != -1L) {
				Integer nbAwards = nbAwardsByYear.get(archiveAward.getYear());
				if (nbAwards == null) {
					nbAwardsByYear.put(archiveAward.getYear(), 1);
				} else {
					nbAwardsByYear.put(archiveAward.getYear(), nbAwards + 1);
				}
			}
		}
		
		// Ordonnancement des années
		for (Long categoryId : awardsByCategory.keySet()) {
			List<Integer> years = awardsByCategory.get(categoryId);
			Collections.sort(years, (o1, o2) -> o1.compareTo(o2));
		}
		
		// Ordonnancement des catégories
		List<Long> sortedCategories = new ArrayList<>(awardsByCategory.keySet());
		Collections.sort(sortedCategories, (u1, u2) -> {
			int nb1 = awardsByCategory.get(u2).size();
			int nb2 = awardsByCategory.get(u1).size();
			return Integer.compare(nb1, nb2);
		});
		Map<Long, List<Integer>> sortedAwardsByCategory = new LinkedHashMap<>();
		for (Long categoryId : sortedCategories) {
			sortedAwardsByCategory.put(categoryId, awardsByCategory.get(categoryId));
		}
		statUserDTO.setAwardsByCategory(sortedAwardsByCategory);		
		
		// Statistiques
		List<ArchiveCategory> categories = getPersistenceService().getArchiveCategories();
		List<GraphicsDatumDTO> graphicsData = new ArrayList<>();
		for (Long categoryId: sortedAwardsByCategory.keySet()) {
			if (categoryId != -1) {
				graphicsData.add(new GraphicsDatumDTO(Util.getObjectById(categories, categoryId).getName(), ((double) awardsByCategory.get(categoryId).size()) / ((double) total) * 100D));
			}			
		}
		statUserDTO.setGraphicsData(graphicsData);
		
		// Statistiques de progression
		ArchiveUser archiveUser = getPersistenceService().getArchiveUser(userId);
		ProgressionGraphicsDataDTO progression = new ProgressionGraphicsDataDTO();
		List<Integer> nbAwards = new ArrayList<>();
		List<Integer> years = new ArrayList<>();
		List<Integer> ranks = new ArrayList<>();
		List<ArchiveRank> archiveRanks = getPersistenceService().getArchiveRanksByUser(userId);
		
		for (ArchiveRank archiveRank : archiveRanks) {
			Integer year = archiveRank.getYear();
			if ((archiveUser.getFirstYear() == null || year >= archiveUser.getFirstYear()) && (archiveUser.getLastYear() == null || year <= archiveUser.getLastYear())) {
				years.add(year);
				
				// Nombre de récompenses
				Integer nbAwardsOfCurrentYear = nbAwardsByYear.get(year);
				if (nbAwardsOfCurrentYear == null) {
					nbAwards.add(0);
				} else {
					nbAwards.add(nbAwardsOfCurrentYear);
				}
				
				// Classement
				ranks.add(getRankByYear(year, archiveRanks));
			}
		}
		progression.setYears(years);
		progression.setNbAwards(nbAwards);
		progression.setRanks(ranks);
		statUserDTO.setProgressionGraphicsData(progression);		
		
		return statUserDTO;
	}
	
	/**
	 * Retourne le classement pour une année.
	 * @param year
	 * @param archiveRanks
	 * @return
	 */
	protected Integer getRankByYear(final Integer year, final List<ArchiveRank> archiveRanks) {
		for (ArchiveRank archiveRank : archiveRanks) {
			if (archiveRank.getYear().equals(year)) {
				return archiveRank.getPosition();
			}
		}
		return null;
	}
}
