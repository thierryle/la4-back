package fr.loseawards.util;

import com.google.appengine.api.datastore.Blob;
import fr.loseawards.archive.dto.ArchiveDTO;
import fr.loseawards.archiveaward.dto.ArchiveAwardDTO;
import fr.loseawards.archivecategory.dto.ArchiveCategoryDTO;
import fr.loseawards.archivereport.dto.ArchiveReportDTO;
import fr.loseawards.archiveuser.dto.ArchiveUserDTO;
import fr.loseawards.avatar.dto.AvatarDTO;
import fr.loseawards.category.dto.CategoryDTO;
import fr.loseawards.comment.dto.CommentDTO;
import fr.loseawards.decision.dto.DecisionDTO;
import fr.loseawards.global.dto.GlobalDTO;
import fr.loseawards.image.dto.ImageDTO;
import fr.loseawards.model.*;
import fr.loseawards.nomination.dto.NominationDTO;
import fr.loseawards.user.dto.UserDTO;
import fr.loseawards.vote.dto.VoteDTO;

import java.io.UnsupportedEncodingException;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.*;
import java.util.stream.Collectors;

public class Converter {
	private static SimpleDateFormat dateFormat = new SimpleDateFormat("dd/MM/yyyy HH:mm:ss");
	
	// ===== User =====
	
	public static UserDTO toDTO(final User user) {
		return new UserDTO(user.getId(), user.getFirstName(), user.getLastName(), user.getEmail(), user.getAvatarId());
	}
	
	public static List<UserDTO> toUsersDTO(final List<User> users) {
		return users.stream().map(Converter::toDTO).collect(Collectors.toList());
	}
	
	public static User fromDTO(final UserDTO userDTO) {
		return new User(userDTO.getId(), userDTO.getFirstName(), userDTO.getLastName(), userDTO.getEmail(), userDTO.getAvatarId());
	}
	
	// ===== Nomination =====
	
	public static NominationDTO toDTO(final Nomination nomination) {
		return new NominationDTO(nomination.getId(), nomination.getUsersIdsAsLong(), nomination.getCategoryId(), nomination.getReason(), nomination.getDate(), nomination.getImageId());
	}
	
	public static List<NominationDTO> toNominationsDTO(final List<Nomination> nominations) {
		return nominations.stream().map(Converter::toDTO).collect(Collectors.toList());
	}
	
	public static Nomination fromDTO(final NominationDTO nominationDTO) {
		return new Nomination(nominationDTO.getId(), nominationDTO.getUsersIds(), nominationDTO.getCategoryId(), nominationDTO.getReason(), nominationDTO.getDate(), nominationDTO.getImageId());
	}
	
	// ===== Category =====
	
	public static CategoryDTO toDTO(final Category category) {
		return new CategoryDTO(category.getId(), category.getName());
	}
	
	public static List<CategoryDTO> toCategoriesDTO(final List<Category> categories) {
		return categories.stream().map(Converter::toDTO).collect(Collectors.toList());
	}
	
	public static Category fromDTO(final CategoryDTO categoryDTO) {
		return new Category(categoryDTO.getId(), categoryDTO.getName());
	}
	
	// ===== Comment =====
	
	public static CommentDTO toDTO(final Comment comment) {
		return new CommentDTO(comment.getId(), comment.getAuthorId(), dateToString(comment.getDate()), comment.getContent(), comment.getNominationId());
	}
	
	public static List<CommentDTO> toCommentsDTO(final List<Comment> comments) {
		return comments.stream().map(Converter::toDTO).collect(Collectors.toList());
	}
	
	public static Comment fromDTO(final CommentDTO commentDTO) {
		return new Comment(commentDTO.getId(), commentDTO.getAuthorId(), commentDTO.getDate(), commentDTO.getContent(), commentDTO.getNominationId());
	}
	
	// ===== Avatar =====
	
	public static AvatarDTO toDTO(final Avatar avatar) {
		return new AvatarDTO(avatar.getId(), avatar.getImage());
	}
	
	public static List<AvatarDTO> toAvatarsDTO(final List<Avatar> avatars) {
		return avatars.stream().map(Converter::toDTO).collect(Collectors.toList());
	}
	
