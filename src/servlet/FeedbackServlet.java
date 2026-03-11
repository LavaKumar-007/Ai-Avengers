package servlet;

import dao.FeedbackDAO;
import model.Feedback;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.*;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.List;

@WebServlet("/submitFeedback")
public class FeedbackServlet extends HttpServlet {

    private FeedbackDAO feedbackDAO = new FeedbackDAO();

    // Positive keywords for sentiment analysis
    private static final String[] POSITIVE_WORDS = {
        "good", "great", "excellent", "helpful", "clear",
        "amazing", "wonderful", "best", "fantastic", "brilliant",
        "outstanding", "love", "enjoy", "informative", "well"
    };

    // Negative keywords for sentiment analysis
    private static final String[] NEGATIVE_WORDS = {
        "bad", "confusing", "slow", "boring", "poor",
        "terrible", "worst", "hate", "difficult", "unclear",
        "disappointing", "waste", "unhelpful", "awful", "horrible"
    };

    /**
     * Simple rule-based AI sentiment analysis.
     */
    private String analyzeSentiment(String comment) {
        String lower = comment.toLowerCase();
        int positiveScore = 0;
        int negativeScore = 0;

        for (String word : POSITIVE_WORDS) {
            if (lower.contains(word)) {
                positiveScore++;
            }
        }

        for (String word : NEGATIVE_WORDS) {
            if (lower.contains(word)) {
                negativeScore++;
            }
        }

        if (positiveScore > negativeScore) return "Positive";
        if (negativeScore > positiveScore) return "Negative";
        return "Neutral";
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        PrintWriter out = response.getWriter();

        String name = request.getParameter("name");
        String faculty = request.getParameter("faculty");
        String course = request.getParameter("course");
        String ratingStr = request.getParameter("rating");
        String comment = request.getParameter("comment");

        // Basic server-side validation
        if (name == null || name.trim().isEmpty() ||
            faculty == null || faculty.trim().isEmpty() ||
            course == null || course.trim().isEmpty() ||
            ratingStr == null || comment == null || comment.trim().length() < 10) {

            response.setStatus(400);
            out.print("{\"success\": false, \"message\": \"All fields are required. Comment must be at least 10 characters.\"}");
            return;
        }

        int rating;
        try {
            rating = Integer.parseInt(ratingStr);
            if (rating < 1 || rating > 5) throw new NumberFormatException();
        } catch (NumberFormatException e) {
            response.setStatus(400);
            out.print("{\"success\": false, \"message\": \"Invalid rating value.\"}");
            return;
        }

        // Perform AI sentiment analysis
        String sentiment = analyzeSentiment(comment);

        Feedback feedback = new Feedback(name.trim(), faculty.trim(), course.trim(), rating, comment.trim(), sentiment);
        boolean saved = feedbackDAO.saveFeedback(feedback);

        if (saved) {
            out.print("{\"success\": true, \"message\": \"Feedback submitted successfully!\", \"sentiment\": \"" + sentiment + "\"}");
        } else {
            response.setStatus(500);
            out.print("{\"success\": false, \"message\": \"Failed to save feedback. Please try again.\"}");
        }
    }

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        PrintWriter out = response.getWriter();

        // Check if admin is logged in
        HttpSession session = request.getSession(false);
        if (session == null || session.getAttribute("admin") == null) {
            response.setStatus(401);
            out.print("{\"success\": false, \"message\": \"Unauthorized\"}");
            return;
        }

        List<Feedback> feedbackList = feedbackDAO.getAllFeedback();

        StringBuilder json = new StringBuilder("[");
        for (int i = 0; i < feedbackList.size(); i++) {
            Feedback fb = feedbackList.get(i);
            json.append("{");
            json.append("\"id\":").append(fb.getId()).append(",");
            json.append("\"name\":\"").append(escapeJson(fb.getName())).append("\",");
            json.append("\"faculty\":\"").append(escapeJson(fb.getFaculty())).append("\",");
            json.append("\"course\":\"").append(escapeJson(fb.getCourse())).append("\",");
            json.append("\"rating\":").append(fb.getRating()).append(",");
            json.append("\"comment\":\"").append(escapeJson(fb.getComment())).append("\",");
            json.append("\"sentiment\":\"").append(escapeJson(fb.getSentiment())).append("\"");
            json.append("}");
            if (i < feedbackList.size() - 1) json.append(",");
        }
        json.append("]");

        out.print(json.toString());
    }

    private String escapeJson(String text) {
        if (text == null) return "";
        return text.replace("\\", "\\\\")
                   .replace("\"", "\\\"")
                   .replace("\n", "\\n")
                   .replace("\r", "\\r")
                   .replace("\t", "\\t");
    }
}
