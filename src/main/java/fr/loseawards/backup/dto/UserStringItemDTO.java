/**
 * 
 */
package fr.loseawards.backup.dto;

import lombok.Data;

import java.io.Serializable;
import java.util.List;

@Data
public class UserStringItemDTO implements Serializable {
	private static final long serialVersionUID = 8166793202120492018L;
	private List<UserStringItemDTO> items;
}
