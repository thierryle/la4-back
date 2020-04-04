/**
 * 
 */
package fr.loseawards.archivecategory.dto;

import fr.loseawards.comment.dto.CommentDTO;
import lombok.Data;

import java.io.Serializable;
import java.util.List;
import java.util.Map;

/**
 * Classe contenant les données nécessaires à l'écran des images.
 */
@Data
public class ArchiveCategoryBundleDTO implements Serializable {
	private static final long serialVersionUID = 542081797871224836L;
	
	private List<ArchiveCategoryDTO> archiveCategories;
}
