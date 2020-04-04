/**
 * 
 */
package fr.loseawards.backup.dto;

import fr.loseawards.user.dto.UserDTO;
import lombok.Data;

import java.io.Serializable;
import java.util.List;

@Data
public class UserItemDTO implements Serializable {
	private static final long serialVersionUID = 8929014627621427963L;
	private List<UserDTO> items;
}
