/**
 * 
 */
package fr.loseawards.model;

import com.googlecode.objectify.Key;
import com.googlecode.objectify.annotation.Entity;
import com.googlecode.objectify.annotation.Id;
import com.googlecode.objectify.annotation.Index;

/**
 * Classe représentant un vote.
 */
@Entity
public class Vote {
	@Id
	protected Long id;
	
	@Index
	protected Key<Category> categoryId;
	
	@Index
	protected Key<User> voterId;
	
	@Index
	protected Key<Nomination> nominationId;
	
	protected String reason;
	
	public Vote() {
	}
	
	public Vote(Long id, Long categoryId, Long voterId, Long nominationId, String reason) {
		this.id = id;
		if (categoryId != null) {
			this.categoryId = Key.create(Category.class, categoryId);
		}
		if (voterId != null) {
			this.voterId = Key.create(User.class, voterId);
		}
		if (nominationId != null) {
			this.nominationId = Key.create(Nomination.class, nominationId);
		}
		this.reason = reason;
	}
	
	@Override
	public int hashCode() {
		final int prime = 31;
		int result = 1;
		result = prime * result	+ ((categoryId == null) ? 0 : categoryId.hashCode());
		result = prime * result + ((voterId == null) ? 0 : voterId.hashCode());
		return result;
	}

	@Override
	public boolean equals(Object obj) {
		if (this == obj)
			return true;
		if (obj == null)
			return false;
		if (getClass() != obj.getClass())
			return false;
		Vote other = (Vote) obj;
		if (categoryId == null) {
			if (other.categoryId != null)
				return false;
		} else if (!categoryId.equals(other.categoryId))
			return false;
		if (voterId == null) {
			if (other.voterId != null)
				return false;
		} else if (!voterId.equals(other.voterId))
			return false;
		return true;
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
	
	public Long getVoterId() {
		if (voterId != null) {
			return voterId.getId();
		}
		return null;
	}

	public void setVoterId(Long voterId) {
		this.voterId = Key.create(User.class, voterId);
	}

	public Long getNominationId() {
		if (nominationId != null) {
			return nominationId.getId();
		}
		return null;
	}

	public void setNominationId(Long nominationId) {
		this.nominationId = Key.create(Nomination.class, nominationId);
	}

	public String getReason() {
		return reason;
	}

	public void setReason(String reason) {
		this.reason = reason;
	}
}
