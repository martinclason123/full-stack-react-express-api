// Course is passed course titles and hrefs. It then returns a course link back to Courses
function Course(props) {
  return (
    <a
      className="course--module course--link"
      href={`/courses/${props.course.id}`}
    >
      <h2 className="course--label">Course</h2>
      <h3 className="course--title">{props.course.title}</h3>
    </a>
  );
}

export default Course;
