/**
 * 
 */
package fr.loseawards.model;

import com.googlecode.objectify.annotation.Entity;
import com.googlecode.objectify.annotation.Id;
import com.googlecode.objectify.annotation.Index;
import lombok.Data;

/**
 * Classe représentant une catégorie dans les archives.
 */
@Entity
@Data
public class ArchiveCategory {
	@Id
	protected Long id;

	@Index
	protected String name;
	
	public ArchiveCategory() {
	}
	
	public ArchiveCategory(Long id, String name) {
		this.id = id;
		this.name = name;
	}
}
