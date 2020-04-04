/**
 * 
 */
package fr.loseawards.backup.dto;

import lombok.Data;

import java.io.Serializable;
import java.util.List;

/**
 * Classe représentant une archive avec les récompenses.
 */
@Data
public class BackupArchiveWithAwardsDTO implements Serializable {
	private static final long serialVersionUID = -1853616236365218715L;

	private BackupArchiveDTO archive;
	private List<BackupArchiveAwardDTO> archiveAwards;
}
