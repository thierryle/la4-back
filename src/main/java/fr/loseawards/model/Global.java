/**
 * 
 */
package fr.loseawards.model;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import com.googlecode.objectify.Key;
import com.googlecode.objectify.annotation.Entity;
import com.googlecode.objectify.annotation.Id;
import com.googlecode.objectify.annotation.Index;

/**
 * Classe représentant une variable globale à l'application.
 */
@Entity
public class Global implements Serializable {
	private static final long serialVersionUID = 1410925640268372275L;

	@Id
	protected Long id;
	
	@Index
	protected String key;
	
	protected String value;
	
	protected List<Key<User>> valuesIds;
	
	public Global() {
	}
	
	public Global(Long id, String key, String value, List<Long> valuesIds) {
		this.id = id;
		this.key = key;
		this.value = value;
		
		if (valuesIds != null && !valuesIds.isEmpty()) {
			this.valuesIds = valuesIds.stream().map(valueId -> Key.create(User.class, valueId)).collect(Collectors.toList());;
		}
	}
	
	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getKey() {
		return key;
	}

	public void setKey(String key) {
		this.key = key;
	}

	public String getValue() {
		return value;
	}

	public void setValue(String value) {
		this.value = value;
	}

	public List<Key<User>> getValuesIds() {
		return valuesIds;
	}
	
	public List<Long> getValuesIdsAsList() {
		if (this.valuesIds != null) {
			return this.valuesIds.stream().map(userId -> userId.getId()).collect(Collectors.toList());
		}
		return null;
	}

	public void setValuesIds(List<Key<User>> valuesIds) {
		this.valuesIds = valuesIds;
	}
	
//	public Long[] getValuesIds() {
//		if (this.valuesIds != null) {
//			return (Long[]) this.valuesIds.stream().map(valueId -> valueId.getId()).toArray();
//		}
//		return null;
//	}
//
//	public void setValuesIds(Long[] valuesIds) {
//		if (valuesIds != null) {
//			this.valuesIds = Arrays.stream(valuesIds).map(valueId -> Key.create(User.class, valueId)).collect(Collectors.toList());;
//		}
//		
//	}
	
	public void addValueId(Long valueId) {
		if (valuesIds == null) {
			valuesIds = new ArrayList<>();
		}
		valuesIds.add(Key.create(User.class, valueId));
	}
	
//	public void addValueId(Long valueId) {
//		int oldSize = valuesIds != null ? valuesIds.length : 0;
//		Long[] newValuesIds = new Long[oldSize + 1];
//		if (valuesIds != null) {
//			System.arraycopy(valuesIds, 0, newValuesIds, 0, oldSize);
//		}
//		newValuesIds[newValuesIds.length - 1] = valueId;
//		
//		valuesIds = newValuesIds;
//	}
}
