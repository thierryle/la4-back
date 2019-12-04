package fr.loseawards.persistence;

import static com.googlecode.objectify.ObjectifyService.ofy;

import java.util.List;
import java.util.stream.Collectors;

import com.googlecode.objectify.Key;

import fr.loseawards.model.Avatar;
import fr.loseawards.model.Category;
import fr.loseawards.model.Comment;
import fr.loseawards.model.Decision;
import fr.loseawards.model.Global;
import fr.loseawards.model.Image;
import fr.loseawards.model.Nomination;
import fr.loseawards.model.User;
import fr.loseawards.model.Vote;

public class PersistenceService {
	private static final PersistenceService instance = new PersistenceService();
//	private final Logger log = Logger.getLogger(PersistenceService.class.getName());
	
	protected PersistenceService() {
	}
	
	public static PersistenceService getInstance() {
		return instance;
	}
	
	// ========== Gestion de la classe User ==========
	
	/**
	 * Retourne un utilisateur.
	 * @param id
	 * @return
	 */
	public User getUser(Long id) {
		return ofy().load().type(User.class).id(id).now();
	}
	
	/**
	 * Ajoute un utilisateur.
	 * @param user
	 */	
	public void addUser(User user) {
		ofy().save().entity(user).now();
	}
	
	/**
	 * Met à jour un utilisateur.
	 * @param user
	 */
	public void updateUser(User user) {
		User oldUser = ofy().load().type(User.class).id(user.getId()).now();
		oldUser.setFirstName(user.getFirstName());
		oldUser.setLastName(user.getLastName());
		oldUser.setEmail(user.getEmail());
		oldUser.setPassword(user.getPassword());
		if (oldUser.getAvatarId() != null && (user.getAvatarId() == null || !user.getAvatarId().equals(oldUser.getAvatarId()))) {
			// L'avatar a été supprimé ou modifié 
			deleteAvatar(oldUser.getAvatarId());
		}
		oldUser.setAvatarId(user.getAvatarId());
		ofy().save().entity(oldUser).now();
	}

	/**
	 * Supprime un utilisateur.
	 * @param id
	 */
	public void deleteUser(Long id) {
		// Suppression des nominations et votes associés
		deleteNominationsOfUser(id);
		deleteVotesOfVoter(id);
		
		// Suppression de l'avatar
		User user = getUser(id);
		if (user.getAvatarId() != null) {
			deleteAvatar(user.getAvatarId());
		}
		
		ofy().delete().entity(user).now();
	}
	
	/**
	 * Suppression de tous les utilisateurs
	 */
	public void deleteUsers() {
//		ofy().delete().entities(getUsers());
		getUsers().forEach(user -> deleteUser(user.getId()));
	}
	
	/**
	 * Récupère la liste des utilisateurs.
	 * @return
	 */
	public List<User> getUsers() {
		return ofy().load().type(User.class).order("firstName").list();
	}
	
	// ========== Gestion de la classe Avatar ==========

	/**
	 * Retourne un avatar.
	 * @param id
	 * @return
	 */
	public Avatar getAvatar(Long id) {
		return ofy().load().type(Avatar.class).id(id).now();
	}
	
	/**
	 * Retourne tous les avatars.
	 * @return
	 */
	public List<Avatar> getAvatars() {
		return ofy().load().type(Avatar.class).list();
	}
	
	/**
	 * Ajoute un avatar.
	 * @param avatar
	 */
	public void addAvatar(Avatar avatar) {
		ofy().save().entity(avatar).now();
	}
	
	/**
	 * Supprime un avatar.
	 * @param id
	 */
	public void deleteAvatar(Long id) {
		ofy().delete().type(Avatar.class).id(id);
	}
	
	// ========== Gestion de la classe Category ==========

	/**
	 * Retourne une catégorie.
	 * @param id
	 * @return
	 */
	public Category getCategory(Long id) {
		return ofy().load().type(Category.class).id(id).now();
	}
	
	/**
	 * Ajoute une catégorie.
	 * @param category
	 */
	public void addCategory(Category category) {
		ofy().save().entity(category).now();
	}

	/**
	 * Supprime une catégorie.
	 * @param id
	 */
	public void deleteCategory(Long id) {
		// Suppression des nominations et votes associées
		deleteNominationsOfCategory(id);
		deleteVotesOfCategory(id);
		ofy().delete().type(Category.class).id(id);
	}
	
