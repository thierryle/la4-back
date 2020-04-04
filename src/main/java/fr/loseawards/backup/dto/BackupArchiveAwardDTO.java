/**
 * 
 */
package fr.loseawards.backup.dto;

import lombok.Data;

import java.io.Serializable;
import java.util.Arrays;
import java.util.List;

/**
 * Classe représentant un backup de récompense dans les archives.
 */
@Data
public class BackupArchiveAwardDTO implements Serializable {
	private static final long serialVersionUID = -5997380757158188559L;

	private String categoryName;
	private List<String> usersNames;
	private Integer year;
	private String reason;
	
	public BackupArchiveAwardDTO() {
	}
	
	public BackupArchiveAwardDTO(Integer year, String categoryName, String[] usersNames, String reason) {
		this.year = year;
		this.categoryName = categoryName;
		if (usersNames != null) {
			this.usersNames = Arrays.asList(usersNames);
		}
		this.reason = reason;
	}
}
