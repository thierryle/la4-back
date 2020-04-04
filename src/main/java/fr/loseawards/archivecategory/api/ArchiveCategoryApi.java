package fr.loseawards.archivecategory.api;

import com.google.api.server.spi.config.ApiMethod;
import com.google.api.server.spi.config.Named;
import fr.loseawards.AbstractServiceApi;
import fr.loseawards.archivecategory.dto.ArchiveCategoryBundleDTO;
import fr.loseawards.archivecategory.dto.ArchiveCategoryDTO;
import fr.loseawards.model.ArchiveCategory;
import fr.loseawards.util.Converter;

import java.util.List;

public class ArchiveCategoryApi extends AbstractServiceApi {
	/**
	 * Retourne les catégories.
	 * GET http://localhost:8080/_ah/api/loseawards/v1/archivecategories
	 * @return
	 */
	@ApiMethod(path = "archivecategories", httpMethod = ApiMethod.HttpMethod.GET)
	public ArchiveCategoryBundleDTO getArchiveCategories() {
		ArchiveCategoryBundleDTO archiveCategoryBundleDTO = new ArchiveCategoryBundleDTO();

		// Récupération des catégories dans la base		
		List<ArchiveCategory> archiveCategories = getPersistenceService().getArchiveCategories();
		archiveCategoryBundleDTO.setArchiveCategories(Converter.toArchiveCategoriesDTO(archiveCategories));

		// Conversion en DTO
		return archiveCategoryBundleDTO;
	}

	/**
	 * Retourne une catégorie.
	 * GET http://localhost:8080/_ah/api/loseawards/v1/archivecategories/6641050231767040
	 * @param archiveCategoryId
	 */
	@ApiMethod(path = "archivecategories/{archiveCategoryId}", httpMethod = ApiMethod.HttpMethod.GET)
	public ArchiveCategoryDTO getArchiveCategory(@Named("archiveCategoryId") final Long archiveCategoryId) {
		ArchiveCategory archiveCategory = getPersistenceService().getArchiveCategory(archiveCategoryId);
		if (archiveCategory == null) {
			return null;
		}
		return Converter.toDTO(archiveCategory);
	}

	/**
	 * Crée une catégorie.
	 * POST http://localhost:8080/_ah/api/loseawards/v1/archivecategories
	 * @param archiveCategoryDTO
	 * @return
	 */
	@ApiMethod(path = "archivecategories", httpMethod = ApiMethod.HttpMethod.POST)
	public ArchiveCategoryDTO createArchiveCategory(final ArchiveCategoryDTO archiveCategoryDTO) {
		ArchiveCategory archiveCategory = Converter.fromDTO(archiveCategoryDTO);
		getPersistenceService().addArchiveCategory(archiveCategory);
		archiveCategoryDTO.setId(archiveCategory.getId());
		return archiveCategoryDTO;
	}

	/**
	 * Supprime une catégorie.
	 * DELETE http://localhost:8080/_ah/api/loseawards/v1/archivecategories/6641050231767040
	 * @param archiveCategoryId
	 */
	@ApiMethod(path = "archivecategories/{archiveCategoryId}", httpMethod = ApiMethod.HttpMethod.DELETE)
	public void deleteArchiveCategory(@Named("archiveCategoryId") final Long archiveCategoryId) {
		getPersistenceService().deleteArchiveCategory(archiveCategoryId);
	}

	/**
	 * Supprime toutes les catégories.
	 * DELETE http://localhost:8080/_ah/api/loseawards/v1/archivecategories
	 */
	@ApiMethod(path = "archivecategories", httpMethod = ApiMethod.HttpMethod.DELETE)
	public void deleteArchiveCategories() {
		getPersistenceService().deleteArchiveCategories();
	}

	/**
	 * Met à jour une catégorie.
	 * PUT http://localhost:8080/_ah/api/loseawards/v1/archivecategories/6641050231767040
	 * PUT http://localhost:8888/api/archivecategories/6229832882978816
	 * @param archiveCategoryId
	 * @param archiveCategoryDTO
	 */
	@ApiMethod(path = "archivecategories/{archiveCategoryId}", httpMethod = ApiMethod.HttpMethod.PUT)
	public void updateArchiveCategory(@Named("archiveCategoryId") final Long archiveCategoryId, final ArchiveCategoryDTO archiveCategoryDTO) {
		getPersistenceService().updateArchiveCategory(Converter.fromDTO(archiveCategoryDTO));
	}	
}
