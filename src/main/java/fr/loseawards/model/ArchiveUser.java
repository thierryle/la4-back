/**
 * 
 */
package fr.loseawards.model;

import com.googlecode.objectify.annotation.Entity;
import com.googlecode.objectify.annotation.Id;
import com.googlecode.objectify.annotation.Index;
import lombok.Data;

import javax.jdo.annotations.*;
import java.io.Serializable;

/**
 * Classe représentant un utilisateur dans les archives.
 */
@Entity
@Data
public class ArchiveUser implements Serializable {
	@Id
	protected Long id;

	protected String firstName;

	protected String lastName;

	@Index
	protected Integer firstYear;

	@Index
	protected Integer lastYear;
	
	public ArchiveUser() {
	}
	
	public ArchiveUser(final Long id, final String firstName, final String lastName, final Integer firstYear, final Integer lastYear) {
		this.id = id;
		this.firstName = firstName;
		this.lastName = lastName;
		this.firstYear = firstYear;
		this.lastYear = lastYear;
	}

	public String getDisplayName() {
		StringBuilder name = new StringBuilder(firstName);
		if (lastName != null && !lastName.isEmpty()) {
			name.append(" ");
			name.append(lastName);
		}
		return name.toString();
	}
}
