/**
 * 
 */
package fr.loseawards.model;

import com.googlecode.objectify.annotation.Entity;
import com.googlecode.objectify.annotation.Id;
import com.googlecode.objectify.annotation.Index;

/**
 * Classe représentant une catégorie.
 */
@Entity
public class Category {
	@Id
	protected Long id;
	
	@Index
	protected String name;
	
	public Category() {
	}
	
	public Category(Long id, String name) {
		this.id = id;
		this.name = name;
	}
	
	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}
}
