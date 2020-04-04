package fr.loseawards.model;

import com.googlecode.objectify.Key;
import com.googlecode.objectify.annotation.Entity;
import com.googlecode.objectify.annotation.Id;
import com.googlecode.objectify.annotation.Index;
import lombok.Data;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Classe représentant une récompense archive.
 */
@Entity
@Data
public class ArchiveAward {
	@Id
	protected Long id;

	@Index
	protected Integer year;

	@Index
	protected Key<ArchiveCategory> categoryId;

	protected List<Key<User>> usersIds;
	
	protected String reason;
	
	public ArchiveAward() {
	}
	
	public ArchiveAward(Long id, Integer year, Long categoryId, List<Long> usersIds, String reason) {
		this.id = id;
		this.year = year;
		if (categoryId != null) {
			this.categoryId = Key.create(ArchiveCategory.class, categoryId);
		}
		if (usersIds != null) {
			this.usersIds = usersIds.stream().map(userId -> Key.create(User.class, userId)).collect(Collectors.toList());
		}
		this.reason = reason;
	}

	public Long getCategoryIdAsLong() {
		if (categoryId == null) {
			return null;
		}
		return categoryId.getId();
	}

	public void setCategoryIdAsLong(Long categoryId) {
		if (categoryId != null) {
			this.categoryId = Key.create(ArchiveCategory.class, categoryId);
		}
	}

	public List<Long> getUsersIdsAsLong() {
		if (this.usersIds != null) {
			return this.usersIds.stream().map(userId -> userId.getId()).collect(Collectors.toList());
		}
		return null;
	}

	public void setUsersIdsAsLong(List<Long> usersIds) {
		if (usersIds != null) {
			this.usersIds = usersIds.stream().map(userId -> Key.create(User.class, userId)).collect(Collectors.toList());
		}
	}
}