	// ===== Image =====
	
	public static ImageDTO toDTO(final Image image) {
		return new ImageDTO(image.getId(), image.getImage());
	}
	
	public static List<ImageDTO> toImagesDTO(final List<Image> images) {
		return images.stream().map(Converter::toDTO).collect(Collectors.toList());
	}
	
	// ===== Vote =====
	
	public static Vote fromDTO(final VoteDTO voteDTO) {
		return new Vote(voteDTO.getId(), voteDTO.getCategoryId(), voteDTO.getVoterId(), voteDTO.getNominationId(), voteDTO.getReason());
	}
	
	public static VoteDTO toDTO(final Vote vote) {
		return new VoteDTO(vote.getId(), vote.getCategoryId(), vote.getVoterId(), vote.getNominationId(), vote.getReason());
	}
	
	public static List<VoteDTO> toVotesDTO(List<Vote> votes) {
		return votes.stream().map(Converter::toDTO).collect(Collectors.toList());
	}
	
	// ===== Decision =====
	
	public static DecisionDTO toDTO(final Decision decision) {
		return new DecisionDTO(decision.getId(), decision.getCategoryId(), decision.getNominatedId());
	}
	
	public static List<DecisionDTO> toDecisionsDTO(final List<Decision> decisions) {
		return decisions.stream().map(Converter::toDTO).collect(Collectors.toList());
	}
	
	public static Decision fromDTO(final DecisionDTO decisionDTO) {
		return new Decision(decisionDTO.getId(), decisionDTO.getCategoryId(), decisionDTO.getNominatedId());
	}
	
	// ===== Global =====
	
	public static GlobalDTO toDTO(final Global global) {
		return new GlobalDTO(global.getId(), global.getKey(), global.getValue(), global.getValuesIdsAsList());
	}
	
	public static List<GlobalDTO> toGlobalsDTO(final List<Global> globals) {
		return globals.stream().map(Converter::toDTO).collect(Collectors.toList());
	}
	
	public static Global fromDTO(final GlobalDTO globalDTO) {
		return new Global(globalDTO.getId(), globalDTO.getKey(), globalDTO.getValue(), globalDTO.getValuesIds());
	}
	
	// ===== ArchiveUser =====

	public static ArchiveUserDTO toDTO(final ArchiveUser user) {
		return new ArchiveUserDTO(user.getId(), user.getFirstName(), user.getLastName(), user.getFirstYear(), user.getLastYear());
	}

	public static List<ArchiveUserDTO> toArchiveUsersDTO(final List<ArchiveUser> archiveUsers) {
		return archiveUsers.stream().map(Converter::toDTO).collect(Collectors.toList());
	}

	public static ArchiveUser fromDTO(final ArchiveUserDTO archiveUserDTO) {
		return new ArchiveUser(archiveUserDTO.getId(), archiveUserDTO.getFirstName(), archiveUserDTO.getLastName(), archiveUserDTO.getFirstYear(), archiveUserDTO.getLastYear());
	}

	// ===== ArchiveCategory =====

	public static ArchiveCategoryDTO toDTO(final ArchiveCategory archiveCategory) {
		return new ArchiveCategoryDTO(archiveCategory.getId(), archiveCategory.getName());
	}

	public static List<ArchiveCategoryDTO> toArchiveCategoriesDTO(final List<ArchiveCategory> archiveCategories) {
		return archiveCategories.stream().map(Converter::toDTO).collect(Collectors.toList());
	}

	public static ArchiveCategory fromDTO(final ArchiveCategoryDTO archiveCategoryDTO) {
		return new ArchiveCategory(archiveCategoryDTO.getId(), archiveCategoryDTO.getName());
	}

	// ===== Archive =====

	public static ArchiveDTO toDTO(final Archive archive, final List<ArchiveRank> archiveRanks) {
		Map<Integer, List<Long>> ranking = new HashMap<>();
		if (archiveRanks != null) {
			archiveRanks.forEach(archiveRank -> {
				ranking.put(archiveRank.getPosition(), archiveRank.getUsersIdsAsLong());
			});
		}

		return new ArchiveDTO(archive.getId(), archive.getYear(), archive.getCategoriesIdsAsLong(), ranking);
	}

