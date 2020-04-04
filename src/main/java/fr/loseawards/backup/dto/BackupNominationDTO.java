/**
 * 
 */
package fr.loseawards.backup.dto;

import lombok.Data;

import java.io.Serializable;
import java.util.Arrays;
import java.util.Date;
import java.util.List;

/**
 * Classe représentant un backup de nomination.
 */
@Data
public class BackupNominationDTO implements Serializable {
	private static final long serialVersionUID = -3077819925988704522L;

	private List<String> usersNames;
	private String categoryName;
	private String reason;
	private Date date;
	
	public BackupNominationDTO() {
	}
	
	public BackupNominationDTO(String[] usersNames, String categoryName, String reason, Date date) {
		if (usersNames != null) {
			this.usersNames = Arrays.asList(usersNames);
		}
		this.categoryName = categoryName;
		this.reason = reason;
		this.date = date;
	}
}
