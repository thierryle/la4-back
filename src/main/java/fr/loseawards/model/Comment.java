/**
 * 
 */
package fr.loseawards.model;

import java.util.Date;

import com.googlecode.objectify.Key;
import com.googlecode.objectify.annotation.Entity;
import com.googlecode.objectify.annotation.Id;
import com.googlecode.objectify.annotation.Index;

import fr.loseawards.util.Converter;

/**
 * Classe représentant un commentaire.
 */
@Entity
public class Comment {
	@Id
	protected Long id;
	
	@Index
	protected Key<User> authorId;
	
	@Index
	protected Date date;
	
	protected String content;
	
	@Index
	protected Key<Nomination> nominationId;
	
	public Comment() {
	}
	
	public Comment(Long id, Long authorId, String date, String content, Long nominationId) {
		this.id = id;
		if (authorId != null) {
			this.authorId = Key.create(User.class, authorId);
		}
		if (date != null && !date.isEmpty()) {
			this.date = Converter.stringToDate(date);
		}
		this.content = content;
		if (nominationId != null) {
			this.nominationId = Key.create(Nomination.class, nominationId);
		}
	}
	
	public void setId(Long id) {
		this.id = id;
	}

	public Long getId() {
		return id;
	}

	public Long getAuthorId() {
		if (this.authorId != null) {
			return this.authorId.getId();
		}
		return null;
	}

	public void setAuthorId(Long authorId) {
		this.authorId = Key.create(User.class, authorId);
	}

	public Date getDate() {
		return date;
	}

	public void setDate(Date date) {
		this.date = date;
	}

	public String getContent() {
		return content;
	}

	public void setContent(String content) {
		this.content = content;
	}

	public Long getNominationId() {
		if (this.nominationId != null) {
			return this.nominationId.getId();
		}
		return null;
	}

	public void setNominationId(Long nominationId) {
		this.nominationId = Key.create(Nomination.class, nominationId);
	}
}
