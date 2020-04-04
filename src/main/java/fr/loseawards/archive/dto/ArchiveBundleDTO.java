/**
 * 
 */
package fr.loseawards.archive.dto;

import fr.loseawards.archivecategory.dto.ArchiveCategoryDTO;
import fr.loseawards.archiveuser.dto.ArchiveUserDTO;
import lombok.Data;

import java.io.Serializable;
import java.util.List;
import java.util.Map;

/**
 * Classe contenant les données nécessaires à l'écran d'archive.
 */
@Data
public class ArchiveBundleDTO implements Serializable {
	private static final long serialVersionUID = 5156768864010566349L;

	private List<ArchiveDTO> archives;
	private List<ArchiveUserDTO> archiveUsers;
	private List<ArchiveCategoryDTO> archiveCategories;
	private Map<Integer, List<Long>> losersByYear;
}
