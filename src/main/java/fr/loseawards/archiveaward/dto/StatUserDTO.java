package fr.loseawards.archiveaward.dto;

import lombok.Data;

import java.io.Serializable;
import java.util.List;
import java.util.Map;

@Data
public class StatUserDTO implements Serializable {
	private static final long serialVersionUID = 8030483717127167161L;

	private Map<Long, List<Integer>> awardsByCategory;
	private List<GraphicsDatumDTO> graphicsData;
	private ProgressionGraphicsDataDTO progressionGraphicsData;
}
