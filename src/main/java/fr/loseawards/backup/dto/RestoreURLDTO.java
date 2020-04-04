/**
 * 
 */
package fr.loseawards.backup.dto;

import lombok.Data;

import java.io.Serializable;

/**
 * Classe représentant les données nécessaires à une restauration par URL.
 */
@Data
public class RestoreURLDTO implements Serializable {
	private static final long serialVersionUID = -4560188803985647959L;

	private String url;
	private Boolean restoreUsers;
	private Boolean restoreCategoriesAndNominations;
	private Boolean restoreUsersAndCategoriesArchive;
	private Boolean restoreArchives;
	
	public RestoreURLDTO() {
	}
	
	public RestoreURLDTO(final String url, final Boolean restoreUsers, final Boolean restoreCategoriesAndNominations, final Boolean restoreUsersAndCategoriesArchive, final Boolean restoreArchives) {
		this.url = url;
		this.restoreUsers = restoreUsers;
		this.restoreCategoriesAndNominations = restoreCategoriesAndNominations;
		this.restoreUsersAndCategoriesArchive = restoreUsersAndCategoriesArchive;
		this.restoreArchives = restoreArchives;
	}
}
