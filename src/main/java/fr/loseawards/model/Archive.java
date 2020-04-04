package fr.loseawards.model;

import com.googlecode.objectify.Key;
import com.googlecode.objectify.annotation.Entity;
import com.googlecode.objectify.annotation.Id;
import com.googlecode.objectify.annotation.Index;
import lombok.Data;

import javax.jdo.annotations.Persistent;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Classe représentant une archive.
 */
@Entity
@Data
public class Archive {
	@Id
	protected Long id;

	@Index
	protected Integer year;
	
	@Persistent
	protected List<Key<ArchiveCategory>> categoriesIds;
	
	public Archive() {
	}
	
	public Archive(Long id, Integer year, List<Long> categoriesIds) {
		this.id = id;
		if (categoriesIds != null) {
			this.categoriesIds = categoriesIds.stream().map(categoryId -> Key.create(ArchiveCategory.class, categoryId)).collect(Collectors.toList());
		}
		this.year = year;
	}

	public List<Long> getCategoriesIdsAsLong() {
		if (this.categoriesIds != null) {
			return this.categoriesIds.stream().map(categoryId -> categoryId.getId()).collect(Collectors.toList());
		}
		return null;
	}

	public void setCategoriesIdsAsLong(List<Long> categoriesIds) {
		if (categoriesIds != null) {
			this.categoriesIds = categoriesIds.stream().map(categoryId -> Key.create(ArchiveCategory.class, categoryId)).collect(Collectors.toList());
		}
	}
}
