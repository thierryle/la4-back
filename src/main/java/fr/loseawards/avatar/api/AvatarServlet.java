package fr.loseawards.avatar.api;

import java.io.IOException;
import java.io.OutputStream;

import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import fr.loseawards.model.Avatar;
import fr.loseawards.persistence.PersistenceService;

@WebServlet(
    name = "AvatarServlet",
    urlPatterns = {"/avatars/*"}
)
public class AvatarServlet extends HttpServlet {
	private static final long serialVersionUID = -7314939036734635502L;

	@Override
	public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
		String[] pathParts = request.getPathInfo().split("/");
		
//	  response.setCharacterEncoding("UTF-8");
		response.setContentType("image/png");

		Avatar avatar = PersistenceService.getInstance().getAvatar(Long.parseLong(pathParts[1]));
		if (avatar == null) {
			response.sendError(HttpServletResponse.SC_NOT_FOUND);
		}

		OutputStream os = response.getOutputStream();
		os.write(avatar.getImage());
  }
}