	public static List<ArchiveDTO> toArchivesDTO(List<Archive> archives, List<ArchiveRank> archiveRanks) {
		return archives.stream().map(archive -> Converter.toDTO(archive, getArchiveRanksOfYear(archive.getYear(), archiveRanks))).collect(Collectors.toList());
	}

	public static List<ArchiveRank> getArchiveRanksOfYear(Integer year, final List<ArchiveRank> archiveRanks) {
		if (year == null) {
			return null;
		}
		return Util.getSublistByProperty(archiveRanks, "year", year);
	}

	public static Archive fromDTO(final ArchiveDTO archiveDTO) {
		return new Archive(archiveDTO.getId(), archiveDTO.getYear(), archiveDTO.getCategoriesIds());
	}

	// ===== ArchiveRank =====

	public static List<ArchiveRank> fromDTO(final Map<Integer, List<Long>> ranking, final Integer year) {
		if (ranking != null) {
			List<ArchiveRank> archiveRanks = new ArrayList<>();
			for (Integer rank : ranking.keySet()) {
				ArchiveRank archiveRank = new ArchiveRank(null, year, rank, ranking.get(rank));
				archiveRanks.add(archiveRank);
			}
			return archiveRanks;
		}
		return null;
	}

	// ===== ArchiveAward =====

	public static ArchiveAwardDTO toDTO(final ArchiveAward archiveAward) {
		return new ArchiveAwardDTO(archiveAward.getId(), archiveAward.getYear(), archiveAward.getCategoryIdAsLong(), archiveAward.getUsersIdsAsLong(), archiveAward.getReason());
	}

	public static List<ArchiveAwardDTO> toArchiveAwardsDTO(final List<ArchiveAward> archiveAwards) {
		return archiveAwards.stream().map(Converter::toDTO).collect(Collectors.toList());
	}

	public static ArchiveAward fromDTO(final ArchiveAwardDTO archiveAwardDTO) {
		return new ArchiveAward(archiveAwardDTO.getId(), archiveAwardDTO.getYear(), archiveAwardDTO.getCategoryId(), archiveAwardDTO.getUsersIds(), archiveAwardDTO.getReason());
	}

	// ===== ArchiveReport =====

	public static ArchiveReportDTO toDTO(final ArchiveReport archiveReport) {
		return new ArchiveReportDTO(archiveReport.getId(), archiveReport.getYear(), archiveReport.getMidReportTitle(), archiveReport.getMidReport(),
				archiveReport.getReportTitle(), archiveReport.getReport());
	}

	public static List<ArchiveReportDTO> toArchiveReportsDTO(final List<ArchiveReport> archiveReports) {
		return archiveReports.stream().map(Converter::toDTO).collect(Collectors.toList());
	}

	public static ArchiveReport fromDTO(final ArchiveReportDTO archiveReportDTO) {
		return new ArchiveReport(archiveReportDTO.getId(), archiveReportDTO.getYear(), archiveReportDTO.getMidReportTitle(), stringToBlob(archiveReportDTO.getMidReport()),
				archiveReportDTO.getReportTitle(), stringToBlob(archiveReportDTO.getReport()));
	}
	
	// ===== Blob =====
	
	public static String blobToString(final Blob blob) {
		try {
			return new String(blob.getBytes(), "UTF8");
		} catch (UnsupportedEncodingException e) {
			throw new IllegalArgumentException("Erreur dans la conversion", e);
		}
	}
	
	public static Blob stringToBlob(final String string) {
		if (string == null) {
			return null;
		}
		try {
			return new Blob(string.getBytes("UTF-8"));
		} catch (UnsupportedEncodingException e) {
			throw new IllegalArgumentException("Erreur dans la conversion", e);
		}
	}
	
	// ===== Date =====
	
	public static String dateToString(final Date date) {
		return dateFormat.format(date);
	}
	
	public static Date stringToDate(final String string) {
		try {
			return dateFormat.parse(string);
		} catch (ParseException e) {
			throw new IllegalArgumentException("Mauvais format de date", e);
		}
	}
}
