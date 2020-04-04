/**
 * 
 */
package fr.loseawards.backup.dto;

import lombok.Data;

import java.io.Serializable;
import java.util.List;

/**
 * Classe représentant une catégorie avec les nominations.
 */
@Data
public class BackupCategoryWithNominationsDTO implements Serializable {
	private static final long serialVersionUID = 7253021603177351425L;

	private String name;
	private List<BackupNominationDTO> nominations;
}
