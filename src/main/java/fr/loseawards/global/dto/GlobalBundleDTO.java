/**
 * 
 */
package fr.loseawards.global.dto;

import java.io.Serializable;
import java.util.List;

/**
 * Classe représentant une liste de variables globales.
 */
public class GlobalBundleDTO implements Serializable {
	private static final long serialVersionUID = 8481162270626367584L;
	
	private List<GlobalDTO> globals;

	public List<GlobalDTO> getGlobals() {
		return globals;
	}

	public void setGlobals(List<GlobalDTO> globals) {
		this.globals = globals;
	}
}
