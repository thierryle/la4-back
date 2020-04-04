/**
 * 
 */
package fr.loseawards.archivecategory.dto;

import com.googlecode.objectify.annotation.Entity;
import com.googlecode.objectify.annotation.Id;
import com.googlecode.objectify.annotation.Index;
import lombok.Data;

/**
 * Classe représentant une catégorie dans les archives.
 */
@Data
public class ArchiveCategoryDTO {
	protected Long id;
	protected String name;

	public ArchiveCategoryDTO() {
	}

	public ArchiveCategoryDTO(Long id, String name) {
		this.id = id;
		this.name = name;
	}
}
