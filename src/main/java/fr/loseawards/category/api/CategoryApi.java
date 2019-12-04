package fr.loseawards.category.api;

import java.util.List;

import com.google.api.server.spi.config.ApiMethod;
import com.google.api.server.spi.config.ApiMethod.HttpMethod;
import com.google.api.server.spi.config.Named;

import fr.loseawards.AbstractServiceApi;
import fr.loseawards.category.dto.CategoryDTO;
import fr.loseawards.model.Category;
import fr.loseawards.util.Converter;

public class CategoryApi extends AbstractServiceApi {
	
	/**
	 * Récupère une catégorie.
	 * GET http://localhost:8080/_ah/api/loseawards/v1/categories/6641050231767040
	 * @param userId
	 * @return
	 */
	@ApiMethod(path = "categories/{categoryId}", httpMethod = HttpMethod.GET)
	public CategoryDTO getCategory(@Named("categoryId") final Long categoryId) {
		Category category = getPersistenceService().getCategory(categoryId);
		if (category == null) {
			return null;
		}
		return Converter.toDTO(category);
	}
	
	/**
	 * Récupère toutes les catégories.
	 * GET http://localhost:8080/_ah/api/loseawards/v1/categories
	 * @return
	 */
	@ApiMethod(path = "categories", httpMethod = HttpMethod.GET)
	public List<CategoryDTO> getCategories() {
		// Récupération des catégories dans la base		
		List<Category> categories = getPersistenceService().getCategories();

		// Conversion en DTO
		return Converter.toCategoriesDTO(categories);
	}
	
	/**
	 * Crée une catégorie.
	 * POST http://localhost:8080/_ah/api/loseawards/v1/categories
	 * @param userDTO
	 * @return
	 */
	@ApiMethod(path = "categories", httpMethod = HttpMethod.POST)
	public CategoryDTO createCategory(final CategoryDTO categoryDTO) {
		Category category = Converter.fromDTO(categoryDTO);
		getPersistenceService().addCategory(category);
		categoryDTO.setId(category.getId());
		return categoryDTO;
	}
	
	/**
	 * Supprime une catégorie.
	 * DELETE http://localhost:8080/_ah/api/loseawards/v1/categories/6641050231767040
	 * @param categoryId
	 */
	@ApiMethod(path = "categories/{categoryId}", httpMethod = HttpMethod.DELETE)
	public void deleteCategory(@Named("categoryId") final Long categoryId) {
		getPersistenceService().deleteCategory(categoryId);
	}
	
	/**
	 * Supprime toutes les catégories.
	 * DELETE http://localhost:8080/_ah/api/loseawards/v1/categories/6641050231767040
	 */
	@ApiMethod(path = "categories", httpMethod = HttpMethod.DELETE)
	public void deleteCategories() {
		getPersistenceService().deleteCategories();
	}
	
	/**
	 * Met à jour une catégorie.
	 * PUT http://localhost:8080/_ah/api/loseawards/v1/users/6641050231767040
	 * @param categoryId
	 * @param categoryDTO
	 * @return
	 */
	@ApiMethod(path = "categories/{categoryId}", httpMethod = HttpMethod.PUT)
	public void updateCategory(@Named("categoryId") final Long categoryId, final CategoryDTO categoryDTO) {
		getPersistenceService().updateCategory(Converter.fromDTO(categoryDTO));
	}	
}
