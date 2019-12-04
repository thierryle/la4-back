package fr.loseawards.model;

import com.googlecode.objectify.Key;
import com.googlecode.objectify.annotation.Entity;
import com.googlecode.objectify.annotation.Id;
import com.googlecode.objectify.annotation.Index;

/**
 * Classe représentant la décision du président dans une égalité pour une catégorie.
 */
@Entity
public class Decision {
	@Id
	protected Long id;
	
	@Index
	protected Key<Category> categoryId;
	
	@Index
	protected Key<User> nominatedId;
	
	public Decision() {
	}
	
	public Decision(Long id, Long categoryId, Long nominatedId) {
		this.id = id;
		if (categoryId != null) {
			this.categoryId = Key.create(Category.class, categoryId);
		}
		if (nominatedId != null) {
			this.nominatedId = Key.create(User.class, nominatedId);
		}
	}
	
	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public Long getCategoryId() {
		if (categoryId != null) {
			return categoryId.getId();
		}
		return null;
	}

	public void setCategoryId(Long categoryId) {
		this.categoryId = Key.create(Category.class, categoryId);
	}
	
	public Long getNominatedId() {
		if (nominatedId != null) {
			return nominatedId.getId();
		}
		return null;
	}
	
	public void setNominatedId(Long nominatedId) {
		this.nominatedId = Key.create(User.class, nominatedId);
	}
}