	/**
	 * Supprime toutes les catégories.
	 */
	public void deleteCategories() {
		getCategories().forEach(category -> deleteCategory(category.getId()));
	}

	/**
	 * Retourne la liste des catégories.
	 * @return
	 */
	public List<Category> getCategories() {
		return ofy().load().type(Category.class).order("name").list();
	}

	/**
	 * Met à jour une catégorie.
	 * @param category
	 */
	public void updateCategory(Category category) {
		Category oldcategory = ofy().load().type(Category.class).id(category.getId()).now();
		oldcategory.setName(category.getName());
		ofy().save().entity(oldcategory).now();
	}

	// ========== Gestion de la classe Nomination ==========

	public Nomination getNomination(Long id) {
		return ofy().load().type(Nomination.class).id(id).now();
	}
	
	/**
	 * Ajoute une nomination.
	 * @param nomination
	 */
	public void addNomination(Nomination nomination) {
		ofy().save().entity(nomination).now();
	}

	/**
	 * Supprime une nomination.
	 * @param id
	 */
	public void deleteNomination(Long id) {
		Nomination nomination = getNomination(id);
		
		// Suppression des commentaires associés
		deleteCommentsOfNomination(id);
		
		// Suppression de l'image associée
		if (nomination.getImageId() != null) {
			deleteImage(nomination.getImageId());
		}
		
		ofy().delete().entity(nomination);
	}
	
	/**
	 * Supprime toutes les nominations.
	 */
	public void deleteNominations() {
		getNominations().forEach(nomination -> deleteNomination(nomination.getId()));
	}
	
	/**
	 * Suppression les nominations d'un utilisateur.
	 * @param userId
	 */
	public void deleteNominationsOfUser(Long userId) {
		getNominationsByUser(userId).forEach(nomination -> deleteNomination(nomination.getId()));
	}
	
	/**
	 * Suppression les nominations d'une catégorie.
	 * @param userId
	 */
	public void deleteNominationsOfCategory(Long categoryId) {
		getNominationsByCategory(categoryId).forEach(nomination -> deleteNomination(nomination.getId()));
	}

	/**
	 * Retourne la liste des nominations.
	 * @return
	 */
	public List<Nomination> getNominations() {
		return ofy().load().type(Nomination.class).list();
	}

	/**
	 * Met à jour une nomination.
	 * @param nomination
	 */
	public void updateNomination(Nomination nomination) {
		Nomination oldNomination = ofy().load().type(Nomination.class).id(nomination.getId()).now();
		
		// L'image a-t-elle été changée ou supprimée ?
		if (oldNomination.getImageId() != null && (nomination.getImageId() == null || !nomination.getImageId().equals(oldNomination.getImageId()))) {
			deleteImage(oldNomination.getImageId());
		}
		
		oldNomination.setCategoryId(nomination.getCategoryId());
		oldNomination.setUsersIds(nomination.getUsersIds());
		oldNomination.setReason(nomination.getReason());
		oldNomination.setDate(nomination.getDate());
		oldNomination.setImageId(nomination.getImageId());
		ofy().save().entity(oldNomination).now();
	}
	
	/**
	 * Retourne les nominations par ordre décroissant de date.
	 * @return
	 */
	public List<Nomination> getOrderedNominations() {
		return ofy().load().type(Nomination.class).order("-date").list();
	}
	
	/**
	 * Retourne les nominations d'un utilisateur.
	 * @param userId
	 * @return
	 */
	public List<Nomination> getNominationsByUser(Long userId) {
//		return ofy().load().type(Nomination.class).filter("usersIds").list();
		
//		PersistenceManager pm = getPersistenceManager();
//		List<Nomination> result = null;
//		try {
//			Query query = pm.newQuery(Nomination.class, "usersIds == userIdParam");
//			query.declareParameters("Long userIdParam");
//			result = (List<Nomination>) query.execute(userId);
//		} finally {
//			pm.close();
//		}
//		return result;
		
		return getNominations().stream().filter(nomination -> nomination.getUsersIdsAsList().stream().anyMatch(userIdOfNomination -> userIdOfNomination.equals(userId))).collect(Collectors.toList());
	}
	
