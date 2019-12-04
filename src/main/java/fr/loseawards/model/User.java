/**
 * 
 */
package fr.loseawards.model;

import com.googlecode.objectify.Key;
import com.googlecode.objectify.annotation.Entity;
import com.googlecode.objectify.annotation.Id;
import com.googlecode.objectify.annotation.Index;

/**
 * Classe représentant un utilisateur.
 */
@Entity
public class User {
	@Id
	private Long id;
	
	@Index
	private String firstName;
	
	@Index
	private String lastName;
	
	private String email;
	
	private String password;
	
	private Key<Avatar> avatarId;
	
	public User() {
	}
	
	public User(Long id, String firstName, String lastName, String email, Long avatarId) {
		this.id = id;
		this.firstName = firstName;
		this.lastName = lastName;
		this.email = email;
		if (avatarId != null) {
			this.avatarId = Key.create(Avatar.class, avatarId);
		}		
	}
	
	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getFirstName() {
		return firstName;
	}

	public void setFirstName(String firstName) {
		this.firstName = firstName;
	}

	public String getLastName() {
		return lastName;
	}

	public void setLastName(String lastName) {
		this.lastName = lastName;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}
	
	public String getDisplayName() {
		StringBuilder name = new StringBuilder(firstName);
		if (lastName != null && !lastName.isEmpty()) {
			name.append(" ");
			name.append(lastName);
		}
		return name.toString();
	}

	public Long getAvatarId() {
		if (avatarId != null) {
			return avatarId.getId();
		}
		return null;
	}

	public void setAvatarId(Long avatarId) {
		if (avatarId != null) {
			this.avatarId = Key.create(Avatar.class, avatarId);
		}		
	}

	@Override
	public int hashCode() {
		final int prime = 31;
		int result = 1;
		result = prime * result + ((id == null) ? 0 : id.hashCode());
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
		User other = (User) obj;
		if (id == null) {
			if (other.id != null)
				return false;
		} else if (!id.equals(other.id))
			return false;
		return true;
	}
}
