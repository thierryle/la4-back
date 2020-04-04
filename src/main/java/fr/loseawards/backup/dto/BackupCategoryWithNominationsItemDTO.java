/**
 * 
 */
package fr.loseawards.backup.dto;

import lombok.Data;

import java.io.Serializable;
import java.util.List;

@Data
public class BackupCategoryWithNominationsItemDTO implements Serializable {
	private List<BackupCategoryWithNominationsDTO> items;
}