	/**
	 * Retourne les nominations d'une catégorie.
	 * @param categoryId
	 * @return
	 */
	protected List<Nomination> getNominationsByCategory(Long categoryId) {
//		Key<Nomination> categoryKey = Key.create(Nomination.class, categoryId);
		Key<Category> categoryKey = Key.create(Category.class, categoryId);
		return ofy().load().type(Nomination.class).filter("categoryId", categoryKey).list();
	}
	
	public List<Nomination> getNominationsWithImage() {
//		PersistenceManager pm = getPersistenceManager();
//		List<Nomination> result = null;
//		try {
//			Query query = pm.newQuery(Nomination.class, "imageId > -1");
//			result = (List<Nomination>) query.execute();
//		} finally {
//			pm.close();
//		}
//		return result;
		return ofy().load().type(Nomination.class).filter("imageId !=", null).list();
	}
	
	// ========== Gestion de la classe Image ==========

	/**
	 * Retourne une image.
	 * @param id
	 * @return
	 */
	public Image getImage(Long id) {
		return ofy().load().type(Image.class).id(id).now();
	}
	
	/**
	 * Retourne toutes les images.
	 * @return
	 */
	public List<Image> getImages() {
		return ofy().load().type(Image.class).list();
	}
	
	/**
	 * Ajoute une image.
	 * @param image
	 */
	public void addImage(Image image) {
		ofy().save().entity(image).now();
	}
	
	/**
	 * Supprime une image.
	 * @param id
	 */
	public void deleteImage(Long id) {
		ofy().delete().type(Image.class).id(id);
	}
	
	// ===== Gestion de la classe Global =====
	
	/**
	 * Récupère la liste des variables globales.
	 * @return
	 */
	public List<Global> getGlobals() {
		return ofy().load().type(Global.class).list();
	}

	/**
	 * Retourne une variable globale.
	 * @param id
	 * @return
	 */
	public Global getGlobal(Long id) {
		return ofy().load().type(Global.class).id(id).now();
	}
	
	/**
	 * Ajoute une variable globale.
	 * @param global
	 */
	public void addGlobal(Global global) {
		ofy().save().entity(global).now();
	}
	
	/**
	 * Supprime une variable globale.
	 * @param id
	 */
	public void deleteGlobal(Long id) {
		ofy().delete().type(Global.class).id(id);
	}
	
	/**
	 * Supprime toutes les variables globales.
	 * @param id
	 */
	public void deleteGlobals() {
		ofy().delete().entities(getGlobals());
	}
	
	/**
	 * Met à jour une variable globale.
	 * @param global
	 */
	public void updateGlobal(Global global) {
		Global oldGlobal = ofy().load().type(Global.class).id(global.getId()).now();
		oldGlobal.setKey(global.getKey());
		oldGlobal.setValue(global.getValue());
		oldGlobal.setValuesIds(global.getValuesIds());
		ofy().save().entity(oldGlobal).now();
	}
	
	/**
	 * Retourne une variable globale par son identifiant fonctionnel.
	 * @param key
	 * @return
	 */
	public Global getGlobalByKey(String key) {
		List<Global> result = ofy().load().type(Global.class).filter("key", key).list();
		if (result != null && !result.isEmpty()) {
			return result.get(0);
		}
		return null;
	}
	
	// ========== Gestion de la classe Comment ==========
	
	/**
	 * Retourne la liste des commentaires.
	 * @return
	 */
	public List<Comment> getComments() {
		return ofy().load().type(Comment.class).order("(-date").list();
	}

	/**
	 * Ajoute un commentaire.
	 * @param comment
	 */
	public void addComment(Comment comment) {
		ofy().save().entity(comment).now();
	}

	/**
	 * Retourne un commentaire.
	 * @param id
	 * @return
	 */
	public Comment getComment(Long id) {
		return ofy().load().type(Comment.class).id(id).now();
	}

	/**
	 * Supprime un commentaire.
	 * @param id
	 */
	public void deleteComment(Long id) {
		ofy().delete().type(Comment.class).id(id);
	}
	
	/**
	 * Supprime tous les commentaires.
	 */
	public void deleteComments() {
		ofy().delete().entities(getComments());	
	}
	
