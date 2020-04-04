/**
 * 
 */
package fr.loseawards.archive.dto;

import lombok.Data;

import java.io.Serializable;
import java.util.Arrays;
import java.util.List;
import java.util.Map;

/**
 * Classe représentant une archive.
 */
@Data
public class ArchiveDTO implements Serializable {
	private static final long serialVersionUID = -7742884775500191470L;

	private Long id;
	private List<Long> categoriesIds;
	private Integer year;
	private Map<Integer, List<Long>> ranking;
	
	public ArchiveDTO() {
	}
	
	public ArchiveDTO(Long id, Integer year, List<Long> categoriesIds, Map<Integer, List<Long>> ranking) {
		this.id = id;
		this.year = year;
		this.categoriesIds = categoriesIds;
//		if (categoriesIds != null) {
//			this.categoriesIds = Arrays.asList(categoriesIds);
//		}
		this.ranking = ranking;
	}
}
