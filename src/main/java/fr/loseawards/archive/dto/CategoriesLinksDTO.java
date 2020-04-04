/**
 * 
 */
package fr.loseawards.archive.dto;

import fr.loseawards.archivecategory.dto.ArchiveCategoryDTO;
import lombok.Data;

import java.io.Serializable;
import java.util.List;
import java.util.Map;

/**
 * Classe représentant une archive avec les récompenses.
 */
@Data
public class CategoriesLinksDTO implements Serializable {
	private static final long serialVersionUID = 8846083598845303492L;

	private Integer year;
	private Map<Long, Long> links;
	private List<ArchiveCategoryDTO> archiveCategories;
}
