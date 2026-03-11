package model;

public class Feedback {
    private int id;
    private String name;
    private String faculty;
    private String course;
    private int rating;
    private String comment;
    private String sentiment;

    public Feedback() {}

    public Feedback(String name, String faculty, String course, int rating, String comment, String sentiment) {
        this.name = name;
        this.faculty = faculty;
        this.course = course;
        this.rating = rating;
        this.comment = comment;
        this.sentiment = sentiment;
    }

    // Getters and Setters
    public int getId() { return id; }
    public void setId(int id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getFaculty() { return faculty; }
    public void setFaculty(String faculty) { this.faculty = faculty; }

    public String getCourse() { return course; }
    public void setCourse(String course) { this.course = course; }

    public int getRating() { return rating; }
    public void setRating(int rating) { this.rating = rating; }

    public String getComment() { return comment; }
    public void setComment(String comment) { this.comment = comment; }

    public String getSentiment() { return sentiment; }
    public void setSentiment(String sentiment) { this.sentiment = sentiment; }
}
