// helper function to generate issue unique ID
var IssueID = function () {
  // Math.random should be unique because of its seeding algorithm.
  // Convert it to base 36 (numbers + letters), and grab the first 9 characters
  // after the decimal.
  return 'i' + Math.random().toString(36).substr(2, 9);
};

var CommentID = function () {
  // Math.random should be unique because of its seeding algorithm.
  // Convert it to base 36 (numbers + letters), and grab the first 9 characters
  // after the decimal.
  return 'c' + Math.random().toString(36).substr(2, 9);
};