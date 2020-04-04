/**
 * 
 */
package fr.loseawards.backup.dto;

import lombok.Data;

import java.io.Serializable;
import java.util.Arrays;
import java.util.List;
import java.util.Map;

/**
 * Classe représentant un backup d'archive.
 */
@Data
public class BackupArchiveDTO implements Serializable {
	private static final long serialVersionUID = 6528262397920274457L;

	private List<String> categoriesNames;
	private Integer year;
	private Map<Integer, List<String>> ranking;
	
	public BackupArchiveDTO() {
	}
	
	public BackupArchiveDTO(Integer year, String[] categoriesNames) {
		this.year = year;
		if (categoriesNames != null) {
			this.categoriesNames = Arrays.asList(categoriesNames);
		}		
	}
}
