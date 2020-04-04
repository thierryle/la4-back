package fr.loseawards.archiveaward.dto;

import lombok.Data;

import java.io.Serializable;
import java.util.List;

@Data
public class ProgressionGraphicsDataDTO implements Serializable {
	private static final long serialVersionUID = -1696154534147880408L;

	private List<Integer> years;
	private List<Integer> nbAwards;
	private List<Integer> ranks;
}