	/**
	 * Supprime les commentaires d'une nomination.
	 * @param nominationId
	 */
	public void deleteCommentsOfNomination(Long nominationId) {
		List<Comment> comments = getCommentsByNomination(nominationId);
		if (comments != null) {
			comments.forEach(comment -> {
				deleteComment(comment.getId());
			});
		}
	}
	
	/**
	 * Met à jour un commentaire.
	 * @param comment
	 */
	public void updateComment(Comment comment) {
		Comment oldComment = ofy().load().type(Comment.class).id(comment.getId()).now();
		oldComment.setAuthorId(comment.getAuthorId());
		oldComment.setContent(comment.getContent());
		oldComment.setDate(comment.getDate());
		oldComment.setNominationId(comment.getNominationId());
		ofy().save().entity(oldComment).now();
	}

	/**
	 * Retourne les commentaires d'une nominations.
	 * @param nominationId
	 * @return
	 */
	public List<Comment> getCommentsByNomination(Long nominationId) {
		Key<Nomination> nominationKey = Key.create(Nomination.class, nominationId);
		return ofy().load().type(Comment.class).filter("nominationId", nominationKey).list();
	}
	
	// ===== Gestion de la classe Vote =====
	
	/**
	 * Retourne un vote.
	 * @param id
	 * @return
	 */
	public Vote getVote(Long id) {
		return ofy().load().type(Vote.class).id(id).now();
	}
	
	/**
	 * Ajoute un vote.
	 * @param vote
	 */
	public void addVote(Vote vote) {
		ofy().save().entity(vote).now();
	}
	
	/**
	 * Supprime les votes d'un utilisateur.
	 * @param voterId
	 */
	public void deleteVotesOfVoter(Long voterId) {
		List<Vote> votes = getVotesByVoter(voterId);
		if (votes != null) {
			votes.forEach(vote -> {
				deleteVote(vote.getId());
			});
		}
	}
	
	/**
	 * Supprime les votes liés à une catégorie.
	 * @param categoryId
	 */
	public void deleteVotesOfCategory(Long categoryId) {
		List<Vote> votes = getVotesByCategory(categoryId);
		if (votes != null) {
			votes.forEach(vote -> {
				deleteVote(vote.getId());
			});
		}
	}
	
	/**
	 * Supprime tous les votes.
	 */
	public void deleteVotes() {
		ofy().delete().entities(getVotes());
	}
	
	/**
	 * Supprime un vote.
	 * @param id
	 */
	public void deleteVote(Long id) {
		ofy().delete().type(Vote.class).id(id);
	}
	
	/**
	 * Retourne tous les votes.
	 * @return
	 */
	public List<Vote> getVotes() {
		return ofy().load().type(Vote.class).list();
	}
	
	/**
	 * Retourne les votes d'un utilisateur.
	 * @param voterId
	 * @return
	 */
	public List<Vote> getVotesByVoter(Long voterId) {
		Key<User> voterKey = Key.create(User.class, voterId);
		return ofy().load().type(Vote.class).filter("voterId", voterKey).list();
	}
	
	/**
	 * Retourne les votes d'une catégorie.
	 * @param voterId
	 * @return
	 */
	public List<Vote> getVotesByCategory(Long categoryId) {
		Key<Category> categoryKey = Key.create(Category.class, categoryId);
		return ofy().load().type(Vote.class).filter("categoryId", categoryKey).list();
	}
	
	// ===== Gestion de la classe Decision =====
	
	/**
	 * Ajoute une décision.
	 * @param decision
	 */
	public void addDecision(Decision decision) {
		ofy().save().entity(decision).now();
	}
	
	/**
	 * Supprime toutes les décisions.
	 */
	public void deleteDecisions() {
		ofy().delete().entities(getDecisions());
	}
	
	/**
	 * Retourne toutes les décisions.
	 * @return
	 */
	public List<Decision> getDecisions() {
		return ofy().load().type(Decision.class).list();
	}
	
	/**
	 * Retourne une décision.
	 * @param id
	 * @return
	 */
	public Decision getDecision(Long id) {
		return ofy().load().type(Decision.class).id(id).now();
	}
	
	/**
	 * Supprime une décision.
	 * @param id
	 */
	public void deleteDecision(Long id) {
		ofy().delete().type(Decision.class).id(id);
	}
}
