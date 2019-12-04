package fr.loseawards.image.api;

import java.io.IOException;
import java.io.OutputStream;

import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import fr.loseawards.model.Image;
import fr.loseawards.persistence.PersistenceService;

@WebServlet(
    name = "ImageServlet",
    urlPatterns = {"/images/*"}
)
public class ImageServlet extends HttpServlet {
	private static final long serialVersionUID = -3948472654751400849L;

	@Override
	public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
		String[] pathParts = request.getPathInfo().split("/");
		
		response.setContentType("image/png");

		Image image = PersistenceService.getInstance().getImage(Long.parseLong(pathParts[1]));
		if (image == null) {
			response.sendError(HttpServletResponse.SC_NOT_FOUND);
		}

		OutputStream os = response.getOutputStream();
		os.write(image.getImage());
  }
}