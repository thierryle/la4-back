
/**
 * 
 */
package fr.loseawards.model;

import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

import com.googlecode.objectify.Key;
import com.googlecode.objectify.annotation.Entity;
import com.googlecode.objectify.annotation.Id;
import com.googlecode.objectify.annotation.Index;

/**
 * Classe représentant une nomination.
 */
@Entity
public class Nomination {
	@Id
	protected Long id;
	
	@Index
	protected Key<Category> categoryId;
	
	protected List<Key<User>> usersIds;
	
	protected String reason;
	
	@Index
	protected Date date;
	
	@Index
	protected Key<Image> imageId;
	
	public Nomination() {
	}
	
	public Nomination(Long id, List<Long> usersIds, Long categoryId, String reason, Date date, Long imageId) {
		this.id = id;
		if (usersIds != null) {
			this.usersIds = usersIds.stream().map(userId -> Key.create(User.class, userId)).collect(Collectors.toList());
		}
		if (categoryId != null) {
			this.categoryId = Key.create(Category.class, categoryId);
		}
		this.reason = reason;
		this.date = date;
		if (imageId != null) {
			this.imageId = Key.create(Image.class, imageId);
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

//	public Long[] getUsersIds() {
//		return (Long[]) this.usersIds.stream().map(userId -> userId.getId()).toArray();
//	}
	
	public List<Key<User>> getUsersIds() {
		return usersIds;
	}

	public void setUsersIds(List<Key<User>> usersIds) {
		this.usersIds = usersIds;
	}

	public List<Long> getUsersIdsAsList() {
		if (this.usersIds != null) {
			return this.usersIds.stream().map(userId -> userId.getId()).collect(Collectors.toList());
		}
		return null;
	}

//	public void setUsersIds(Long[] usersIds) {
//		this.usersIds =  Arrays.stream(usersIds).map(userId -> Key.create(User.class, userId)).collect(Collectors.toList());
//	}

	public String getReason() {
		return reason;
	}

	public void setReason(String reason) {
		this.reason = reason;
	}

	public Date getDate() {
		return date;
	}

	public void setDate(Date date) {
		this.date = date;
	}

	public Long getImageId() {
		if (imageId != null) {
			return imageId.getId();
		}
		return null;
	}

	public void setImageId(Long imageId) {
		this.imageId = Key.create(Image.class, imageId);
	}
}
