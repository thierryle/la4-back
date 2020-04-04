package fr.loseawards.archiveaward.dto;

import lombok.Data;

import java.io.Serializable;
import java.util.List;
import java.util.Map;

@Data
public class StatCategoryDTO implements Serializable {
	private static final long serialVersionUID = -2186705425806724253L;

	private Map<Long, List<Integer>> awardsByUser;
	private List<GraphicsDatumDTO> graphicsData;
	private List<Integer> appearingYears;
}
