package fr.loseawards.user.dto;

import lombok.Data;

import java.io.Serializable;

@Data
public class UserStringDTO implements Serializable {
	private static final long serialVersionUID = -2872786924498090781L;

	private Long id;
	private String firstName;
	private String lastName;
	private String email;
	private String avatar;
	private Long avatarId;

	public UserStringDTO() {
	}

	public UserStringDTO(Long id, String firstName, String lastName, String email, String avatar, Long avatarId) {
		this.id = id;
		this.firstName = firstName;
		this.lastName = lastName;
		this.email = email;
		this.avatar = avatar;
		this.avatarId = avatarId;
	}
}
