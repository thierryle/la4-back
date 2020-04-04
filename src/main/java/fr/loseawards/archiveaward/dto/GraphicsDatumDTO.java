package fr.loseawards.archiveaward.dto;

import lombok.Data;

import java.io.Serializable;

@Data
public class GraphicsDatumDTO implements Serializable {
	private static final long serialVersionUID = -6665608551394528774L;

	private String name;
	private double y;
	
	public GraphicsDatumDTO(String name, double y) {
		this.name = name;
		this.y = y;
	}
}
