package fr.loseawards.model;

import com.googlecode.objectify.Key;
import com.googlecode.objectify.annotation.Entity;
import com.googlecode.objectify.annotation.Id;
import com.googlecode.objectify.annotation.Index;
import lombok.Data;

import javax.jdo.annotations.*;
import java.io.Serializable;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Classe représentant un classement.
 */
@Entity
@Data
public class ArchiveRank {
	@Id
	protected Long id;

	@Index
	protected Integer year;
	
	protected Integer position;

	protected List<Key<User>> usersIds;
	
	public ArchiveRank() {
	}
	
	public ArchiveRank(Long id, Integer year, Integer position, List<Long> usersIds) {
		this.id = id;
		this.year = year;
		this.position = position;
		if (usersIds != null) {
			this.usersIds = usersIds.stream().map(userId -> Key.create(User.class, userId)).collect(Collectors.toList());
		}
	}

	public List<Long> getUsersIdsAsLong() {
		if (this.usersIds != null) {
			return this.usersIds.stream().map(userId -> userId.getId()).collect(Collectors.toList());
		}
		return null;
	}
}
