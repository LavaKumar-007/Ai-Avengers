package dao;

import model.Feedback;
import util.DBConnection;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class FeedbackDAO {

    public boolean saveFeedback(Feedback feedback) {
        String sql = "INSERT INTO feedback (name, faculty, course, rating, comment, sentiment) VALUES (?, ?, ?, ?, ?, ?)";

        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setString(1, feedback.getName());
            ps.setString(2, feedback.getFaculty());
            ps.setString(3, feedback.getCourse());
            ps.setInt(4, feedback.getRating());
            ps.setString(5, feedback.getComment());
            ps.setString(6, feedback.getSentiment());

            int rows = ps.executeUpdate();
            return rows > 0;

        } catch (SQLException e) {
            e.printStackTrace();
            return false;
        }
    }

    public List<Feedback> getAllFeedback() {
        List<Feedback> feedbackList = new ArrayList<>();
        String sql = "SELECT * FROM feedback ORDER BY id DESC";

        try (Connection conn = DBConnection.getConnection();
             Statement stmt = conn.createStatement();
             ResultSet rs = stmt.executeQuery(sql)) {

            while (rs.next()) {
                Feedback fb = new Feedback();
                fb.setId(rs.getInt("id"));
                fb.setName(rs.getString("name"));
                fb.setFaculty(rs.getString("faculty"));
                fb.setCourse(rs.getString("course"));
                fb.setRating(rs.getInt("rating"));
                fb.setComment(rs.getString("comment"));
                fb.setSentiment(rs.getString("sentiment"));
                feedbackList.add(fb);
            }

        } catch (SQLException e) {
            e.printStackTrace();
        }

        return feedbackList;
    }
}
