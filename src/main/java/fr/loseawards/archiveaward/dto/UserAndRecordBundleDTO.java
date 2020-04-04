package fr.loseawards.archiveaward.dto;

import lombok.Data;

import java.io.Serializable;
import java.util.List;
import java.util.Map;

@Data
public class UserAndRecordBundleDTO implements Serializable {
	private static final long serialVersionUID = -7938606003140836124L;

	private Map<Long, List<UserAndRecordDTO>> usersAndRecords;
}
