/**
 * 
 */
package fr.loseawards.model;

import com.googlecode.objectify.annotation.Entity;
import com.googlecode.objectify.annotation.Id;

/**
 * Classe représentant une image, avec les annotations de persistence.
 */
@Entity
public class Image {
	@Id
	protected Long id;
	
	protected byte[] image;
	
	public Image() {
	}
	
	public Image(byte[] image) {
		this.image = image;
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public byte[] getImage() {
		return image;
	}

	public void setImage(byte[] image) {
		this.image = image;
	}
}
