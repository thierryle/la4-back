/**
 * 
 */
package fr.loseawards.archiveaward.dto;

import fr.loseawards.archivereport.dto.ArchiveReportDTO;
import lombok.Data;

import java.io.Serializable;
import java.util.List;

/**
 * Classe représentant un bundle pour afficher une archive avec ses résultats et son rapport.
 */
@Data
public class ArchiveAwardsAndReportDTO implements Serializable {
	private static final long serialVersionUID = 8993940349307434567L;

	private List<ArchiveAwardDTO> archiveAwards;
	private ArchiveReportDTO archiveReport;
}
